import * as z from 'zod';

const VALUES = [
  'Ground', // 2
  'Space', // 7
] as const;
export const ArenaEnum = z.enum(VALUES);
export type Arena = z.infer<typeof ArenaEnum>;
