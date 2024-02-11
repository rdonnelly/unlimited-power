import * as z from 'zod';

import { CardSchema } from '@data/Card';

export const PaginationSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  pageCount: z.number(),
  total: z.number(),
});
export type Pagination = z.infer<typeof PaginationSchema>;

export const CardResponseMetaSchema = z.object({});
export type CardResponseMeta = z.infer<typeof CardResponseMetaSchema>;

export const CardResponseDataSchema = CardSchema;
export type CardResponseData = z.infer<typeof CardResponseDataSchema>;

export const CardResponseSchema = z.object({
  data: CardResponseDataSchema,
  meta: CardResponseMetaSchema,
});
export type CardResponse = z.infer<typeof CardResponseSchema>;
