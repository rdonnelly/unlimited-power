import * as z from 'zod';

import { AttributeSchema } from './Shared';

const VALUES = ['Base', 'Event', 'Leader', 'Token', 'Unit', 'Upgrade'] as const;
export const TypeEnum = z.enum(VALUES);
export type Type = z.infer<typeof TypeEnum>;

export const TypeAttributeSchema = z.object({
  data: z
    .object({
      id: z.number(),
      attributes: AttributeSchema.extend({
        name: z.string(),
      }),
    })
    .nullable(),
});
export type TypeAttribute = z.infer<typeof TypeAttributeSchema>;
