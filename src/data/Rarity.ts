import * as z from 'zod';

export const Rarities = [
  'Common', // 2
  'Uncommon', // 7
  'Rare', // 12
  'Legendary', // 17
  'Special', // 22
] as const;

export const RarityEnum = z.enum(Rarities);
export type Rarity = z.infer<typeof RarityEnum>;

export const RarityCodes = {
  Common: 2,
  Uncommon: 7,
  Rare: 12,
  Legendary: 17,
  Special: 22,
} as const satisfies Record<Rarity, number>;

const RARITY_SHORT = ['C', 'L', 'R', 'S', 'U'] as const;
export const RarityShortEnum = z.enum(RARITY_SHORT);
export type RarityShort = z.infer<typeof RarityShortEnum>;
