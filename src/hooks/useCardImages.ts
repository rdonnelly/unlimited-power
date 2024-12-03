import { useWindowDimensions } from 'react-native';

import type { CardDetailImageProps } from '@components/CardDetailImage';
import type { BaseCardAttributes } from '@data/Card';

export function useCardImages(
  cardAttributes?: BaseCardAttributes,
): CardDetailImageProps[] {
  const { width: windowWidth } = useWindowDimensions();

  if (!cardAttributes) {
    return [];
  }

  const ratios = [];
  const images = [];

  if (cardAttributes.artFront.data?.attributes) {
    const frontWidth = cardAttributes.artFront.data.attributes.width;
    ratios.push(Math.min(windowWidth - 64, frontWidth) / frontWidth);
  }

  if (cardAttributes.artBack.data?.attributes) {
    const backWidth = cardAttributes.artBack.data.attributes.width;
    ratios.push(Math.min(windowWidth - 64, backWidth) / backWidth);
  }

  const ratio = Math.min(...ratios);

  if (cardAttributes.artFront.data?.attributes) {
    const frontHeight = cardAttributes.artFront.data.attributes.height;
    const frontWidth = cardAttributes.artFront.data.attributes.width;

    images.push({
      art: cardAttributes.artFront,
      height: frontHeight * ratio,
      width: frontWidth * ratio,
    });
  }

  if (cardAttributes.artBack.data?.attributes) {
    const backHeight = cardAttributes.artBack.data.attributes.height;
    const backWidth = cardAttributes.artBack.data.attributes.width;
    images.push({
      art: cardAttributes.artBack,
      height: backHeight * ratio,
      width: backWidth * ratio,
    });
  }

  return images;
}
