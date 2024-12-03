import * as z from 'zod';

export const Variants = ['Hyperspace', 'Showcase'] as const;
export const VariantEnum = z.enum(Variants);
export type Variant = z.infer<typeof VariantEnum>;

export const VariantRank: Record<Variant, number> = {
  Hyperspace: 1,
  Showcase: 2,
} as const;
