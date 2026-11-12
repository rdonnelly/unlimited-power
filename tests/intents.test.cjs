const assert = require('node:assert/strict');
const Module = require('node:module');
const test = require('node:test');
const React = require('react');
const {
  useSearchFilterStore,
} = require('../src/data/stores/useSearchFilterStore.ts');
const {
  useExpansionFilterStore,
} = require('../src/data/stores/useExpansionFilterStore.ts');

let processPending;
let onForeground;
let available = true;
let acknowledgmentFails = false;
let acknowledged = [];
let dismissed = 0;
let restored = 0;
const mocks = {
  react: {
    ...React,
    useRef: (current) => ({ current }),
    useCallback: (fn) => fn,
    useEffect: (fn) => fn(),
  },
  'react-native': {
    AppState: {
      addEventListener: (_event, fn) => {
        onForeground = fn;
        return { remove() {} };
      },
    },
    Keyboard: { dismiss() {} },
  },
  '@data/cardSearchSheet': {
    cardSearchSheet: {
      hide: async () => {
        dismissed++;
      },
      restore: async () => {
        restored++;
      },
    },
  },
  '@react-navigation/native': {
    StackActions: {
      popTo: (name) => ({ type: 'popTo', name }),
      push: (name, params) => ({ type: 'push', name, params }),
    },
  },
  'expo-app-intents': {
    isAvailable: () => available,
    setEntityCatalogAsync: async () => {},
    useAppIntents: (fn) => {
      processPending = fn;
    },
    removePendingInvocationAsync: async (id) => {
      if (acknowledgmentFails) throw new Error('acknowledgment failed');
      acknowledged.push(id);
    },
    getPendingInvocationsAsync: async () => [],
  },
};
const load = Module._load;
Module._load = function (id, ...args) {
  return mocks[id] ?? load.call(this, id, ...args);
};
const { useAppIntentHandler } = require('../src/hooks/useAppIntentHandler.ts');
Module._load = load;

test('intent delivery validates, dismisses filters, and retries acknowledgments without redispatch', async (t) => {
  t.mock.method(console, 'warn', () => {});
  const actions = [];
  let ready = false;
  let dispatchFails = false;
  useAppIntentHandler({
    isReady: () => ready,
    dispatch: (action) => {
      if (dispatchFails) throw new Error('navigation unavailable');
      actions.push(action);
    },
  });
  const card = {
    id: 'card-1',
    name: 'openCard',
    params: { id: 1, title: 'Test card' },
  };
  await processPending([card]);
  assert.equal(actions.length, 0);
  ready = true;
  acknowledgmentFails = true;
  await processPending([card]);
  assert.equal(actions.length, 1);
  assert.equal(dismissed, 1);
  assert.equal(restored, 0);
  acknowledgmentFails = false;
  await processPending([card]);
  assert.equal(actions.length, 1);
  assert.deepEqual(acknowledged, ['card-1']);

  dispatchFails = true;
  const retry = { ...card, id: 'retry' };
  await processPending([retry]);
  assert.ok(!acknowledged.includes('retry'));
  assert.equal(restored, 1);
  dispatchFails = false;
  await processPending([retry]);
  assert.equal(actions.length, 2);
  assert.ok(acknowledged.includes('retry'));

  await processPending([
    { id: 'invalid', name: 'openCard', params: { id: -1 } },
  ]);
  assert.equal(actions.length, 2);
  assert.ok(acknowledged.includes('invalid'));

  await processPending([
    { id: 'search', name: 'searchCards', params: { query: '  Luke  ' } },
  ]);
  assert.equal(useSearchFilterStore.getState().searchString, 'Luke');
  assert.equal(restored, 2);
  await processPending([
    { id: 'set', name: 'showExpansion', params: { expansion: 'SOR' } },
  ]);
  assert.deepEqual(useExpansionFilterStore.getState().expansions, ['SOR']);
  assert.equal(useSearchFilterStore.getState().searchString, undefined);
  assert.equal(typeof onForeground, 'function');
  assert.equal(restored, 3);

  available = false;
  await processPending([{ ...card, id: 'android' }]);
  assert.ok(!acknowledged.includes('android'));
});
