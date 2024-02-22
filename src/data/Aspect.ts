import * as z from 'zod';

export const Aspects = [
  'Aggression', // 12
  'Command', // 7
  'Cunning', // 17
  'Heroism', // 22
  'Vigilance', // 2
  'Villainy', // 27
] as const;
export const AspectEnum = z.enum(Aspects);
export type Aspect = z.infer<typeof AspectEnum>;

export const AspectRank: Record<Aspect, number> = {
  Aggression: 1,
  Command: 2,
  Cunning: 3,
  Vigilance: 4,
  Heroism: 5,
  Villainy: 6,
} as const;
