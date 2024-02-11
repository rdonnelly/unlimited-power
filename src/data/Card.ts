import * as z from 'zod';

import { ArenaAttributeSchema } from '@data/Arena';
import { AspectAttributeSchema } from '@data/Aspect';
import { RarityAttributeSchema } from '@data/Rarity';
import { AttributeSchema } from '@data/Shared';
import { TypeAttributeSchema } from '@data/Type';

export const ExtSchema = z.enum(['.png']);
export type Ext = z.infer<typeof ExtSchema>;

export const MimeSchema = z.enum(['image/png']);
export type Mime = z.infer<typeof MimeSchema>;

export const ProviderSchema = z.enum(['aws-s3']);
export type Provider = z.infer<typeof ProviderSchema>;

export const CharacterSchema = z.enum(['C', 'L', 'R', 'S', 'U']);
export type Character = z.infer<typeof CharacterSchema>;

export const CodeSchema = z.enum(['SOR']);
export type Code = z.infer<typeof CodeSchema>;

export const ValueSchema = z.enum([
  'Base',
  'Event',
  'Leader',
  'Leader Unit',
  'Token',
  'Unit',
  'Upgrade',
]);
export type Value = z.infer<typeof ValueSchema>;

export const FluffyLocaleSchema = z.enum(['de', 'es', 'fr', 'it']);
export type FluffyLocale = z.infer<typeof FluffyLocaleSchema>;

export const NameSchema = z.enum([
  'Event Exclusive',
  'Ground',
  'OP Promo',
  'Prerelease Promo',
  'Space',
]);
export type Name = z.infer<typeof NameSchema>;

export const ThumbnailSchema = z.object({
  ext: ExtSchema,
  url: z.string(),
  hash: z.string(),
  mime: MimeSchema,
  name: z.string(),
  path: z.null(),
  size: z.number(),
  width: z.number(),
  height: z.number(),
});
export type Thumbnail = z.infer<typeof ThumbnailSchema>;

export const FluffyFormatsSchema = z.object({
  card: z.union([ThumbnailSchema, z.null()]).optional(),
  xsmall: z.union([ThumbnailSchema, z.null()]).optional(),
  xxsmall: ThumbnailSchema,
  xxxsmall: ThumbnailSchema,
  thumbnail: ThumbnailSchema,
});
export type FluffyFormats = z.infer<typeof FluffyFormatsSchema>;

export const HilariousAttributesSchema = z.object({
  name: z.string(),
  alternativeText: z.union([z.null(), z.string()]),
  caption: z.union([z.null(), z.string()]),
  width: z.number(),
  height: z.number(),
  formats: FluffyFormatsSchema,
  hash: z.string(),
  ext: ExtSchema,
  mime: MimeSchema,
  size: z.number(),
  url: z.string(),
  previewUrl: z.null(),
  provider: ProviderSchema,
  provider_metadata: z.null(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type HilariousAttributes = z.infer<typeof HilariousAttributesSchema>;

export const ArtBackDataClassSchema = z.object({
  id: z.number(),
  attributes: HilariousAttributesSchema,
});
export type ArtBackDataClass = z.infer<typeof ArtBackDataClassSchema>;

export const ArtSchema = z.object({
  data: z.union([ArtBackDataClassSchema, z.null()]),
});
export type Art = z.infer<typeof ArtSchema>;

export const StickyAttributesSchema = z.object({
  title: z.string(),
  subtitle: z.union([z.null(), z.string()]),
  cardNumber: z.number(),
  cardCount: z.number(),
  artist: z.string(),
  artFrontHorizontal: z.boolean(),
  artBackHorizontal: z.null(),
  hasFoil: z.boolean(),
  cost: z.union([z.number(), z.null()]),
  hp: z.union([z.number(), z.null()]),
  power: z.union([z.number(), z.null()]),
  text: z.union([z.null(), z.string()]),
  textStyled: z.string(),
  deployBox: z.union([z.null(), z.string()]),
  deployBoxStyled: z.string(),
  epicAction: z.union([z.null(), z.string()]),
  epicActionStyled: z.string(),
  linkHtml: z.string(),
  cardId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  publishedAt: z.coerce.date(),
  locale: FluffyLocaleSchema,
  hyperspace: z.boolean(),
  unique: z.boolean(),
  showcase: z.boolean(),
  cardUid: z.string(),
});
export type StickyAttributes = z.infer<typeof StickyAttributesSchema>;

export const LocalizationsDatumSchema = z.object({
  id: z.number(),
  attributes: StickyAttributesSchema,
});
export type LocalizationsDatum = z.infer<typeof LocalizationsDatumSchema>;

export const LocalizationsSchema = z.object({
  data: z.array(LocalizationsDatumSchema),
});
export type Localizations = z.infer<typeof LocalizationsSchema>;

export const DatSchema = z.object({
  id: z.number(),
  attributes: AttributeSchema,
});
export type Dat = z.infer<typeof DatSchema>;

export const ExpansionSchema = z.object({
  data: z.union([DatSchema, z.null()]),
});
export type Expansion = z.infer<typeof ExpansionSchema>;

export const AspectDuplicatesSchema = z.object({
  data: z.array(DatSchema),
});
export type AspectDuplicates = z.infer<typeof AspectDuplicatesSchema>;

export const PurpleFormatsSchema = z.object({
  xxsmall: ThumbnailSchema,
  xxxsmall: ThumbnailSchema,
  thumbnail: ThumbnailSchema,
});
export type PurpleFormats = z.infer<typeof PurpleFormatsSchema>;

export const IndecentAttributesSchema = z.object({
  name: z.string(),
  alternativeText: z.union([z.null(), z.string()]),
  caption: z.null(),
  width: z.number(),
  height: z.number(),
  formats: PurpleFormatsSchema,
  hash: z.string(),
  ext: ExtSchema,
  mime: MimeSchema,
  size: z.number(),
  url: z.string(),
  previewUrl: z.null(),
  provider: ProviderSchema,
  provider_metadata: z.null(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type IndecentAttributes = z.infer<typeof IndecentAttributesSchema>;

export const ArtThumbnailDataClassSchema = z.object({
  id: z.number(),
  attributes: IndecentAttributesSchema,
});
export type ArtThumbnailDataClass = z.infer<typeof ArtThumbnailDataClassSchema>;

export const ArtThumbnailSchema = z.object({
  data: ArtThumbnailDataClassSchema,
});
export type ArtThumbnail = z.infer<typeof ArtThumbnailSchema>;

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

  // expansion: ExpansionSchema,
  // keywords: AspectDuplicatesSchema,
  // traits: AspectDuplicatesSchema,

  // probably don't need these for now
  // cardUid: z.string(),
  // cardId: z.nullable(z.string()),
  // cardCount: z.number(),
  // createdAt: z.coerce.date(),
  // updatedAt: z.coerce.date(),
  // publishedAt: z.coerce.date(),

  // artBack: ArtSchema,
  // artFront: ArtSchema,
  // artThumbnail: ArtThumbnailSchema,
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
