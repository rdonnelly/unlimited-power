import { useCallback, useMemo, useState } from 'react';

import { useCardPrintings } from '@data/hooks/useCardPrintings';
import { getCardVariants } from '@data/cardVariants';

export function useCardVariants(cardId: number, variantName: string) {
  const {
    data: printingsData,
    isFetching: isFetchingPrintings,
    isPaused: printingsPaused,
    isError: printingsError,
    refetch: refetchPrintings,
  } = useCardPrintings(cardId);

  const [selection, setSelection] = useState<{
    cardId: number;
    key: string;
  } | null>(null);
  const variants = useMemo(
    () => getCardVariants(printingsData),
    [printingsData],
  );
  const requestedKey =
    selection?.cardId === cardId ? selection.key : variantName;
  const variantKey = variants[requestedKey] ? requestedKey : 'Standard';

  const handleVariantSelection = useCallback(
    (values: string[]) => {
      const key = values.at(0);
      if (key) setSelection({ cardId, key });
    },
    [cardId],
  );

  return {
    variants,
    variantKey,
    handleVariantSelection,
    isFetchingPrintings,
    printingsPaused,
    printingsError,
    refetchPrintings,
  };
}
