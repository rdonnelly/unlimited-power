import { create } from 'zustand';

import { ExpansionCodes } from '@data/Expansion';

export const expansionFilterOptions = [
  ...Object.keys(ExpansionCodes),
] as (keyof typeof ExpansionCodes)[];

type State = {
  expansions: (typeof expansionFilterOptions)[number][];
};

type Action = {
  update: (expansions: (typeof expansionFilterOptions)[number][]) => void;
  toggle: (
    expansion: (typeof expansionFilterOptions)[number],
    isSelected: boolean,
  ) => void;
  selectAll: () => void;
  selectNone: () => void;
};

export const useExpansionFilterStore = create<State & Action>((set) => ({
  expansions: [...expansionFilterOptions],
  update: (expansions) => set({ expansions }),
  toggle: (expansion, isSelected) =>
    set((state) =>
      isSelected
        ? {
            expansions: [...state.expansions].filter((a) => {
              return a !== expansion;
            }),
          }
        : {
            expansions: [...state.expansions, expansion].filter(
              (a, i, self) => {
                return self.indexOf(a) === i;
              },
            ),
          },
    ),
  selectAll: () => set({ expansions: [...expansionFilterOptions] }),
  selectNone: () => set({ expansions: [] }),
}));
