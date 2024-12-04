import { useWindowDimensions } from 'react-native';

import type { CardDetailImageProps } from '@components/CardDetailImage';
import type { BaseCardAttributes } from '@data/Card';

export function useCardImages(
  selectedVariantCardAttributes?: BaseCardAttributes,
  standardVariantCardAttributes?: BaseCardAttributes,
): CardDetailImageProps[] {
  const { width: windowWidth } = useWindowDimensions();

  if (!selectedVariantCardAttributes && !standardVariantCardAttributes) {
    return [];
  }

  const ratios = [];
  const images = [];

  const artFrontAttributes =
    selectedVariantCardAttributes?.artFront?.data?.attributes ??
    standardVariantCardAttributes?.artFront?.data?.attributes;
  const artBackAttributes =
    selectedVariantCardAttributes?.artBack?.data?.attributes ??
    standardVariantCardAttributes?.artBack?.data?.attributes;

  if (artFrontAttributes) {
    const frontWidth = artFrontAttributes.width;
    ratios.push(Math.min(windowWidth - 64, frontWidth) / frontWidth);
  }

  if (artBackAttributes) {
    const backWidth = artBackAttributes.width;
    ratios.push(Math.min(windowWidth - 64, backWidth) / backWidth);
  }

  const ratio = Math.min(...ratios);

  if (artFrontAttributes) {
    const frontHeight = artFrontAttributes.height;
    const frontWidth = artFrontAttributes.width;

    images.push({
      art: selectedVariantCardAttributes?.artFront,
      height: frontHeight * ratio,
      width: frontWidth * ratio,
    });
  }

  if (artBackAttributes) {
    const backHeight = artBackAttributes.height;
    const backWidth = artBackAttributes.width;
    images.push({
      art: selectedVariantCardAttributes?.artBack,
      height: backHeight * ratio,
      width: backWidth * ratio,
    });
  }

  return images;
}
