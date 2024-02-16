import * as z from 'zod';

import { ArenaEnum } from '@data/Arena';
import { AspectEnum } from '@data/Aspect';
import { ColorSchema } from '@data/Color';
import { ExpansionEnum } from '@data/Expansion';
import { RarityEnum, RarityShortEnum } from '@data/Rarity';
import { TypeEnum } from '@data/Type';

export const LocaleSchema = z.enum(['en']);
export type Locale = z.infer<typeof LocaleSchema>;

export const AttributeSchema = z.object({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  publishedAt: z.coerce.date(),
  locale: LocaleSchema,
});
export type Attribute = z.infer<typeof AttributeSchema>;

export const GenericAttributeSchema = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      attributes: AttributeSchema,
    }),
  ),
});
export type GenericAttribute = z.infer<typeof GenericAttributeSchema>;

export const ArenaAttributeSchema = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      attributes: AttributeSchema.extend({
        name: ArenaEnum,
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
        name: AspectEnum,
        description: z.string(),
        color: z.nullable(ColorSchema),
      }),
    }),
  ),
});
export type AspectAttribute = z.infer<typeof AspectAttributeSchema>;

export const ExpansionAttributeSchema = z.object({
  data: z.nullable(
    z.object({
      id: z.number(),
      attributes: AttributeSchema.extend({
        code: ExpansionEnum,
        name: z.string(),
      }),
    }),
  ),
});
export type ExpansionAttribute = z.infer<typeof ExpansionAttributeSchema>;

export const RarityAttributeSchema = z.object({
  data: z.object({
    id: z.number(),
    attributes: AttributeSchema.extend({
      name: RarityEnum,
      character: RarityShortEnum,
      color: z.nullable(ColorSchema),
    }),
  }),
});
export type RarityAttribute = z.infer<typeof RarityAttributeSchema>;

export const TypeAttributeSchema = z.object({
  data: z.object({
    id: z.number(),
    attributes: AttributeSchema.extend({
      name: TypeEnum,
    }),
  }),
});
export type TypeAttribute = z.infer<typeof TypeAttributeSchema>;

export const Type2AttributeSchema = z.object({
  data: z.nullable(
    z.object({
      id: z.number(),
      attributes: AttributeSchema.extend({
        name: TypeEnum,
      }),
    }),
  ),
});
export type Type2Attribute = z.infer<typeof Type2AttributeSchema>;

export const VariantAttributeSchema = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      attributes: AttributeSchema.extend({
        name: z.string(),
      }),
    }),
  ),
});
export type VariantTypeAttribute = z.infer<typeof VariantAttributeSchema>;
