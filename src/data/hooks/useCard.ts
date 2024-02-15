import {
  type InfiniteData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { CardResponseSchema } from '@data/CardResponse';
import type { CardsResponse } from '@data/CardsResponse';

const fetchCard = async (id: number) => {
  const response = await (
    await fetch(`https://admin.starwarsunlimited.com/api/cards/${id}`)
  ).json();

  const parsed = CardResponseSchema.parse(response);
  return parsed.data;
};

export function useCard(cardId: number) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['card', cardId],
    queryFn: () => fetchCard(cardId),
    enabled: !!cardId,
    initialData: () => {
      // Get the query state
      const state = queryClient.getQueryState<
        InfiniteData<CardsResponse>,
        Error
      >(['cards']);

      // If the query exists and has data that is no older than 10 seconds...
      if (state && Date.now() - state.dataUpdatedAt <= 300 * 1000) {
        const single = state.data?.pages
          .map((page) => page.data.find((card) => card.id === cardId))
          .find(Boolean);
        return single;
      }

      // Otherwise, return undefined and let it fetch from a hard loading state!
    },
  });
}
