import {
  type InfiniteData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { type CardResponse } from '@data/CardResponse';
import type { CardsResponse } from '@data/CardsResponse';
import { useCardsQueryKey } from '@data/hooks/useCardsQueryKey';

const fetchCard = async (id: number) => {
  const response = await fetch(
    `https://admin.starwarsunlimited.com/api/card/details/${id}`,
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const body = (await response.json()) as CardResponse;

  return body.data;
};

export function useCard(cardId: number) {
  const cardsQueryKey = useCardsQueryKey();

  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['card', cardId],
    queryFn: () => fetchCard(cardId),
    enabled: !!cardId,
    placeholderData: () => {
      const data =
        queryClient.getQueryData<InfiniteData<CardsResponse>>(cardsQueryKey);

      const card = data?.pages
        .map((page) => page.data.find((card) => card.id === cardId))
        .find(Boolean);

      return card;
    },
  });
}
