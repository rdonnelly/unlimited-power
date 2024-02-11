import * as z from 'zod';

import { AttributeSchema, ColorSchema } from '@data/Shared';

const VALUES = ['Ground', 'Space'] as const;
export const ArenaEnum = z.enum(VALUES);
export type Arena = z.infer<typeof ArenaEnum>;

export const ArenaAttributeSchema = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      attributes: AttributeSchema.extend({
        name: z.string(),
        color: z.union([ColorSchema, z.null()]).optional(),
      }),
    }),
  ),
});
export type ArenaAttribute = z.infer<typeof ArenaAttributeSchema>;
