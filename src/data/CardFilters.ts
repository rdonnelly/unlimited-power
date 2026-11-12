import { AspectCodes } from '@data/Aspect';
import type { Card } from '@data/Card';
import { ExpansionCodes } from '@data/Expansion';
import { RarityCodes } from '@data/Rarity';
import { aspectFilterOptions } from '@data/stores/useAspectFilterStore';
import { expansionFilterOptions } from '@data/stores/useExpansionFilterStore';
import { rarityFilterOptions } from '@data/stores/useRarityFilterStore';
import { typeFilterOptions } from '@data/stores/useTypeFilterStore';
import { TypeCodes } from '@data/Type';

export type CardFilters = {
  search: string;
  aspects: (typeof aspectFilterOptions)[number][];
  expansions: (typeof expansionFilterOptions)[number][];
  rarities: (typeof rarityFilterOptions)[number][];
  types: (typeof typeFilterOptions)[number][];
};

export function normalizeCardFilters(filters: CardFilters): CardFilters {
  return {
    search: filters.search.trim(),
    aspects: aspectFilterOptions.filter((value) =>
      filters.aspects.includes(value),
    ),
    expansions: expansionFilterOptions.filter((value) =>
      filters.expansions.includes(value),
    ),
    rarities: rarityFilterOptions.filter((value) =>
      filters.rarities.includes(value),
    ),
    types: typeFilterOptions.filter((value) => filters.types.includes(value)),
  };
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
