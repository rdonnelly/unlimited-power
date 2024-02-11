import { useInfiniteQuery } from 'react-query';

import { type CardsResponse, CardsResponseSchema } from '@data/CardsResponse';

export const PAGE_SIZE = 50;

export function useCards() {
  const fetchCards = async ({ pageParam = 1 }) => {
    const response = await (
      await fetch(
        `https://admin.starwarsunlimited.com/api/cards?filters[variantOf][id][$null]=true&sort=cardNumber&pagination[page]=${pageParam}&pagination[pageSize]=${PAGE_SIZE}`,
      )
    ).json();

    const parsed = CardsResponseSchema.parse(response);
    return parsed;
  };

  return useInfiniteQuery<CardsResponse>({
    queryKey: ['cards'],
    queryFn: fetchCards,
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
  });
}
