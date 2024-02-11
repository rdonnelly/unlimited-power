import * as z from 'zod';

import { AttributeSchema, ColorSchema } from './Shared';

const VALUES = ['Common', 'Legendary', 'Rare', 'Starter', 'Uncommon'] as const;
export const RarityEnum = z.enum(VALUES);
export type Rarity = z.infer<typeof RarityEnum>;

export const RarityAttributeSchema = z.object({
  data: z.object({
    id: z.number(),
    attributes: AttributeSchema.extend({
      name: z.string(),
      color: z.nullable(ColorSchema),
    }),
  }),
});
export type RarityAttribute = z.infer<typeof RarityAttributeSchema>;
