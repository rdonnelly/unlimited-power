import * as z from 'zod';

// https://admin.starwarsunlimited.com/api/card-expansions

const VALUES = [
  'SOR', // 2, Spark of Rebellion
  'SHD', // 8, Shadows of the Galaxy
  'TWI', // 18, Twilight of the Republic
  'JTL', // 23, Jump to Lightspeed
  'LOF', // 53, Legends of the Force
  'IBH', // 68, Intro Battle: Hoth
  'SEC', // 73, Secrets of Power
  'LAW', // 93, A Lawless Time
  'TS26', // 103, 2026 Twin Suns

  'C24', // 13, 2024 Convention Exclusive
  'J24', // 28, 2024 Judge Program
  'J25', // 33, 2025 Judge Program
  'P25', // 38, 2025 Promo
  'C25', // 63, 2025 Convention Exclusive
  'P26', // 83, 2026 Promo
] as const;
export const ExpansionEnum = z.enum(VALUES);
export type Expansion = z.infer<typeof ExpansionEnum>;

export const ExpansionRank: Record<Expansion, number> = {
  SOR: 1,
  SHD: 2,
  TWI: 3,
  JTL: 4,
  LOF: 5,
  IBH: 6,
  SEC: 7,
  LAW: 8,
  TS26: 9,

  C24: 10,
  J24: 11,
  J25: 12,
  P25: 13,
  C25: 14,
  P26: 15,
} as const;

export const ExpansionCodes: Record<Expansion, number> = {
  SOR: 2,
  SHD: 8,
  TWI: 18,
  JTL: 23,
  LOF: 53,
  IBH: 68,
  SEC: 73,
  LAW: 93,
  TS26: 103,

  C24: 13,
  J24: 28,
  J25: 33,
  P25: 38,
  C25: 63,
  P26: 83,
} as const;

export const ExpansionNames: Record<Expansion, string> = {
  SOR: 'Spark of Rebellion',
  SHD: 'Shadows of the Galaxy',
  TWI: 'Twilight of the Republic',
  JTL: 'Jump to Lightspeed',
  LOF: 'Legends of the Force',
  IBH: 'Intro Battle: Hoth',
  SEC: 'Secrets of Power',
  LAW: 'A Lawless Time',
  TS26: '2026 Twin Suns',

  C24: '2024 Convention Exclusive',
  J24: '2024 Judge Program',
  J25: '2025 Judge Program',
  P25: '2025 Promo',
  C25: '2025 Convention Exclusive',
  P26: '2026 Promo',
} as const;
