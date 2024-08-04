import * as z from 'zod';

const VALUES = [
  'SOR', // 2, Spark of Rebellion
  'SHD', // 8, Shadows of the Galaxy
  'TWI', // 18, Twilight of the Republic
  'C24', // 13, 2024 Convention Exclusive
] as const;
export const ExpansionEnum = z.enum(VALUES);
export type Expansion = z.infer<typeof ExpansionEnum>;

export const ExpansionRank: Record<Expansion, number> = {
  SOR: 1,
  SHD: 2,
  TWI: 3,
  C24: 4,
} as const;

export const ExpansionCodes: Record<Expansion, number> = {
  SOR: 2,
  SHD: 8,
  TWI: 18,
  C24: 13,
} as const;

export const ExpansionNames: Record<Expansion, string> = {
  SOR: 'Spark of Rebellion',
  SHD: 'Shadows of the Galaxy',
  TWI: 'Twilight of the Republic',
  C24: '2024 Convention Exclusive',
} as const;
