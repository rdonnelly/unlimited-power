import { AspectRank } from '@data/Aspect';
import type { CardAttributes } from '@data/Card';

export function getSortedAspects(card: CardAttributes) {
  return [
    ...card.aspects.data.map((data) => data.attributes.name),
    ...card.aspectDuplicates.data.map((data) => data.attributes.name),
  ].sort((a, b) => {
    if (AspectRank[a] > AspectRank[b]) {
      return 1;
    }
    if (AspectRank[b] > AspectRank[a]) {
      return -1;
    }
    return 0;
  });
}
