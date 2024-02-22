import * as z from 'zod';

export const Rarities = [
  'Common', // 2
  'Legendary', // 17
  'Rare', // 12
  'Special', // 22
  'Uncommon', // 7
] as const;

export const RarityEnum = z.enum(Rarities);
export type Rarity = z.infer<typeof RarityEnum>;

export const RarityCodes = {
  Common: 2,
  Legendary: 17,
  Rare: 12,
  Special: 22,
  Uncommon: 7,
} as const satisfies Record<Rarity, number>;

const RARITY_SHORT = ['C', 'L', 'R', 'S', 'U'] as const;
export const RarityShortEnum = z.enum(RARITY_SHORT);
export type RarityShort = z.infer<typeof RarityShortEnum>;
