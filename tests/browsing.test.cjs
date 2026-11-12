const assert = require('node:assert/strict');
const { test } = require('node:test');
const { setTimeout: wait } = require('node:timers/promises');
const qs = require('qs');
const { QueryClient } = require('@tanstack/react-query');
const {
  normalizeCardFilters,
  hasNoSelections,
  matchesAspects,
  buildCardFilters,
  countActiveFilters,
  DEFAULT_FILTERS,
  FILTER_GROUPS,
  aspectFilterOptions,
  expansionFilterOptions,
  rarityFilterOptions,
  typeFilterOptions,
} = require('@data/CardFilters');
const { useFilterStore } = require('@data/stores/useFilterStore');
const resetAllFilters = () => useFilterStore.getState().reset();
const { createSearchController } = require('@data/searchController');
const { fetchCards } = require('@data/fetchCards');
const {
  HttpError,
  shouldRetryQuery,
  QUERY_STALE_TIME,
  QUERY_CACHE_TIME,
} = require('@data/queryHelpers');
const { getCardImages } = require('@data/cardImages');
const { getCardVariants } = require('@data/cardVariants');
const { getCachedCard } = require('@data/getCachedCard');
const { parseAppIntent } = require('@data/appIntentParams');

const all = () => ({
  search: '',
  aspects: [...aspectFilterOptions],
  expansions: [...expansionFilterOptions],
  rarities: [...rarityFilterOptions],
  types: [...typeFilterOptions],
});
const card = (id, aspects = []) => ({
  id,
  attributes: {
    title: `Card ${id}`,
    aspects: { data: aspects.map((name) => ({ attributes: { name } })) },
  },
});
const page = (number, pageCount, data = []) => ({
  data,
  meta: {
    pagination: {
      page: number,
      pageCount,
      pageSize: 50,
      total: pageCount * 50,
    },
  },
});

test('filter identity is canonical, isolated, and includes Neutral', () => {
  const filters = all();
  const normalized = normalizeCardFilters(filters);
  assert.deepEqual(
    normalizeCardFilters({
      ...all(),
      aspects: [...all().aspects].reverse(),
      search: '  Luke  ',
    }),
    { ...normalized, search: 'Luke' },
  );
  filters.aspects.pop();
  assert.notDeepEqual(normalizeCardFilters(filters), normalized);
  assert.equal(matchesAspects(card(1), ['Neutral']), true);
  assert.equal(matchesAspects(card(1), ['Aggression']), false);
  assert.equal(
    matchesAspects(card(1, ['Aggression', 'Cunning']), ['Aggression']),
    false,
  );
  assert.equal(
    matchesAspects(card(1, ['Aggression', 'Aggression']), ['Aggression']),
    true,
  );
  for (const key of ['aspects', 'expansions', 'rarities', 'types'])
    assert.equal(hasNoSelections({ ...all(), [key]: [] }), true);
  const conditions = buildCardFilters({
    ...all(),
    search: 'Luke',
    aspects: ['Neutral'],
  }).$and;
  assert.deepEqual(conditions[0], { variantOf: { id: { $null: true } } });
  assert.equal(conditions[1].$or.length, 3);
  assert.deepEqual(conditions[2], {
    $or: [{ aspects: { id: { $null: true } } }],
  });
});

test('None does not fetch; empty client-filtered pages advance to matches or exhaustion', async (t) => {
  let calls = 0;
  const signal = new AbortController().signal;
  t.mock.method(global, 'fetch', async (url, options) => {
    calls++;
    assert.equal(options.signal, signal);
    const request = qs.parse(new URL(url).search.slice(1));
    const number = Number(request.pagination.page);
    return {
      ok: true,
      json: async () =>
        page(number, 3, [
          card(number, number < 3 ? ['Aggression', 'Cunning'] : ['Aggression']),
        ]),
    };
  });
  assert.deepEqual(
    (await fetchCards({ ...all(), expansions: [] }, 1)).data,
    [],
  );
  assert.equal(calls, 0);
  const result = await fetchCards(
    { ...all(), aspects: ['Aggression'] },
    1,
    signal,
  );
  assert.deepEqual(
    result.data.map((item) => item.id),
    [3],
  );
  assert.equal(result.meta.pagination.page, 3);
  assert.equal(calls, 3);
  const empty = await fetchCards({ ...all(), aspects: ['Neutral'] }, 1, signal);
  assert.deepEqual(empty.data, []);
  assert.equal(empty.meta.pagination.page, 3);
});

test('fetching forwards cancellation and rejects bad pagination and HTTP failures', async (t) => {
  const controller = new AbortController();
  const mock = t.mock.method(global, 'fetch', async () => {
    controller.abort();
    return { ok: true, json: async () => page(1, 10, [card(1)]) };
  });
  await assert.rejects(fetchCards(all(), 1, controller.signal), {
    name: 'AbortError',
  });
  assert.equal(mock.mock.callCount(), 1);
  await assert.rejects(fetchCards(all(), 1, controller.signal), {
    name: 'AbortError',
  });
  assert.equal(mock.mock.callCount(), 1);
  mock.mock.mockImplementation(async () => ({
    ok: true,
    json: async () => page(1, 2.5),
  }));
  await assert.rejects(fetchCards(all(), 1), /Invalid card pagination/);
  mock.mock.mockImplementation(async () => ({
    ok: true,
    json: async () => page(1, 3),
  }));
  await assert.rejects(fetchCards(all(), 2), /Invalid card pagination/);
  mock.mock.mockImplementation(async () => ({ ok: false, status: 404 }));
  await assert.rejects(
    fetchCards(all(), 1),
    (error) => error instanceof HttpError && error.status === 404,
  );
});

test('only transient errors retry, at most twice', () => {
  for (const status of [400, 401, 403, 404])
    assert.equal(shouldRetryQuery(0, new HttpError(status)), false);
  for (const error of [
    new TypeError('network'),
    new HttpError(408),
    new HttpError(429),
    new HttpError(503),
  ]) {
    assert.equal(shouldRetryQuery(0, error), true);
    assert.equal(shouldRetryQuery(1, error), true);
    assert.equal(shouldRetryQuery(2, error), false);
  }
  assert.equal(
    shouldRetryQuery(0, new DOMException('cancelled', 'AbortError')),
    false,
  );
});

test('search drafts cannot return after Reset, intent updates, or unmount', async () => {
  resetAllFilters();
  let draft = '';
  const controller = createSearchController((value) => {
    draft = value;
  });
  try {
    controller.change('old edit');
    resetAllFilters();
    await wait(400);
    assert.equal(draft, '');
    assert.equal(useFilterStore.getState().search, '');
    controller.change('another edit');
    useFilterStore.getState().apply({ search: 'intent search' });
    await wait(400);
    assert.equal(draft, 'intent search');
    assert.equal(useFilterStore.getState().search, 'intent search');
    controller.change('  Luke  ');
    controller.submit();
    assert.equal(draft, '  Luke  ');
    assert.equal(useFilterStore.getState().search, 'Luke');
    controller.change('');
    assert.equal(useFilterStore.getState().search, '');
    controller.change('unmounted');
  } finally {
    controller.dispose();
  }
  await wait(400);
  assert.equal(useFilterStore.getState().search, '');
});

test('chip changes keep a pending search edit', async () => {
  resetAllFilters();
  let draft = '';
  const controller = createSearchController((value) => {
    draft = value;
  });
  try {
    controller.change('Vader');
    useFilterStore.getState().setGroup('rarities', ['Rare']);
    await wait(400);
    assert.equal(draft, 'Vader');
    assert.equal(useFilterStore.getState().search, 'Vader');
    assert.deepEqual(useFilterStore.getState().rarities, ['Rare']);
  } finally {
    controller.dispose();
    resetAllFilters();
  }
});

test('filter store normalizes groups and applies filters in one change', () => {
  resetAllFilters();
  const store = useFilterStore.getState();
  const reversed = [...expansionFilterOptions].reverse();
  store.setGroup('expansions', [...reversed, 'NOT_A_SET']);
  assert.deepEqual(useFilterStore.getState().expansions, [
    ...expansionFilterOptions,
  ]);

  let changes = 0;
  const unsubscribe = useFilterStore.subscribe(() => changes++);
  try {
    store.setGroup('types', ['Leader']);
    changes = 0;
    store.apply({ search: '  Luke ', expansions: ['SOR'] });
    assert.equal(changes, 1);
  } finally {
    unsubscribe();
  }
  const state = useFilterStore.getState();
  assert.equal(state.search, 'Luke');
  assert.deepEqual(state.expansions, ['SOR']);
  assert.deepEqual(state.types, [...typeFilterOptions]);
  resetAllFilters();
});

test('active filter count covers search and every group', () => {
  assert.equal(countActiveFilters(DEFAULT_FILTERS), 0);
  assert.equal(
    countActiveFilters({ ...DEFAULT_FILTERS, search: 'x', aspects: [] }),
    2,
  );
  assert.deepEqual(
    FILTER_GROUPS.map((group) => group.key),
    ['aspects', 'expansions', 'types', 'rarities'],
  );
  for (const group of FILTER_GROUPS) {
    assert.equal(
      countActiveFilters({ ...DEFAULT_FILTERS, [group.key]: [] }),
      1,
      group.key,
    );
  }
});

test('variants are sorted without mutating cached data; art and dimensions fall back together', () => {
  const printings = Object.freeze([
    { id: 2, variantTypes: [{ name: 'Showcase' }] },
    { id: 3, variantTypes: [{ name: 'Hyperspace' }] },
    { id: 4, variantTypes: [{ name: 'Foil' }] },
  ]);
  const variants = getCardVariants({ original: { id: 1 }, printings });
  assert.equal(variants.Standard, 1);
  assert.equal(variants.Hyperspace, 3);
  assert.equal(variants.Foil, undefined);
  assert.equal(printings[0].id, 2);
  const art = {
    data: {
      attributes: {
        width: 200,
        height: 300,
        url: 'https://example.test/card.png',
      },
    },
  };
  const images = getCardImages(
    { artFront: { data: null } },
    { artFront: art },
    100,
  );
  assert.equal(images[0].art, art);
  assert.equal(images[0].width, 100);
  assert.equal(images[0].height, 150);
  assert.deepEqual(getCardImages(undefined, undefined, 100), []);
});

test('in-memory cards remain usable after background errors', async () => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME,
        gcTime: QUERY_CACHE_TIME,
        retry: false,
      },
    },
  });
  try {
    const data = { pages: [page(1, 1, [card(42)])], pageParams: [1] };
    const key = ['cards', all()];
    client.setQueryData(key, data);
    assert.equal(getCachedCard(client, 42).id, 42);
    assert.equal(
      client
        .getQueryCache()
        .find({ queryKey: key })
        .isStaleByTime(QUERY_STALE_TIME),
      false,
    );
    await assert.rejects(
      client.fetchQuery({
        queryKey: key,
        staleTime: 0,
        queryFn: () => Promise.reject(new HttpError(503)),
      }),
    );
    assert.equal(client.getQueryState(key).status, 'error');
    assert.equal(client.getQueryData(key), data);
    assert.equal(getCachedCard(client, 42).id, 42);
  } finally {
    client.clear();
  }
});

test('fresh cards are reused within the session, not across app launches', async () => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { staleTime: QUERY_STALE_TIME, gcTime: QUERY_CACHE_TIME },
    },
  });
  const nextLaunch = new QueryClient();
  try {
    const data = card(42);
    client.setQueryData(['card', 42], data);
    const result = await client.fetchQuery({
      queryKey: ['card', 42],
      queryFn: () => assert.fail('Fresh cards should not refetch'),
    });
    assert.equal(result, data);
    assert.equal(nextLaunch.getQueryData(['card', 42]), undefined);
    assert.equal(QUERY_CACHE_TIME, 60 * 60 * 1000);
  } finally {
    client.clear();
    nextLaunch.clear();
  }
});

test('intent validation rejects malformed, nonpositive, and unknown inputs', () => {
  assert.equal(
    parseAppIntent({ name: 'openCard', params: { id: -1, title: 'Bad' } }),
    null,
  );
  assert.equal(
    parseAppIntent({ name: 'openCard', params: { id: 1.5, title: 'Bad' } }),
    null,
  );
  assert.equal(
    parseAppIntent({ name: 'showExpansion', params: { expansion: 'unknown' } }),
    null,
  );
  assert.equal(parseAppIntent({ name: 'unknown', params: {} }), null);
  assert.equal(
    parseAppIntent({ name: 'searchCards', params: { query: '  Luke  ' } })
      .params.query,
    'Luke',
  );
  assert.equal(
    parseAppIntent({ name: 'openCard', params: { id: 42, title: 'Card' } })
      .params.id,
    42,
  );
});
