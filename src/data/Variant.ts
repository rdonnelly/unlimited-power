import * as z from 'zod';

const VALUES = ['Event Exclusive', 'OP Promo', 'Prerelease Promo'] as const;
export const VariantEnum = z.enum(VALUES);
export type Variant = z.infer<typeof VariantEnum>;
