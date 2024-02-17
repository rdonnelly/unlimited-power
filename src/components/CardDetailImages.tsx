import { useMemo, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import type { CardAttributes } from '@data/Card';
import { useTheme } from '@hooks/useTheme';

import { Button } from './Button';
import { CardDetailImage } from './CardDetailImage';

export type CardDetailImagesProps = {
  cardAttributes: CardAttributes;
};

export function CardDetailImages({ cardAttributes }: CardDetailImagesProps) {
  const [variant, setVariant] = useState<number | false>(false);

  const { themeStyles } = useTheme();
  const { width: windowWidth } = useWindowDimensions();

  const selectedCardAttributes = useMemo(() => {
    if (typeof variant === 'number' && cardAttributes.variants?.data[variant]) {
      return cardAttributes.variants?.data[variant]?.attributes;
    }

    return cardAttributes;
  }, [variant]);

  if (
    !selectedCardAttributes ||
    (!selectedCardAttributes.artFront.data?.attributes &&
      !selectedCardAttributes.artBack.data?.attributes)
  ) {
    return null;
  }

  const ratios = [];
  const images = [];

  if (selectedCardAttributes.artFront.data?.attributes) {
    const frontWidth = selectedCardAttributes.artFront.data.attributes.width;
    ratios.push(Math.min(windowWidth - 64, frontWidth) / frontWidth);
  }

  if (selectedCardAttributes.artBack.data?.attributes) {
    const backWidth = selectedCardAttributes.artBack.data.attributes.width;
    ratios.push(Math.min(windowWidth - 64, backWidth) / backWidth);
  }

  const ratio = Math.min(...ratios);

  if (selectedCardAttributes.artFront.data?.attributes) {
    const frontHeight = selectedCardAttributes.artFront.data.attributes.height;
    const frontWidth = selectedCardAttributes.artFront.data.attributes.width;

    images.push(
      <CardDetailImage
        art={selectedCardAttributes.artFront}
        height={frontHeight * ratio}
        width={frontWidth * ratio}
        key={`card-image-${selectedCardAttributes.cardNumber}-front`}
      />,
    );
  }

  if (selectedCardAttributes.artBack.data?.attributes) {
    const backHeight = selectedCardAttributes.artBack.data.attributes.height;
    const backWidth = selectedCardAttributes.artBack.data.attributes.width;
    images.push(
      <CardDetailImage
        art={selectedCardAttributes.artBack}
        height={backHeight * ratio}
        width={backWidth * ratio}
        key={`card-image-${selectedCardAttributes.cardNumber}-back`}
      />,
    );
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
        <View style={styles.variantSelector}>
          <Chip
            label="Original"
            isActive={variant === false}
            handlePress={() => {
              setVariant(false);
            }}
            key="variant-chip-original"
          />
          {cardAttributes.variants?.data
            ? cardAttributes.variants.data.map((variantCardAttributes, i) => {
                switch (true) {
                  case variantCardAttributes.attributes.hyperspace:
                    return (
                      <Chip
                        label="Hyperspace"
                        isActive={variant === i}
                        handlePress={function () {
                          setVariant(i);
                        }}
                        key="variant-chip-hyperspace"
                      />
                    );
                  case variantCardAttributes.attributes.showcase:
                    return (
                      <Chip
                        label="Showcase"
                        isActive={variant === i}
                        handlePress={function () {
                          setVariant(i);
                        }}
                        key="variant-chip-showcase"
                      />
                    );
                  default:
                    if (
                      variantCardAttributes.attributes.variantTypes?.data[0]
                        ?.attributes.name
                    ) {
                      return (
                        <Chip
                          label={
                            variantCardAttributes.attributes.variantTypes
                              ?.data[0].attributes.name
                          }
                          isActive={variant === i}
                          handlePress={() => {
                            setVariant(i);
                          }}
                          key={`variant-chip-${i}`}
                        />
                      );
                    }
                }
              })
            : null}
        </View>
        <View style={styles.images}>{images}</View>
      </View>
    </View>
  );
}

type ChipProps = {
  label: string;
  isActive: boolean;
  handlePress: () => void;
};

function Chip({ label, isActive, handlePress }: ChipProps) {
  return (
    <Button
      size="small"
      variant={isActive ? 'bold' : undefined}
      onPress={() => handlePress()}
    >
      {label}
    </Button>
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
