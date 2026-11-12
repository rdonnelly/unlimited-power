import { AspectCodes, Aspects } from '@data/Aspect';
import type { Card } from '@data/Card';
import { ExpansionCodes, ExpansionNames } from '@data/Expansion';
import { RarityCodes } from '@data/Rarity';
import { TypeCodes } from '@data/Type';

export const aspectFilterOptions = [...Aspects, 'Neutral'] as const;
export const expansionFilterOptions = Object.keys(
  ExpansionCodes,
) as (keyof typeof ExpansionCodes)[];
export const rarityFilterOptions = Object.keys(
  RarityCodes,
) as (keyof typeof RarityCodes)[];
export const typeFilterOptions = Object.keys(
  TypeCodes,
) as (keyof typeof TypeCodes)[];

export type CardFilters = {
  search: string;
  aspects: (typeof aspectFilterOptions)[number][];
  expansions: (typeof expansionFilterOptions)[number][];
  rarities: (typeof rarityFilterOptions)[number][];
  types: (typeof typeFilterOptions)[number][];
};

export type FilterGroupKey = Exclude<keyof CardFilters, 'search'>;
export type FilterGroupValue<K extends FilterGroupKey> = CardFilters[K][number];

export type FilterGroup<K extends FilterGroupKey = FilterGroupKey> = {
  key: K;
  heading: string;
  options: readonly { value: FilterGroupValue<K>; label: string }[];
};

function group<K extends FilterGroupKey>(
  key: K,
  heading: string,
  values: readonly FilterGroupValue<K>[],
  label: (value: FilterGroupValue<K>) => string = String,
): FilterGroup<K> {
  return {
    key,
    heading,
    options: values.map((value) => ({ value, label: label(value) })),
  };
}

// Single source of truth for the filter groups, in display order.
export const FILTER_GROUPS: readonly FilterGroup[] = [
  group('aspects', 'Aspects', aspectFilterOptions),
  group(
    'expansions',
    'Sets',
    expansionFilterOptions,
    (value) => ExpansionNames[value],
  ),
  group('types', 'Type', typeFilterOptions),
  group('rarities', 'Rarity', rarityFilterOptions),
];

export const DEFAULT_FILTERS: CardFilters = {
  search: '',
  aspects: [...aspectFilterOptions],
  expansions: [...expansionFilterOptions],
  rarities: [...rarityFilterOptions],
  types: [...typeFilterOptions],
};

export function isGroupActive(filters: CardFilters, key: FilterGroupKey) {
  const selected: readonly string[] = filters[key];
  const options = FILTER_GROUPS.find((g) => g.key === key)?.options ?? [];
  return !options.every((option) => selected.includes(option.value));
}

export function countActiveFilters(filters: CardFilters) {
  return (
    +(filters.search !== '') +
    FILTER_GROUPS.filter((g) => isGroupActive(filters, g.key)).length
  );
}

export function normalizeCardFilters(filters: CardFilters): CardFilters {
  const normalized = { ...filters, search: filters.search.trim() };
  for (const { key, options } of FILTER_GROUPS) {
    const selected: readonly string[] = filters[key];
    // Canonical option order; unknown values are dropped.
    (normalized[key] as string[]) = options
      .map((option) => option.value)
      .filter((value) => selected.includes(value));
  }
  return normalized;
}

export function hasNoSelections(filters: CardFilters) {
  return [
    filters.aspects,
    filters.expansions,
    filters.rarities,
    filters.types,
  ].some((values) => values.length === 0);
}

export function matchesAspects(card: Card, aspects: CardFilters['aspects']) {
  const cardAspects = card.attributes.aspects.data;
  return cardAspects.length === 0
    ? aspects.includes('Neutral')
    : cardAspects.every((aspect) => aspects.includes(aspect.attributes.name));
}

export function buildCardFilters(filters: CardFilters) {
  const conditions: object[] = [{ variantOf: { id: { $null: true } } }];

  if (filters.search) {
    conditions.push({
      $or: [
        { title: { $containsi: filters.search } },
        { traits: { name: { $containsi: filters.search } } },
        { keywords: { name: { $containsi: filters.search } } },
      ],
    });
  }

  if (filters.aspects.length < aspectFilterOptions.length) {
    const included = filters.aspects.flatMap((aspect) =>
      aspect === 'Neutral' ? [] : [AspectCodes[aspect]],
    );
    const choices: object[] = [];
    if (included.length) choices.push({ aspects: { id: { $in: included } } });
    if (filters.aspects.includes('Neutral')) {
      choices.push({ aspects: { id: { $null: true } } });
    }
    conditions.push({ $or: choices });
  }

  if (filters.expansions.length < expansionFilterOptions.length) {
    conditions.push({
      expansion: {
        id: { $in: filters.expansions.map((value) => ExpansionCodes[value]) },
      },
    });
  }
  if (filters.rarities.length < rarityFilterOptions.length) {
    conditions.push({
      rarity: {
        id: { $in: filters.rarities.map((value) => RarityCodes[value]) },
      },
    });
  }
  if (filters.types.length < typeFilterOptions.length) {
    conditions.push({
      type: { id: { $in: filters.types.map((value) => TypeCodes[value]) } },
    });
  }

  return { $and: conditions };
}
