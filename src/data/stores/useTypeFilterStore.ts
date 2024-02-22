import { create } from 'zustand';

import { TypeCodes } from '@data/Type';

export const typeFilterOptions = [
  ...Object.keys(TypeCodes),
] as (keyof typeof TypeCodes)[];

type State = {
  types: (typeof typeFilterOptions)[number][];
};

type Action = {
  add: (type: (typeof typeFilterOptions)[number]) => void;
  remove: (type: (typeof typeFilterOptions)[number]) => void;
};

export const useTypeFilterStore = create<State & Action>((set) => ({
  types: [...typeFilterOptions],
  add: (type) =>
    set((state) => ({
      types: [...state.types, type].filter((a, i, self) => {
        return self.indexOf(a) === i;
      }),
    })),
  remove: (type) =>
    set((state) => ({
      types: [...state.types].filter((a) => {
        return a !== type;
      }),
    })),
}));
