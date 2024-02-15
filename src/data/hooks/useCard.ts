import { useQuery } from '@tanstack/react-query';

import { type CardResponse, CardResponseSchema } from '@data/CardResponse';

const fetchCard = async (id: number) => {
  const response = await (
    await fetch(`https://admin.starwarsunlimited.com/api/cards/${id}`)
  ).json();

  const parsed = CardResponseSchema.parse(response);
  return parsed;
};

export function useCard(cardId: number) {
  return useQuery<CardResponse>({
    queryKey: ['card', cardId],
    queryFn: () => fetchCard(cardId),
    enabled: !!cardId,
  });
}
