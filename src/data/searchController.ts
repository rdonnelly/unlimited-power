import debounce from 'lodash/debounce';
import { useSearchFilterStore } from '@data/stores/useSearchFilterStore';

export function createSearchController(onDraft: (text: string) => void) {
  let committing = false;
  const commit = debounce((text: string) => {
    committing = true;
    try {
      useSearchFilterStore.getState().update(text.trim() || undefined);
    } finally {
      committing = false;
    }
  }, 350);
  const unsubscribe = useSearchFilterStore.subscribe((state) => {
    // Same-value resets must also cancel a pending edit.
    if (!committing) {
      commit.cancel();
      onDraft(state.searchString ?? '');
    }
  });
  onDraft(useSearchFilterStore.getState().searchString ?? '');
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
