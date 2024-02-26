import { useMemo } from 'react';

import type { Card } from '@data/Card';
import { useAspectFilterStore } from '@data/stores/useAspectFilterStore';

export const useAspectCardFilter = (cards?: Card[]) => {
  const aspectFilters = useAspectFilterStore((state) => state.aspects);

  // TODO: neutral
  const filteredCards = useMemo(
    () =>
      cards?.filter((card) => {
        return card.attributes.aspects.data.every((aspect) =>
          aspectFilters.includes(aspect.attributes.name),
        );
      }),
    [cards, aspectFilters],
  );

  return filteredCards;
};
