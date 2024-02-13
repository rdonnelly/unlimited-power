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

export const AspectRank: Record<Aspect, number> = {
  Aggression: 1,
  Command: 2,
  Cunning: 3,
  Vigilance: 4,
  Heroism: 5,
  Villainy: 6,
} as const;
