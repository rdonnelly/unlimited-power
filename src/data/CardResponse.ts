import * as z from 'zod';

import { CardSchema } from '@data/Card';

export const PaginationSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  pageCount: z.number(),
  total: z.number(),
});
export type Pagination = z.infer<typeof PaginationSchema>;

export const MetaSchema = z.object({
  pagination: PaginationSchema,
});
export type Meta = z.infer<typeof MetaSchema>;

export const CardResponseSchema = z.object({
  data: z.array(CardSchema),
  meta: MetaSchema,
});
export type CardResponse = z.infer<typeof CardResponseSchema>;
