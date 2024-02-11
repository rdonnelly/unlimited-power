import * as z from 'zod';

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
