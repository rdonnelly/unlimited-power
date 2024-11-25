import { create } from 'zustand';

type State = {
  searchString: string | undefined;
};

type Action = {
  update: (searchString: string | undefined) => void;
  reset: () => void;
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

export const isSearchActiveSelector = (state: State & Action) => ({
  isActive: state.searchString !== undefined,
  reset: state.reset,
});
