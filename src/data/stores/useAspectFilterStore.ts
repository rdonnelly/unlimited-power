import { create } from 'zustand';

import { Aspects } from '@data/Aspect';

export const aspectFilterOptions = [...Aspects, 'Neutral'] as const;

type State = {
  aspects: (typeof aspectFilterOptions)[number][];
};

type Action = {
  add: (aspect: (typeof aspectFilterOptions)[number]) => void;
  remove: (aspect: (typeof aspectFilterOptions)[number]) => void;
};

export const useAspectFilterStore = create<State & Action>((set) => ({
  aspects: [...aspectFilterOptions],
  add: (aspect) =>
    set((state) => ({
      aspects: [...state.aspects, aspect].filter((a, i, self) => {
        return self.indexOf(a) === i;
      }),
    })),
  remove: (aspect) =>
    set((state) => ({
      aspects: [...state.aspects].filter((a) => {
        return a !== aspect;
      }),
    })),
}));
