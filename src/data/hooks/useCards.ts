import { useQuery } from 'react-query';

import { type CardResponse, CardResponseSchema } from '@data/CardResponse';

export function useCards() {
  return useQuery<CardResponse>({
    queryKey: ['cards'],
    queryFn: async () => {
      const response = await (
        await fetch(
          'https://admin.starwarsunlimited.com/api/cards?filters[variantOf][id][$null]=true',
        )
      ).json();

      const parsed = CardResponseSchema.parse(response);
      return parsed;
    },
  });
}
