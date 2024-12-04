import * as z from 'zod';

const VALUES = [
  'SOR', // 2, Spark of Rebellion
  'SHD', // 8, Shadows of the Galaxy
  'TWI', // 18, Twilight of the Republic
  'C24', // 13, 2024 Convention Exclusive
  'JTL', // 23, Jump to Lightspeed
] as const;
export const ExpansionEnum = z.enum(VALUES);
export type Expansion = z.infer<typeof ExpansionEnum>;

export const ExpansionRank: Record<Expansion, number> = {
  SOR: 1,
  SHD: 2,
  TWI: 3,
  JTL: 4,
  C24: 5,
} as const;

export const ExpansionCodes: Record<Expansion, number> = {
  SOR: 2,
  SHD: 8,
  TWI: 18,
  C24: 13,
  JTL: 23,
} as const;

export const ExpansionNames: Record<Expansion, string> = {
  SOR: 'Spark of Rebellion',
  SHD: 'Shadows of the Galaxy',
  TWI: 'Twilight of the Republic',
  JTL: 'Jump to Lightspeed',
  C24: '2024 Convention Exclusive',
} as const;
