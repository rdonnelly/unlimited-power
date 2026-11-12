import { useShallow } from 'zustand/shallow';

import { selectFilters, useFilterStore } from '@data/stores/useFilterStore';

export function useCardsQueryKey() {
  // The store keeps filters normalized, so they can be used as-is.
  const filters = useFilterStore(useShallow(selectFilters));

  return ['cards', filters] as const;
}
