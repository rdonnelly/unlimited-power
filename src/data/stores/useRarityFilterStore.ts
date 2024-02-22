import { create } from 'zustand';

import { RarityCodes } from '@data/Rarity';

export const rarityFilterOptions = [
  ...Object.keys(RarityCodes),
] as (keyof typeof RarityCodes)[];

type State = {
  rarities: (typeof rarityFilterOptions)[number][];
};

type Action = {
  add: (rarity: (typeof rarityFilterOptions)[number]) => void;
  remove: (rarity: (typeof rarityFilterOptions)[number]) => void;
};

export const useRarityFilterStore = create<State & Action>((set) => ({
  rarities: [...rarityFilterOptions],
  add: (rarity) =>
    set((state) => ({
      rarities: [...state.rarities, rarity].filter((a, i, self) => {
        return self.indexOf(a) === i;
      }),
    })),
  remove: (rarity) =>
    set((state) => ({
      rarities: [...state.rarities].filter((a) => {
        return a !== rarity;
      }),
    })),
}));
