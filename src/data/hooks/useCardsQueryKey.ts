import { useMemo } from 'react';

import { AspectCodes } from '@data/Aspect';
import { ExpansionCodes } from '@data/Expansion';
import { RarityCodes } from '@data/Rarity';
import {
  aspectFilterOptions,
  useAspectFilterStore,
} from '@data/stores/useAspectFilterStore';
import {
  expansionFilterOptions,
  useExpansionFilterStore,
} from '@data/stores/useExpansionFilterStore';
import {
  rarityFilterOptions,
  useRarityFilterStore,
} from '@data/stores/useRarityFilterStore';
import { useSearchFilterStore } from '@data/stores/useSearchFilterStore';
import {
  typeFilterOptions,
  useTypeFilterStore,
} from '@data/stores/useTypeFilterStore';
import { TypeCodes } from '@data/Type';

export function useCardsQueryKey() {
  const searchString = useSearchFilterStore((state) => state.searchString);
  const aspectFilters = useAspectFilterStore((state) => state.aspects);
  const expansionFilters = useExpansionFilterStore((state) => state.expansions);
  const rarityFilters = useRarityFilterStore((state) => state.rarities);
  const typeFilters = useTypeFilterStore((state) => state.types);

  const queryKey = useMemo(() => {
    const sort = ['type.sortValue:asc', 'expansion.id:asc', 'cardNumber:asc'];

    const filters = [];

    if (searchString) {
      filters.push({
        $or: [
          {
            title: {
              $containsi: searchString,
            },
          },
          {
            traits: {
              name: {
                $containsi: searchString,
              },
            },
          },
          {
            keywords: {
              name: {
                $containsi: searchString,
              },
            },
          },
        ],
      });
    }

    const aspectExclusions = aspectFilterOptions.reduce(
      (acc, cur) =>
        !aspectFilters.includes(cur) && cur !== 'Neutral'
          ? acc.concat(AspectCodes[cur])
          : acc,
      [] as number[],
    );
    if (aspectExclusions.length) {
      if (aspectFilters.includes('Neutral')) {
        filters.push({
          $or: [
            {
              aspects: {
                id: {
                  $notIn: aspectExclusions,
                },
              },
            },
            {
              aspects: {
                id: {
                  $null: true,
                },
              },
            },
          ],
        });
      } else {
        filters.push({
          aspects: {
            id: {
              $notIn: aspectExclusions,
            },
          },
        });
      }
    }

    const expansionInclusions = expansionFilterOptions.reduce(
      (acc, cur) =>
        expansionFilters.includes(cur) ? acc.concat(ExpansionCodes[cur]) : acc,
      [] as number[],
    );
    if (
      expansionInclusions.length &&
      expansionInclusions.length < expansionFilterOptions.length
    ) {
      filters.push({
        expansion: {
          id: {
            $in: expansionInclusions,
          },
        },
      });
    }

    const rarityExclusions = rarityFilterOptions.reduce(
      (acc, cur) =>
        !rarityFilters.includes(cur) ? acc.concat(RarityCodes[cur]) : acc,
      [] as number[],
    );
    if (rarityExclusions.length) {
      filters.push({
        rarity: {
          id: {
            $notIn: rarityExclusions,
          },
        },
      });
    }

    const typeExclusions = typeFilterOptions.reduce(
      (acc, cur) =>
        !typeFilters.includes(cur) ? acc.concat(TypeCodes[cur]) : acc,
      [] as number[],
    );
    if (typeExclusions.length) {
      filters.push({
        type: {
          id: {
            $notIn: typeExclusions,
          },
        },
      });
    }

    return ['cards', sort, filters];
  }, [
    searchString,
    aspectFilters,
    expansionFilters,
    rarityFilters,
    typeFilters,
  ]);

  return queryKey;
}
