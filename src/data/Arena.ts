import * as z from 'zod';

const VALUES = ['Ground', 'Space'] as const;
export const ArenaEnum = z.enum(VALUES);
export type Arena = z.infer<typeof ArenaEnum>;
