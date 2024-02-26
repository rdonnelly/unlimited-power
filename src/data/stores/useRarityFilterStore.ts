import { create } from 'zustand';

import { RarityCodes } from '@data/Rarity';

export const rarityFilterOptions = [
  ...Object.keys(RarityCodes),
] as (keyof typeof RarityCodes)[];

type State = {
  rarities: (typeof rarityFilterOptions)[number][];
};

type Action = {
  update: (rarities: (typeof rarityFilterOptions)[number][]) => void;
  toggle: (
    rarity: (typeof rarityFilterOptions)[number],
    isSelected: boolean,
  ) => void;
  selectAll: () => void;
  selectNone: () => void;
};

export const useRarityFilterStore = create<State & Action>((set) => ({
  rarities: [...rarityFilterOptions],
  update: (rarities) => set({ rarities }),
  toggle: (rarity, isSelected) =>
    set((state) =>
      isSelected
        ? {
            rarities: [...state.rarities].filter((a) => {
              return a !== rarity;
            }),
          }
        : {
            rarities: [...state.rarities, rarity].filter((a, i, self) => {
              return self.indexOf(a) === i;
            }),
          },
    ),
  selectAll: () => set({ rarities: [...rarityFilterOptions] }),
  selectNone: () => set({ rarities: [] }),
}));
