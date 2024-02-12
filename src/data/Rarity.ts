import * as z from 'zod';

const RARITY_VALUES = [
  'Common',
  'Legendary',
  'Rare',
  'Special',
  'Uncommon',
] as const;
export const RarityEnum = z.enum(RARITY_VALUES);
export type Rarity = z.infer<typeof RarityEnum>;

const RARITY_SHORT = ['C', 'L', 'R', 'S', 'U'] as const;
export const RarityShortEnum = z.enum(RARITY_SHORT);
export type RarityShort = z.infer<typeof RarityShortEnum>;
