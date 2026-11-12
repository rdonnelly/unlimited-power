import { create } from 'zustand';

import {
  type CardFilters,
  DEFAULT_FILTERS,
  type FilterGroupKey,
  normalizeCardFilters,
} from '@data/CardFilters';

type State = CardFilters & {
  // Incremented whenever filters are replaced from outside the search field
  // (Reset, App Intents, deep links) so pending search edits are cancelled,
  // even when the resulting search text is unchanged.
  searchEpoch: number;
};

type Action = {
  setSearch: (search: string) => void;
  // Values outside the group's options are dropped by normalization.
  setGroup: (key: FilterGroupKey, values: readonly string[]) => void;
  reset: () => void;
  // Reset, then apply the given filters, as one state change.
  apply: (filters: Partial<CardFilters>) => void;
};

export type FilterStore = State & Action;

export const useFilterStore = create<FilterStore>((set) => ({
  ...DEFAULT_FILTERS,
  searchEpoch: 0,
  setSearch: (search) => set({ search: search.trim() }),
  setGroup: (key, values) =>
    set((state) => ({
      [key]: normalizeCardFilters({
        ...selectFilters(state),
        [key]: values,
      } as CardFilters)[key],
    })),
  reset: () =>
    set((state) => ({
      ...DEFAULT_FILTERS,
      searchEpoch: state.searchEpoch + 1,
    })),
  apply: (filters) =>
    set((state) => ({
      ...normalizeCardFilters({ ...DEFAULT_FILTERS, ...filters }),
      searchEpoch: state.searchEpoch + 1,
    })),
}));

export function selectFilters(state: State): CardFilters {
  const { search, aspects, expansions, rarities, types } = state;
  return { search, aspects, expansions, rarities, types };
}
