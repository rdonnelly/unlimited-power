import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { CardDetailImage } from '@components/CardDetailImage';
import { Chips } from '@components/Chips';
import { useCardDetails } from '@data/hooks/useCardDetails';
import { useCardPrintings } from '@data/hooks/useCardPrintings';
import { type Variant, VariantRank } from '@data/Variant';
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

  const { data: printingsData, isFetching: isFetchingPrintings } =
    useCardPrintings(cardId);

  const [variantKey, setVariantKey] = useState<string>(variantName);

  const variants = useMemo(() => {
    const v: Record<string, number> = {};

    if (printingsData?.original) {
      v.Standard = printingsData?.original.id;
    }

    if (!isFetchingPrintings && printingsData?.printings) {
      printingsData.printings
        .sort((a, b) => {
          const variantNameA = a.variantTypes?.[0]?.name as Variant;
          const variantRankA = variantNameA ? VariantRank[variantNameA] : 9999;
          const variantNameB = b.variantTypes?.[0]?.name as Variant;
          const variantRankB = variantNameB ? VariantRank[variantNameB] : 9999;

          if (variantRankA > variantRankB) {
            return 1;
          }
          if (variantRankB > variantRankA) {
            return -1;
          }
          return 0;
        })
        .forEach((printing) => {
          const variantName = printing.variantTypes?.[0]?.name;
          if (variantName && !variantName.endsWith('Foil')) {
            v[variantName] = printing.id;
          }
        });
    }

    return v;
  }, [printingsData?.original, printingsData?.printings, isFetchingPrintings]);

  const { data: selectedCard } = useCardDetails(variants[variantKey] || cardId);

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

  const handleVariantSelection = useCallback((selection: string[]) => {
    const selectedVariantKey = selection.at(0);

    selectedVariantKey && setVariantKey(selectedVariantKey);
  }, []);

  const cardImages = useCardImages(selectedCard?.attributes);

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
          {isFetchingPrintings && (
            <View style={styles.variantLoading}>
              <ActivityIndicator color={theme.tintSubdued} />
            </View>
          )}
        </View>
        <View style={styles.images}>
          {cardImages.map((cardImageProps) => (
            <CardDetailImage
              {...cardImageProps}
              key={`card-detail-image-${cardId}-${variantName}-${cardImageProps.art?.data?.id}`}
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
