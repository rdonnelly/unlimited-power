import { useInfiniteQuery } from '@tanstack/react-query';

import { CardsResponseSchema } from '@data/CardsResponse';

export const PAGE_SIZE = 50;

const fetchCards = async ({ pageParam = 1 }) => {
  const orderBy =
    'orderBy[expansion][id]=asc&sort[0]=type.sortValue:asc,cardNumber';
  const filter = 'filters[variantOf][id][$null]=true';
  // 'filters[variantOf][id][$null]=true&filters[aspects][id][$in]=12&filters[aspects][id][$in]=2';
  const pagination = `pagination[page]=${pageParam}&pagination[pageSize]=${PAGE_SIZE}`;
  const response = await (
    await fetch(
      `https://admin.starwarsunlimited.com/api/cards?locale=en&${orderBy}&${filter}&${pagination}`,
    )
  ).json();

  const parsed = CardsResponseSchema.parse(response);
  return parsed;
};

export function useCards() {
  return useInfiniteQuery({
    queryKey: ['cards'],
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
