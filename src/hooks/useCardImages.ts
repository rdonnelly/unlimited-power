import { useWindowDimensions } from 'react-native';

import type { CardDetailImageProps } from '@components/CardDetailImage';
import type { BaseCardAttributes } from '@data/Card';
import { getCardImages } from '@data/cardImages';

export function useCardImages(
  selectedVariantCardAttributes?: BaseCardAttributes,
  standardVariantCardAttributes?: BaseCardAttributes,
): CardDetailImageProps[] {
  const { width: windowWidth } = useWindowDimensions();

  const imageWidth = Math.min(windowWidth - 64, 512);

  return getCardImages(
    selectedVariantCardAttributes,
    standardVariantCardAttributes,
    imageWidth,
  );
}
