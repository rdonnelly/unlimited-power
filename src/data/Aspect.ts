import * as z from 'zod';

import { AttributeSchema, ColorSchema } from './Shared';

const VALUES = [
  'Aggression',
  'Command',
  'Cunning',
  'Heroism',
  'Vigilance',
  'Villainy',
] as const;
export const AspectEnum = z.enum(VALUES);
export type Aspect = z.infer<typeof AspectEnum>;

export const AspectAttributeSchema = AttributeSchema.extend({
  name: z.string(),
  description: z.string(),
  color: z.nullable(ColorSchema),
});
export type AspectAttribute = z.infer<typeof AspectAttributeSchema>;
