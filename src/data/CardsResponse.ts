import * as z from 'zod';

import { CardSchema } from '@data/Card';

export const PaginationSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  pageCount: z.number(),
  total: z.number(),
});
export type Pagination = z.infer<typeof PaginationSchema>;

export const CardsResponseMetaSchema = z.object({
  pagination: PaginationSchema,
});
export type CardsResponseMeta = z.infer<typeof CardsResponseMetaSchema>;

export const CardsResponseDataSchema = z.array(CardSchema);
export type CardsResponseData = z.infer<typeof CardsResponseDataSchema>;

export const CardsResponseSchema = z.object({
  data: CardsResponseDataSchema,
  meta: CardsResponseMetaSchema,
});
export type CardsResponse = z.infer<typeof CardsResponseSchema>;
