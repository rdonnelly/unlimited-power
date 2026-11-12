import qs from 'qs';
import * as z from 'zod';

import { type CardFilters, FILTER_GROUPS } from '@data/CardFilters';

// Deep links (unlimitedpower://…):
//   card/:id                  a single card
//   cards?q=&aspects=&sets=&types=&rarities=
//                             the card list with these filters (comma-separated)
// A missing filter param means "all"; an empty one (sets=) means "none".
// Unknown values are dropped, and a param with only unknown values is ignored.

export type LinkTarget =
  | { screen: 'card'; id: number }
  | { screen: 'list'; filters?: Partial<CardFilters> };

const PARAM_FOR_GROUP = {
  aspects: 'aspects',
  expansions: 'sets',
  types: 'types',
  rarities: 'rarities',
} as const;

// Same rule as the openCard App Intent.
const cardIdSchema = z.coerce.number().int().positive();

function parseGroup(raw: unknown, options: readonly string[]) {
  if (typeof raw !== 'string') return undefined;
  if (raw.trim() === '') return [];
  const byLowercase = new Map(options.map((o) => [o.toLowerCase(), o]));
  const values = raw
    .split(',')
    .map((value) => byLowercase.get(value.trim().toLowerCase()))
    .filter((value) => value !== undefined);
  return values.length ? values : undefined;
}

export function parseListLinkParams(query: string): Partial<CardFilters> {
  const params = qs.parse(query, { ignoreQueryPrefix: true });
  const filters: Record<string, unknown> = {};
  if (typeof params.q === 'string' && params.q.trim()) {
    filters.search = params.q.trim();
  }
  for (const group of FILTER_GROUPS) {
    const values = parseGroup(
      params[PARAM_FOR_GROUP[group.key]],
      group.options.map((option) => option.value),
    );
    if (values) filters[group.key] = values;
  }
  return filters as Partial<CardFilters>;
}

export function parseCardLinkId(raw: string) {
  const result = cardIdSchema.safeParse(raw);
  return result.success ? result.data : undefined;
}

// `path` is the URL without its scheme prefix, e.g. "card/123" or "cards?sets=SOR".
export function parseLinkPath(path: string): LinkTarget {
  const [pathname = '', query = ''] = path.split('?', 2);
  const segments = pathname.split('/').filter(Boolean);

  const [first, second] = segments;
  if (first === 'card' && second !== undefined && segments.length === 2) {
    const id = parseCardLinkId(second);
    if (id !== undefined) return { screen: 'card', id };
  }
  if (first === 'cards' && segments.length === 1) {
    return { screen: 'list', filters: parseListLinkParams(query) };
  }
  // Unknown or invalid links fall back to the card list, unchanged.
  return { screen: 'list' };
}
