import * as z from 'zod';

import { ArtSchema, ArtThumbnailSchema } from '@data/CardArt';
import {
  ArenaAttributeSchema,
  AspectAttributeSchema,
  AttributeSchema,
  RarityAttributeSchema,
  TypeAttributeSchema,
} from '@data/Shared';

export const CharacterSchema = z.enum(['C', 'L', 'R', 'S', 'U']);
export type Character = z.infer<typeof CharacterSchema>;

export const CodeSchema = z.enum(['SOR']);
export type Code = z.infer<typeof CodeSchema>;

export const NameSchema = z.enum([
  'Event Exclusive',
  'Ground',
  'OP Promo',
  'Prerelease Promo',
  'Space',
]);
export type Name = z.infer<typeof NameSchema>;

export const LocalizationsDatumSchema = z.object({
  id: z.number(),
  attributes: z.object({
    title: z.string(),
    subtitle: z.nullable(z.string()),
    cardNumber: z.number(),
    cardCount: z.number(),
    artist: z.string(),
    artFrontHorizontal: z.boolean(),
    artBackHorizontal: z.null(),
    hasFoil: z.boolean(),
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
    cardId: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    publishedAt: z.coerce.date(),
    locale: z.enum(['de', 'es', 'fr', 'it']),
    hyperspace: z.boolean(),
    unique: z.boolean(),
    showcase: z.boolean(),
    cardUid: z.string(),
  }),
});
export type LocalizationsDatum = z.infer<typeof LocalizationsDatumSchema>;

export const LocalizationsSchema = z.object({
  data: z.array(LocalizationsDatumSchema),
});
export type Localizations = z.infer<typeof LocalizationsSchema>;

export const ExpansionSchema = z.object({
  data: z.nullable(
    z.object({
      id: z.number(),
      attributes: AttributeSchema,
    }),
  ),
});
export type Expansion = z.infer<typeof ExpansionSchema>;

export const AspectDuplicatesSchema = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      attributes: AttributeSchema,
    }),
  ),
});
export type AspectDuplicates = z.infer<typeof AspectDuplicatesSchema>;

export const CardAttributesSchema = z.object({
  cardNumber: z.number(),
  title: z.string(),
  subtitle: z.nullable(z.string()),
  unique: z.boolean(),

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

  artFrontHorizontal: z.boolean(),
  artBackHorizontal: z.null(),
  hasFoil: z.boolean(),
  hyperspace: z.boolean(),
  showcase: z.boolean(),

  arenas: ArenaAttributeSchema,
  aspectDuplicates: AspectAttributeSchema,
  aspects: AspectAttributeSchema,
  rarity: RarityAttributeSchema,
  type: TypeAttributeSchema,
  type2: TypeAttributeSchema,

  expansion: ExpansionSchema,
  keywords: AspectDuplicatesSchema,
  traits: AspectDuplicatesSchema,

  // probably don't need these for now
  // cardUid: z.string(),
  // cardId: z.nullable(z.string()),
  // cardCount: z.number(),
  // createdAt: z.coerce.date(),
  // updatedAt: z.coerce.date(),
  // publishedAt: z.coerce.date(),

  artBack: ArtSchema,
  artFront: ArtSchema,
  artThumbnail: ArtThumbnailSchema,
  // locale: LocaleSchema,
  // localizations: LocalizationsSchema,
  // variantOf: ArenasSchema,
  // variantTypes: ArenasSchema,
  // variants: ArenasSchema,
});
export type CardAttributes = z.infer<typeof CardAttributesSchema>;

export const CardSchema = z.object({
  id: z.number(),
  attributes: CardAttributesSchema,
});
export type Card = z.infer<typeof CardSchema>;
