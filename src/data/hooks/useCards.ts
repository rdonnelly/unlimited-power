import { useInfiniteQuery } from '@tanstack/react-query';
import qs from 'qs';

import { CardsResponseSchema } from '@data/CardsResponse';
import { RarityCodes } from '@data/Rarity';
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

export const PAGE_SIZE = 50;

// @ts-expect-error
const fetchCards = async ({ pageParam = 1, queryKey }) => {
  const query = qs.stringify(
    {
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
    },
    {
      // encodeValuesOnly: true,
    },
  );

  const response = await (
    await fetch(
      `https://admin.starwarsunlimited.com/api/cards?locale=en&${query}`,
    )
  ).json();

  const parsed = CardsResponseSchema.parse(response);
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

  // const aspectFilters = useAspectFilterStore((state) => state.aspects);
  // const aspectExclusions = [];
  // aspectFilterOptions.forEach((aspect) => {
  //   if (!aspectFilters.includes(aspect)) {
  //     switch (aspect) {
  //       case 'Aggression':
  //         aspectExclusions.push(12);
  //         break;
  //       case 'Command':
  //         aspectExclusions.push(7);
  //         break;
  //       case 'Cunning':
  //         aspectExclusions.push(17);
  //         break;
  //       case 'Heroism':
  //         aspectExclusions.push(22);
  //         break;
  //       case 'Vigilance':
  //         aspectExclusions.push(2);
  //         break;
  //       case 'Villainy':
  //         aspectExclusions.push(27);
  //         break;
  //     }
  //   }
  // });

  // const aspectQuery = { $or: [] };
  // if (aspectExclusions.length) {
  //   // [$or][0][aspects][id][$notIn][0]=12
  //   aspectQuery.$or.push({
  //     aspects: {
  //       id: {
  //         $notIn: aspectExclusions,
  //       },
  //     },
  //   });

  //   if (aspectFilters.includes('Neutral')) {
  //     // [$or][1][aspects][id][$null]=true
  //     aspectQuery.$or.push({
  //       aspects: {
  //         id: {
  //           $null: true,
  //         },
  //       },
  //     });
  //   }
  // }

  return useInfiniteQuery({
    queryKey: ['cards', sort, filters],
    queryFn: fetchCards,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (
        lastPage.meta.pagination.page >= lastPage.meta.pagination.pageCount ||
        lastPage.data.length < PAGE_SIZE
      ) {
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
