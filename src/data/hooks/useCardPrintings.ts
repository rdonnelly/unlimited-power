import { useQuery, useQueryClient } from '@tanstack/react-query';

import { type CardPrintingsResponse } from '@data/CardResponse';
import { getCachedCard } from '@data/getCachedCard';

import { HttpError } from '@data/queryHelpers';

const fetchCardPrintings = async (id: number, signal?: AbortSignal) => {
  const response = await fetch(
    `https://admin.starwarsunlimited.com/api/card/printings/${id}`,
    { signal },
  );

  if (!response.ok) {
    throw new HttpError(response.status);
  }

  const body = (await response.json()) as CardPrintingsResponse;

  return body.data;
};

export function useCardPrintings(cardId: number) {
  const queryClient = useQueryClient();
  const card = getCachedCard(queryClient, cardId);
  const cachedPrintings = card
    ? { original: { ...card.attributes, id: card.id, variantTypes: null } }
    : undefined;
  const query = useQuery<CardPrintingsResponse['data']>({
    queryKey: ['card-printing', cardId],
    queryFn: ({ signal }) => fetchCardPrintings(cardId, signal),
    enabled: Number.isInteger(cardId) && cardId > 0,
    placeholderData: cachedPrintings,
  });
  return { ...query, data: query.data ?? cachedPrintings };
}
