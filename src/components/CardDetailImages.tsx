import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CardDetailImage } from '@components/CardDetailImage';
import { Chips } from '@components/Chips';
import type { CardAttributes } from '@data/Card';
import { useCardImages } from '@hooks/useCardImages';
import { useTheme } from '@hooks/useTheme';

export type CardDetailImagesProps = {
  cardAttributes: CardAttributes;
  isFetching: boolean;
};

export function CardDetailImages({
  cardAttributes,
  isFetching,
}: CardDetailImagesProps) {
  const { themeStyles } = useTheme();

  const variants = useMemo(() => {
    const v: Record<string, number | null> = { Original: null };

    if (!isFetching && cardAttributes.variants) {
      let variantData = [];

      if (Array.isArray(cardAttributes.variants)) {
        variantData = cardAttributes.variants;
      } else {
        variantData = cardAttributes.variants.data;
      }

      variantData.map((variantCardAttributes, i) => {
        switch (true) {
          case variantCardAttributes.attributes.hyperspace:
            v.Hyperspace = i;
            break;
          case variantCardAttributes.attributes.showcase:
            v.Showcase = i;
            break;
          default:
            if (
              variantCardAttributes.attributes.variantTypes?.data[0]?.attributes
                .name
            ) {
              v[
                variantCardAttributes.attributes.variantTypes?.data[0].attributes.name
              ] = i;
            }
        }
      });
    }

    return v;
  }, [cardAttributes, isFetching]);

  const [variantKey, setVariantKey] = useState<string>('Original');

  const selectedCardAttributes = useMemo(() => {
    const variantIndex = variantKey
      ? (variants[variantKey] ?? undefined)
      : undefined;

    if (typeof variantIndex === 'number' && cardAttributes.variants) {
      if (Array.isArray(cardAttributes.variants)) {
        return (
          cardAttributes.variants[variantIndex]?.attributes ?? cardAttributes
        );
      } else {
        return (
          cardAttributes.variants.data[variantIndex]?.attributes ??
          cardAttributes
        );
      }
    }

    return cardAttributes;
  }, [cardAttributes, variants, variantKey]);

  const variantSelections = useMemo(() => {
    return [variantKey];
  }, [variantKey]);

  const variantOptions = useMemo(() => {
    const { Original, Hyperspace, Showcase, ...otherVariants } = variants;

    const options = [
      {
        value: 'Original',
        label: 'Original',
      },
      ...(Hyperspace !== undefined
        ? [
            {
              value: 'Hyperspace',
              label: 'Hyperspace',
            },
          ]
        : []),
      ...(Showcase !== undefined
        ? [
            {
              value: 'Showcase',
              label: 'Showcase',
            },
          ]
        : []),
      ...Object.keys(otherVariants).map((value) => ({
        value,
        label: value,
      })),
    ];

    return options;
  }, [variants]);

  const handleVariantSelection = useCallback((selection: string[]) => {
    const selectedVariantKey = selection.at(0);
    selectedVariantKey && setVariantKey(selectedVariantKey);
  }, []);

  const cardImages = useCardImages(selectedCardAttributes);

  if (
    !selectedCardAttributes ||
    (!selectedCardAttributes.artFront.data?.attributes &&
      !selectedCardAttributes.artBack.data?.attributes)
  ) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.inner, themeStyles.background200]}>
        <Chips
          heading="Variants"
          options={variantOptions}
          selections={variantSelections}
          onChange={handleVariantSelection}
          single
        />
        <View style={styles.images}>
          {cardImages.map((cardImageProps) => (
            <CardDetailImage {...cardImageProps} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    width: '100%',
  },
  inner: {
    alignItems: 'flex-start',
    borderRadius: 4,
    justifyContent: 'center',
    flex: 1,
    padding: 16,
    paddingBottom: 32,
  },
  variantSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  images: {
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
});
