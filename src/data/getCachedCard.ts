import type { InfiniteData, QueryClient } from '@tanstack/react-query';
import type { CardsResponse } from '@data/CardsResponse';

export function getCachedCard(client: QueryClient, cardId: number) {
  const entries = client.getQueriesData<InfiniteData<CardsResponse>>({
    queryKey: ['cards'],
  });
  for (const [, data] of entries) {
    for (const page of data?.pages ?? []) {
      const card = page.data.find((item) => item.id === cardId);
      if (card) return card;
    }
  }
}
