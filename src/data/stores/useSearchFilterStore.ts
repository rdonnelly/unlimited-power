import { create } from 'zustand';

type State = {
  searchString: string | undefined;
};

type Action = {
  update: (searchString: string | undefined) => void;
};

export const useSearchFilterStore = create<State & Action>((set) => ({
  searchString: undefined,
  update: (searchString) =>
    set((_state) => ({
      searchString,
    })),
  reset: () =>
    set((_state) => ({
      searchString: undefined,
    })),
}));
