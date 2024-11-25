import { create } from 'zustand';

import { Aspects } from '@data/Aspect';

export const aspectFilterOptions = [...Aspects, 'Neutral'] as const;

type State = {
  aspects: (typeof aspectFilterOptions)[number][];
};

type Action = {
  update: (aspects: (typeof aspectFilterOptions)[number][]) => void;
  toggle: (
    type: (typeof aspectFilterOptions)[number],
    isSelected: boolean,
  ) => void;
  selectAll: () => void;
  selectNone: () => void;
};

export const useAspectFilterStore = create<State & Action>((set) => ({
  aspects: [...aspectFilterOptions],
  update: (aspects) => set({ aspects }),
  toggle: (aspect, isSelected) =>
    set((state) =>
      isSelected
        ? {
            aspects: [...state.aspects].filter((a) => {
              return a !== aspect;
            }),
          }
        : {
            aspects: [...state.aspects, aspect].filter((a, i, self) => {
              return self.indexOf(a) === i;
            }),
          },
    ),
  selectAll: () => set({ aspects: [...aspectFilterOptions] }),
  selectNone: () => set({ aspects: [] }),
}));

export const isAspectActiveSelector = (state: State & Action) => ({
  isActive: !aspectFilterOptions.every((selection) =>
    state.aspects.includes(selection),
  ),
  reset: state.selectAll,
});
