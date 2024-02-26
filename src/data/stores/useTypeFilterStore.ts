import { create } from 'zustand';

import { TypeCodes } from '@data/Type';

export const typeFilterOptions = [
  ...Object.keys(TypeCodes),
] as (keyof typeof TypeCodes)[];

type State = {
  types: (typeof typeFilterOptions)[number][];
};

type Action = {
  update: (types: (typeof typeFilterOptions)[number][]) => void;
  toggle: (
    type: (typeof typeFilterOptions)[number],
    isSelected: boolean,
  ) => void;
  selectAll: () => void;
  selectNone: () => void;
};

export const useTypeFilterStore = create<State & Action>((set) => ({
  types: [...typeFilterOptions],
  update: (types) => set({ types }),
  toggle: (type, isSelected) =>
    set((state) =>
      isSelected
        ? {
            types: [...state.types].filter((a) => {
              return a !== type;
            }),
          }
        : {
            types: [...state.types, type].filter((a, i, self) => {
              return self.indexOf(a) === i;
            }),
          },
    ),
  selectAll: () => set({ types: [...typeFilterOptions] }),
  selectNone: () => set({ types: [] }),
}));
