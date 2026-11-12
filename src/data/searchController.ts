import debounce from 'lodash/debounce';
import { useFilterStore } from '@data/stores/useFilterStore';

export function createSearchController(onDraft: (text: string) => void) {
  let committing = false;
  const commit = debounce((text: string) => {
    committing = true;
    try {
      useFilterStore.getState().setSearch(text);
    } finally {
      committing = false;
    }
  }, 350);
  const unsubscribe = useFilterStore.subscribe((state, prev) => {
    // Only external search changes cancel a pending edit. Chip changes don't,
    // and same-value resets still do (via searchEpoch).
    const external =
      state.searchEpoch !== prev.searchEpoch ||
      (state.search !== prev.search && !committing);
    if (external) {
      commit.cancel();
      onDraft(state.search);
    }
  });
  onDraft(useFilterStore.getState().search);
  return {
    change(text: string) {
      onDraft(text);
      commit(text);
      if (!text) commit.flush();
    },
    submit: () => commit.flush(),
    dispose() {
      unsubscribe();
      commit.cancel();
    },
  };
}
