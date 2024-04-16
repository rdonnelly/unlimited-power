import { useInfiniteQuery } from '@tanstack/react-query';
import qs from 'qs';

import { type CardsResponse } from '@data/CardsResponse';
import { useCardsQueryKey } from '@data/hooks/useCardsQueryKey';
import { useAspectFilterStore } from '@data/stores/useAspectFilterStore';

export const PAGE_SIZE = 50;

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

  const response = await fetch(
    `https://admin.starwarsunlimited.com/api/cards?locale=en&${query}`,
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const body = (await response.json()) as CardsResponse;

  const aspectFilters = useAspectFilterStore.getState().aspects;

  body.data = body.data?.filter((card) => {
    return card.attributes.aspects.data.every((aspect) =>
      aspectFilters.includes(aspect.attributes.name),
    );
  });

  return body;
};

export function useCards() {
  const queryKey = useCardsQueryKey();

  return useInfiniteQuery({
    queryKey,
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
