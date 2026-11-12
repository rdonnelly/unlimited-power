import { useAspectFilterStore } from '@data/stores/useAspectFilterStore';
import { useExpansionFilterStore } from '@data/stores/useExpansionFilterStore';
import { useRarityFilterStore } from '@data/stores/useRarityFilterStore';
import { useSearchFilterStore } from '@data/stores/useSearchFilterStore';
import { useTypeFilterStore } from '@data/stores/useTypeFilterStore';

export function resetAllFilters() {
  useSearchFilterStore.getState().reset();
  useAspectFilterStore.getState().selectAll();
  useExpansionFilterStore.getState().selectAll();
  useRarityFilterStore.getState().selectAll();
  useTypeFilterStore.getState().selectAll();
}
