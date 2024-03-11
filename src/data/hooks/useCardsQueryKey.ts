import { useMemo } from 'react';

import { AspectCodes } from '@data/Aspect';
import { RarityCodes } from '@data/Rarity';
import {
  aspectFilterOptions,
  useAspectFilterStore,
} from '@data/stores/useAspectFilterStore';
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
  const rarityFilters = useRarityFilterStore((state) => state.rarities);
  const typeFilters = useTypeFilterStore((state) => state.types);
  const aspectFilters = useAspectFilterStore((state) => state.aspects);

  const queryKey = useMemo(() => {
    // orderBy[expansion][id]=asc&sort[0]=type.sortValue:asc,cardNumber
    const sort = ['type.sortValue:asc', 'cardNumber'];

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

    return ['cards', sort, filters];
  }, [searchString, rarityFilters, typeFilters, aspectFilters]);

  return queryKey;
}
