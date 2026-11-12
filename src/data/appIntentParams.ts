import * as z from 'zod';
import { ExpansionEnum } from '@data/Expansion';

const intentSchema = z.discriminatedUnion('name', [
  z.object({
    name: z.literal('searchCards'),
    params: z.object({ query: z.string().trim() }),
  }),
  z.object({
    name: z.literal('showExpansion'),
    params: z.object({ expansion: ExpansionEnum }),
  }),
  z.object({
    name: z.literal('openCard'),
    params: z.object({ id: z.number().int().positive(), title: z.string() }),
  }),
]);

export function parseAppIntent(invocation: unknown) {
  const result = intentSchema.safeParse(invocation);
  return result.success ? result.data : null;
}
