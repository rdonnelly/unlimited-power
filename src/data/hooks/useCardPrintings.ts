import {
  type InfiniteData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { type CardPrintingsResponse } from '@data/CardResponse';
import type { CardsResponse } from '@data/CardsResponse';
import { useCardsQueryKey } from '@data/hooks/useCardsQueryKey';

const fetchCardPrintings = async (id: number) => {
  const response = await fetch(
    `https://admin.starwarsunlimited.com/api/card/printings/${id}`,
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const body = (await response.json()) as CardPrintingsResponse;

  return body.data.original;
};

export function useCardPrintings(cardId: number) {
  const cardsQueryKey = useCardsQueryKey();

  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['card', cardId],
    queryFn: () => fetchCardPrintings(cardId),
    enabled: !!cardId,
    placeholderData: () => {
      const data =
        queryClient.getQueryData<InfiniteData<CardsResponse>>(cardsQueryKey);

      const card = data?.pages
        .map((page) => page.data.find((card) => card.id === cardId))
        .find(Boolean);

      return card?.attributes;
    },
  });
}
