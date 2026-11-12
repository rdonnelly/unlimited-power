import { useQuery, useQueryClient } from '@tanstack/react-query';

import { type CardResponse } from '@data/CardResponse';
import { getCachedCard } from '@data/getCachedCard';

import { HttpError } from '@data/queryHelpers';

const fetchCardDetails = async (id: number, signal?: AbortSignal) => {
  const response = await fetch(
    `https://admin.starwarsunlimited.com/api/card/details/${id}`,
    { signal },
  );

  if (!response.ok) {
    throw new HttpError(response.status);
  }

  const body = (await response.json()) as CardResponse;

  return body.data;
};

export function useCardDetails(cardId: number) {
  const queryClient = useQueryClient();
  const cachedCard = getCachedCard(queryClient, cardId);
  const query = useQuery<CardResponse['data']>({
    queryKey: ['card', cardId],
    queryFn: ({ signal }) => fetchCardDetails(cardId, signal),
    enabled: Number.isInteger(cardId) && cardId > 0,
    placeholderData: cachedCard,
  });
  return { ...query, data: query.data ?? cachedCard };
}
