import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { QueryNotice } from '@components/QueryNotice';

import { CardDetailImage } from '@components/CardDetailImage';
import { Chips } from '@components/Chips';
import { useCardDetails } from '@data/hooks/useCardDetails';
import { useCardVariants } from '@data/hooks/useCardVariants';
import { useCardImages } from '@hooks/useCardImages';
import { useTheme } from '@hooks/useTheme';

export type CardDetailImagesProps = {
  cardId: number;
  variantName: string;
};

export function CardDetailImages({
  cardId,
  variantName,
}: CardDetailImagesProps) {
  const { theme, themeStyles } = useTheme();

  const { data: standardVariantCard } = useCardDetails(cardId);

  const {
    variants,
    variantKey,
    handleVariantSelection,
    isFetchingPrintings,
    printingsPaused,
    printingsError,
    refetchPrintings,
  } = useCardVariants(cardId, variantName);

  const {
    data: selectedVariantCard,
    isError: variantError,
    isPaused: variantPaused,
    isFetching: variantFetching,
    refetch: refetchVariant,
  } = useCardDetails(variants[variantKey] || cardId);

  const variantSelections = useMemo(() => {
    return [variantKey];
  }, [variantKey]);

  const variantOptions = useMemo(() => {
    const options = Object.keys(variants).map((key) => ({
      label: key,
      value: key,
    }));

    return options;
  }, [variants]);

  const cardImages = useCardImages(
    selectedVariantCard?.attributes,
    standardVariantCard?.attributes,
  );

  return (
    <View style={styles.container}>
      <View style={[styles.inner, themeStyles.background200]}>
        <View style={styles.variantSelector}>
          <View style={styles.variantSelectorChips}>
            <Chips
              heading="Variants"
              options={variantOptions}
              selections={variantSelections}
              onChange={handleVariantSelection}
              single
            />
          </View>
          {isFetchingPrintings ? (
            <View style={styles.variantLoading}>
              <ActivityIndicator color={theme.tintSubdued} />
            </View>
          ) : null}
        </View>
        {printingsError || printingsPaused ? (
          <QueryNotice
            message="Some variants may be unavailable until you reconnect."
            busy={isFetchingPrintings}
            onRetry={() => {
              void refetchPrintings({ cancelRefetch: false });
            }}
          />
        ) : null}
        {variantError || variantPaused ? (
          <QueryNotice
            message="Selected variant could not be loaded. Showing available art."
            busy={variantFetching}
            onRetry={() => {
              void refetchVariant({ cancelRefetch: false });
            }}
          />
        ) : null}
        <View style={styles.images}>
          {!cardImages.length ? (
            <Text style={themeStyles.color}>No card image available.</Text>
          ) : null}
          {cardImages.map((cardImageProps, i) => (
            <CardDetailImage
              {...cardImageProps}
              key={`${cardId}-${cardImageProps.art?.data?.attributes.url}-${i}`}
              accessibilityLabel={`${standardVariantCard?.attributes.title ?? 'Card'}, image ${i + 1}`}
            />
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
    alignItems: 'flex-end',
  },
  variantSelectorChips: {
    flex: 1,
  },
  variantLoading: {
    paddingBottom: 24,
  },
  images: {
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
});
