import * as z from 'zod';

import { AttributeSchema } from './Shared';

const VALUES = ['Base', 'Event', 'Leader', 'Token', 'Unit', 'Upgrade'] as const;
export const TypeEnum = z.enum(VALUES);
export type Type = z.infer<typeof TypeEnum>;

export const TypeAttributeSchema = AttributeSchema.extend({
  name: z.string(),
});
export type TypeAttribute = z.infer<typeof TypeAttributeSchema>;
