import * as z from 'zod';

const VALUES = [
  'Base',
  'Event',
  'Leader',
  'Leader Unit',
  'Token',
  'Unit',
  'Upgrade',
] as const;
export const TypeEnum = z.enum(VALUES);
export type Type = z.infer<typeof TypeEnum>;
