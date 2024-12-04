import { useCallback, useMemo, useState } from 'react';

import { useCardPrintings } from '@data/hooks/useCardPrintings';
import { type Variant, VariantRank } from '@data/Variant';

export function useCardVariants(cardId: number, variantName: string) {
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

  const handleVariantSelection = useCallback((selection: string[]) => {
    const selectedVariantKey = selection.at(0);

    selectedVariantKey && setVariantKey(selectedVariantKey);
  }, []);

  return {
    variants,
    variantKey,
    handleVariantSelection,
    isFetchingPrintings,
  };
}
