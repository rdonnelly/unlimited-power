import { useCallback } from 'react';

import { useAspectFilterStore } from '@data/stores/useAspectFilterStore';
import { useExpansionFilterStore } from '@data/stores/useExpansionFilterStore';
import { useRarityFilterStore } from '@data/stores/useRarityFilterStore';
import { useSearchFilterStore } from '@data/stores/useSearchFilterStore';
import { useTypeFilterStore } from '@data/stores/useTypeFilterStore';

export function useFilters() {
  const resetSearch = useSearchFilterStore((state) => state.reset);
  const resetAspect = useAspectFilterStore((state) => state.selectAll);
  const resetExpansion = useExpansionFilterStore((state) => state.selectAll);
  const resetRarity = useRarityFilterStore((state) => state.selectAll);
  const resetType = useTypeFilterStore((state) => state.selectAll);

  const reset = useCallback(() => {
    resetSearch();
    resetAspect();
    resetExpansion();
    resetRarity();
    resetType();
  }, [resetSearch, resetAspect, resetExpansion, resetRarity, resetType]);

  return {
    reset,
  };
}
