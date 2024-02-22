import * as z from 'zod';

export const Types = [
  'Base', // 7
  'Event', // 8
  'Leader', // 4
  'Leader Unit',
  'Token', // 11
  'Unit', // 9
  'Upgrade', // 10
] as const;

export const TypeEnum = z.enum(Types);
export type Type = z.infer<typeof TypeEnum>;

export const TypeCodes: Record<Exclude<Type, 'Leader Unit'>, number> = {
  Base: 7,
  Event: 8,
  Leader: 4,
  Token: 11,
  Unit: 9,
  Upgrade: 10,
} as const;
