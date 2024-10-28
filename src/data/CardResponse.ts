import * as z from 'zod';

import { BaseCardAttributesSchema, CardSchema } from '@data/Card';

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

const CardPrintingAttributesSchema = BaseCardAttributesSchema.extend({
  id: z.number(),
  variantTypes: z.nullable(
    z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        // lots of other fields
      }),
    ),
  ),
});

export const CardPrintingsResponseSchema = z.object({
  data: z.object({
    original: CardPrintingAttributesSchema,
    printings: z.optional(z.array(CardPrintingAttributesSchema)),
  }),
});
export type CardPrintingsResponse = z.infer<typeof CardPrintingsResponseSchema>;
