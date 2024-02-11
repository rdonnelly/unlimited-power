import * as z from 'zod';

const VALUES = ['Common', 'Legendary', 'Rare', 'Starter', 'Uncommon'] as const;
export const RarityEnum = z.enum(VALUES);
export type Rarity = z.infer<typeof RarityEnum>;
