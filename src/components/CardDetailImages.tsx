import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CardDetailImage } from '@components/CardDetailImage';
import { Chips } from '@components/Chips';
import type { CardAttributes } from '@data/Card';
import { useCardImages } from '@hooks/useCardImages';
import { useTheme } from '@hooks/useTheme';

export type CardDetailImagesProps = {
  cardAttributes: CardAttributes;
};

export function CardDetailImages({ cardAttributes }: CardDetailImagesProps) {
  const { themeStyles } = useTheme();

  const variants = useMemo(() => {
    const v: Record<string, number | null> = { Original: null };

    if (cardAttributes.variants?.data) {
      cardAttributes.variants.data.map((variantCardAttributes, i) => {
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
  }, [cardAttributes]);

  const [variantKey, setVariantKey] = useState<string>('Original');

  const selectedCardAttributes = useMemo(() => {
    const variantIndex = variantKey
      ? variants[variantKey] ?? undefined
      : undefined;
    if (
      typeof variantIndex === 'number' &&
      cardAttributes.variants?.data[variantIndex]
    ) {
      return (
        cardAttributes.variants?.data[variantIndex]?.attributes ??
        cardAttributes
      );
    }

    return cardAttributes;
  }, [cardAttributes, variants, variantKey]);

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
      <View style={[styles.inner, themeStyles.themedbackground200]}>
        <View style={styles.variantSelectorHeading}>
          <Text
            style={[styles.variantSelectorHeadingText, themeStyles.themedColor]}
          >
            {(cardAttributes.variants?.data.length ?? 0) + 1} Variant
            {cardAttributes.variants?.data.length ? 's' : null}
          </Text>
        </View>
        <Chips
          options={Object.keys(variants).map((key) => ({ key, label: key }))}
          selectedOption={variantKey}
          onChange={(selection) => {
            setVariantKey(selection);
          }}
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
  },
  variantSelectorHeading: {
    marginBottom: 8,
  },
  variantSelectorHeadingText: {
    fontSize: 16,
    fontWeight: '700',
  },
  variantSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    width: '100%',
  },
  images: {
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
});
