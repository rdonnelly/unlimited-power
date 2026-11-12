import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchCards } from '@data/fetchCards';
import { hasNoSelections } from '@data/CardFilters';
import { useCardsQueryKey } from '@data/hooks/useCardsQueryKey';
import { shouldRetryQuery } from '@data/queryHelpers';

export function useCards(enabled = true) {
  const queryKey = useCardsQueryKey();

  return useInfiniteQuery({
    queryKey,
    queryFn: ({ queryKey, pageParam, signal }) =>
      fetchCards(queryKey[1], pageParam, signal),
    initialPageParam: 1,
    enabled,
    networkMode: hasNoSelections(queryKey[1]) ? 'always' : 'online',
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.pagination.page >= lastPage.meta.pagination.pageCount) {
        return undefined;
      }

      return lastPage.meta.pagination.page + 1;
    },
    retry: shouldRetryQuery,
  });
}
