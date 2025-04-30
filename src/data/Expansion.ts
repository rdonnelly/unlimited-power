import * as z from 'zod';

const VALUES = [
  'SOR', // 2, Spark of Rebellion
  'SHD', // 8, Shadows of the Galaxy
  'TWI', // 18, Twilight of the Republic
  'JTL', // 23, Jump to Lightspeed
  'LOF', // 53, Legends of the Force

  'C24', // 13, 2024 Convention Exclusive
  'J24', // 28, 2024 Judge Program
  'J25', // 33, 2025 Judge Program
  'P25', // 38, 2025 Promo
] as const;
export const ExpansionEnum = z.enum(VALUES);
export type Expansion = z.infer<typeof ExpansionEnum>;

export const ExpansionRank: Record<Expansion, number> = {
  SOR: 1,
  SHD: 2,
  TWI: 3,
  JTL: 4,
  LOF: 5,

  C24: 6,
  J24: 7,
  J25: 8,
  P25: 9,
} as const;

export const ExpansionCodes: Record<Expansion, number> = {
  SOR: 2,
  SHD: 8,
  TWI: 18,
  JTL: 23,
  LOF: 53,

  C24: 13,
  J24: 28,
  J25: 33,
  P25: 38,
} as const;

export const ExpansionNames: Record<Expansion, string> = {
  SOR: 'Spark of Rebellion',
  SHD: 'Shadows of the Galaxy',
  TWI: 'Twilight of the Republic',
  JTL: 'Jump to Lightspeed',
  LOF: 'Legends of the Force',

  C24: '2024 Convention Exclusive',
  J24: '2024 Judge Program',
  J25: '2025 Judge Program',
  P25: '2025 Promo',
} as const;
