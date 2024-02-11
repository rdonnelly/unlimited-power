import { useQuery } from 'react-query';

import { type CardResponse, CardResponseSchema } from '@data/CardResponse';

export function useCard(cardId: number) {
  const fetchCard = async (id: number) => {
    const response = await (
      await fetch(`https://admin.starwarsunlimited.com/api/cards/${id}`)
    ).json();

    const parsed = CardResponseSchema.parse(response);
    return parsed;
  };

  return useQuery<CardResponse>({
    queryKey: ['card', cardId],
    queryFn: () => fetchCard(cardId),
    enabled: !!cardId,
  });
}
