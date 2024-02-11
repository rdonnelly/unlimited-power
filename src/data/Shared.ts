import * as z from 'zod';

import { ColorSchema } from './Color';
import { TypeEnum } from './Type';

export const LocaleSchema = z.enum(['en']);
export type Locale = z.infer<typeof LocaleSchema>;

export const AttributeSchema = z.object({
  // name: z.string(),
  // color: z.nullable(ColorSchema).optional(),

  // description: z.union([z.null(), z.string()]).optional(),
  // englishName: z.nullable(EnglishNameSchema).optional(),
  // code: z.nullable(CodeSchema).optional(),
  // character: z.nullable(CharacterSchema).optional(),
  value: z.nullable(TypeEnum).optional(),

  locale: LocaleSchema,

  // createdAt: z.coerce.date(),
  // updatedAt: z.coerce.date(),
  // publishedAt: z.coerce.date(),
});
export type Attribute = z.infer<typeof AttributeSchema>;

export const ArenaAttributeSchema = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      attributes: AttributeSchema.extend({
        name: z.string(),
        color: z.nullable(ColorSchema).optional(),
      }),
    }),
  ),
});
export type ArenaAttribute = z.infer<typeof ArenaAttributeSchema>;

export const AspectAttributeSchema = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      attributes: AttributeSchema.extend({
        name: z.string(),
        description: z.string(),
        color: z.nullable(ColorSchema),
      }),
    }),
  ),
});
export type AspectAttribute = z.infer<typeof AspectAttributeSchema>;

export const RarityAttributeSchema = z.object({
  data: z.object({
    id: z.number(),
    attributes: AttributeSchema.extend({
      name: z.string(),
      color: z.nullable(ColorSchema),
    }),
  }),
});
export type RarityAttribute = z.infer<typeof RarityAttributeSchema>;

export const TypeAttributeSchema = z.object({
  data: z
    .object({
      id: z.number(),
      attributes: AttributeSchema.extend({
        name: z.string(),
      }),
    })
    .nullable(),
});
export type TypeAttribute = z.infer<typeof TypeAttributeSchema>;
