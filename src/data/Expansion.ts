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
  'ASH', // 108, Ashes of the Empire
  'TS26', // 103, 2026 Twin Suns

  'C24', // 13, 2024 Convention Exclusive
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
  ASH: 9,
  TS26: 10,

  C24: 11,
  P25: 12,
  C25: 13,
  P26: 14,
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
  ASH: 108,
  TS26: 103,

  C24: 13,
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
  ASH: 'Ashes of the Empire',
  TS26: '2026 Twin Suns',

  C24: '2024 Convention Exclusive',
  P25: '2025 Promo',
  C25: '2025 Convention Exclusive',
  P26: '2026 Promo',
} as const;
