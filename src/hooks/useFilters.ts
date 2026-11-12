import { resetAllFilters } from '@data/stores/resetAllFilters';
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
  const { isActive: isSearchActive } = useSearchFilterStore(
    useShallow(isSearchActiveSelector),
  );

  const { isActive: isAspectActive } = useAspectFilterStore(
    useShallow(isAspectActiveSelector),
  );

  const { isActive: isExpansionActive } = useExpansionFilterStore(
    useShallow(isExpansionActiveSelector),
  );

  const { isActive: isRarityActive } = useRarityFilterStore(
    useShallow(isRarityActiveSelector),
  );

  const { isActive: isTypeActive } = useTypeFilterStore(
    useShallow(isTypeActiveSelector),
  );

  const reset = resetAllFilters;

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
