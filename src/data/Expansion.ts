import * as z from 'zod';

const VALUES = [
  'SOR', // 2
] as const;
export const ExpansionEnum = z.enum(VALUES);
export type Expansion = z.infer<typeof ExpansionEnum>;
