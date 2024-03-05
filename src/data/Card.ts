import * as z from 'zod';

import { ArtSchema, ArtThumbnailSchema } from '@data/CardArt';
import {
  ArenaAttributeSchema,
  AspectAttributeSchema,
  ExpansionAttributeSchema,
  GenericAttributeSchema,
  RarityAttributeSchema,
  Type2AttributeSchema,
  TypeAttributeSchema,
  VariantAttributeSchema,
} from '@data/Shared';

const BaseCardAttributesSchema = z.object({
  cardNumber: z.number(),
  title: z.string(),
  subtitle: z.nullable(z.string()),
  unique: z.boolean(),
  cardUid: z.string(),

  cost: z.nullable(z.number()),
  hp: z.nullable(z.number()),
  power: z.nullable(z.number()),
  text: z.nullable(z.string()),
  textStyled: z.string(),
  deployBox: z.nullable(z.string()),
  deployBoxStyled: z.string(),
  epicAction: z.nullable(z.string()),
  epicActionStyled: z.string(),
  linkHtml: z.string(),
  artist: z.string(),
  hasFoil: z.boolean(),
  hyperspace: z.boolean(),
  showcase: z.boolean(),

  arenas: ArenaAttributeSchema,
  aspectDuplicates: AspectAttributeSchema,
  aspects: AspectAttributeSchema,
  rarity: RarityAttributeSchema,
  type: TypeAttributeSchema,
  type2: Type2AttributeSchema,

  expansion: ExpansionAttributeSchema,
  keywords: GenericAttributeSchema,
  traits: GenericAttributeSchema,

  artBack: ArtSchema,
  artBackHorizontal: z.nullable(z.boolean()),
  artFront: ArtSchema,
  artFrontHorizontal: z.nullable(z.boolean()),
  artThumbnail: ArtThumbnailSchema,

  variantTypes: z.nullable(VariantAttributeSchema),

  // probably don't need these for now
  // cardId: z.nullable(z.string()),
  // cardCount: z.number(),
  // createdAt: z.coerce.date(),
  // updatedAt: z.coerce.date(),
  // publishedAt: z.coerce.date(),
  // locale: LocaleSchema,
  // localizations: LocalizationsSchema,
});

export const CardAttributesSchema = BaseCardAttributesSchema.extend({
  variants: z.optional(
    z
      .object({
        data: z.array(
          z.object({
            id: z.number(),
            attributes: BaseCardAttributesSchema,
          }),
        ),
      })
      .or(
        z.array(
          z.object({
            id: z.number(),
            attributes: BaseCardAttributesSchema,
          }),
        ),
      ),
  ),
});
export type CardAttributes = z.infer<typeof CardAttributesSchema>;

export const CardSchema = z.object({
  id: z.number(),
  attributes: CardAttributesSchema,
});
export type Card = z.infer<typeof CardSchema>;
