import { useMemo } from 'react';

import { normalizeCardFilters } from '@data/CardFilters';
import { useAspectFilterStore } from '@data/stores/useAspectFilterStore';
import { useExpansionFilterStore } from '@data/stores/useExpansionFilterStore';
import { useRarityFilterStore } from '@data/stores/useRarityFilterStore';
import { useSearchFilterStore } from '@data/stores/useSearchFilterStore';
import { useTypeFilterStore } from '@data/stores/useTypeFilterStore';

export function useCardsQueryKey() {
  const searchString = useSearchFilterStore((state) => state.searchString);
  const aspectFilters = useAspectFilterStore((state) => state.aspects);
  const expansionFilters = useExpansionFilterStore((state) => state.expansions);
  const rarityFilters = useRarityFilterStore((state) => state.rarities);
  const typeFilters = useTypeFilterStore((state) => state.types);

  const queryKey = useMemo(
    () =>
      [
        'cards',
        normalizeCardFilters({
          search: searchString ?? '',
          aspects: aspectFilters,
          expansions: expansionFilters,
          rarities: rarityFilters,
          types: typeFilters,
        }),
      ] as const,
    [searchString, aspectFilters, expansionFilters, rarityFilters, typeFilters],
  );

  return queryKey;
}
