import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';

import {
  isAspectActiveSelector,
  useAspectFilterStore,
} from '@data/stores/useAspectFilterStore';
import {
  isExpansionActiveSelector,
  useExpansionFilterStore,
} from '@data/stores/useExpansionFilterStore';
import {
  isRarityActiveSelector,
  useRarityFilterStore,
} from '@data/stores/useRarityFilterStore';
import {
  isSearchActiveSelector,
  useSearchFilterStore,
} from '@data/stores/useSearchFilterStore';
import {
  isTypeActiveSelector,
  useTypeFilterStore,
} from '@data/stores/useTypeFilterStore';

export function useFilters() {
  const { isActive: isSearchActive, reset: resetSearch } = useSearchFilterStore(
    useShallow(isSearchActiveSelector),
  );

  const { isActive: isAspectActive, reset: resetAspect } = useAspectFilterStore(
    useShallow(isAspectActiveSelector),
  );

  const { isActive: isExpansionActive, reset: resetExpansion } =
    useExpansionFilterStore(useShallow(isExpansionActiveSelector));

  const { isActive: isRarityActive, reset: resetRarity } = useRarityFilterStore(
    useShallow(isRarityActiveSelector),
  );

  const { isActive: isTypeActive, reset: resetType } = useTypeFilterStore(
    useShallow(isTypeActiveSelector),
  );

  const reset = useCallback(() => {
    resetSearch();
    resetAspect();
    resetExpansion();
    resetRarity();
    resetType();
  }, [resetSearch, resetAspect, resetExpansion, resetRarity, resetType]);

  return {
    numFiltersApplied:
      +isSearchActive +
      +isAspectActive +
      +isExpansionActive +
      +isRarityActive +
      +isTypeActive,
    reset,
  };
}
