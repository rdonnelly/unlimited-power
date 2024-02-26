import { useInfiniteQuery } from '@tanstack/react-query';
import qs from 'qs';

import { AspectCodes } from '@data/Aspect';
import { CardsResponseSchema } from '@data/CardsResponse';
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

export const PAGE_SIZE = 100;

// @ts-expect-error
const fetchCards = async ({ pageParam = 1, queryKey }) => {
  const query = qs.stringify({
    sort: queryKey[1],
    pagination: {
      page: pageParam,
      pageSize: PAGE_SIZE,
    },
    filters: {
      $and: [
        {
          variantOf: {
            id: {
              $null: true,
            },
          },
        },
        ...queryKey[2],
      ],
    },
  });

  const response = await (
    await fetch(
      `https://admin.starwarsunlimited.com/api/cards?locale=en&${query}`,
    )
  ).json();

  const parsed = CardsResponseSchema.parse(response);

  const aspectFilters = useAspectFilterStore.getState().aspects;

  parsed.data = parsed.data?.filter((card) => {
    return card.attributes.aspects.data.every((aspect) =>
      aspectFilters.includes(aspect.attributes.name),
    );
  });

  return parsed;
};

export function useCards() {
  // orderBy[expansion][id]=asc&sort[0]=type.sortValue:asc,cardNumber
  const sort = ['type.sortValue:asc', 'cardNumber'];

  const filters = [];

  const searchString = useSearchFilterStore((state) => state.searchString);
  if (searchString) {
    filters.push({
      title: {
        $containsi: searchString,
      },
    });
  }

  const rarityFilters = useRarityFilterStore((state) => state.rarities);
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

  const typeFilters = useTypeFilterStore((state) => state.types);
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

  const aspectFilters = useAspectFilterStore((state) => state.aspects);
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

  return useInfiniteQuery({
    queryKey: ['cards', sort, filters],
    queryFn: fetchCards,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.pagination.page >= lastPage.meta.pagination.pageCount) {
        return undefined;
      }

      return lastPage.meta.pagination.page + 1;
    },
    getPreviousPageParam: (lastPage) => {
      if (lastPage.meta.pagination.page <= 1) {
        return undefined;
      }

      return lastPage.meta.pagination.page - 1;
    },
    retry: !__DEV__,
  });
}
