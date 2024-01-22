import * as z from 'zod';

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

export const ColorSchema = z.enum([
  '#d1d1d1',
  '#d30808',
  '#eb9f1c',
  '#f1c000',
  '#ffffff',
  '#000000',
  '#00c8f3',
  '#0b992d',
  '#4073d4',
  '#964d02',
]);
export type Color = z.infer<typeof ColorSchema>;

export const EnglishNameSchema = z.enum([
  'Aggression',
  'Command',
  'Common',
  'Cunning',
  'Heroism',
  'Legendary',
  'Rare',
  'Starter',
  'Uncommon',
  'Vigilance',
  'Villainy',
]);
export type EnglishName = z.infer<typeof EnglishNameSchema>;

export const PurpleLocaleSchema = z.enum(['en']);
export type PurpleLocale = z.infer<typeof PurpleLocaleSchema>;

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

export const TentacledAttributesSchema = z.object({
  name: z.string(),
  description: z.union([z.null(), z.string()]).optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  publishedAt: z.coerce.date(),
  locale: PurpleLocaleSchema,
  color: z.union([ColorSchema, z.null()]).optional(),
  englishName: z.union([EnglishNameSchema, z.null()]).optional(),
  code: z.union([CodeSchema, z.null()]).optional(),
  character: z.union([CharacterSchema, z.null()]).optional(),
  value: z.union([ValueSchema, z.null()]).optional(),
});
export type TentacledAttributes = z.infer<typeof TentacledAttributesSchema>;

export const DatSchema = z.object({
  id: z.number(),
  attributes: TentacledAttributesSchema,
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

// export const ArenasSchema = z.object({
//   data: z.union([z.array(DataDatumSchema), DataDataSchema, z.null()]),
// });
// export type Arenas = z.infer<typeof ArenasSchema>;

// export const DataDatumSchema = z.object({
//   id: z.number(),
//   attributes: FluffyAttributesSchema,
// });
// export type DataDatum = z.infer<typeof DataDatumSchema>;

// export const FluffyAttributesSchema = z.object({
//   name: z.union([NameSchema, z.null()]).optional(),
//   description: z.null().optional(),
//   createdAt: z.coerce.date(),
//   updatedAt: z.coerce.date(),
//   publishedAt: z.coerce.date(),
//   locale: PurpleLocaleSchema,
//   title: z.union([z.null(), z.string()]).optional(),
//   subtitle: z.union([z.null(), z.string()]).optional(),
//   cardNumber: z.union([z.number(), z.null()]).optional(),
//   cardCount: z.union([z.number(), z.null()]).optional(),
//   artist: z.union([z.null(), z.string()]).optional(),
//   artFrontHorizontal: z.union([z.boolean(), z.null()]).optional(),
//   artBackHorizontal: z.null().optional(),
//   hasFoil: z.union([z.boolean(), z.null()]).optional(),
//   cost: z.union([z.number(), z.null()]).optional(),
//   hp: z.union([z.number(), z.null()]).optional(),
//   power: z.union([z.number(), z.null()]).optional(),
//   text: z.union([z.null(), z.string()]).optional(),
//   textStyled: z.union([z.null(), z.string()]).optional(),
//   deployBox: z.union([z.null(), z.string()]).optional(),
//   deployBoxStyled: z.union([z.null(), z.string()]).optional(),
//   epicAction: z.union([z.null(), z.string()]).optional(),
//   epicActionStyled: z.union([z.null(), z.string()]).optional(),
//   linkHtml: z.union([z.null(), z.string()]).optional(),
//   cardId: z.union([z.null(), z.string()]).optional(),
//   hyperspace: z.union([z.boolean(), z.null()]).optional(),
//   unique: z.union([z.boolean(), z.null()]).optional(),
//   showcase: z.union([z.boolean(), z.null()]).optional(),
//   cardUid: z.union([z.null(), z.string()]).optional(),
//   variantOf: z.union([ArenasSchema, z.null()]).optional(),
//   variantTypes: z.union([ArenasSchema, z.null()]).optional(),
//   expansion: z.union([ExpansionSchema, z.null()]).optional(),
//   rarity: z.union([ExpansionSchema, z.null()]).optional(),
//   keywords: z.union([AspectDuplicatesSchema, z.null()]).optional(),
//   arenas: z.union([ArenasSchema, z.null()]).optional(),
//   traits: z.union([AspectDuplicatesSchema, z.null()]).optional(),
//   type2: z.union([ExpansionSchema, z.null()]).optional(),
//   type: z.union([ExpansionSchema, z.null()]).optional(),
//   aspectDuplicates: z.union([AspectDuplicatesSchema, z.null()]).optional(),
//   aspects: z.union([AspectDuplicatesSchema, z.null()]).optional(),
//   localizations: z.union([LocalizationsSchema, z.null()]).optional(),
//   artThumbnail: z.union([ArenasSchema, z.null()]).optional(),
//   artBack: z.union([ArenasSchema, z.null()]).optional(),
//   artFront: z.union([ArenasSchema, z.null()]).optional(),
// });
// export type FluffyAttributes = z.infer<typeof FluffyAttributesSchema>;

// export const IndigoAttributesSchema = z.object({
//   name: z.union([z.null(), z.string()]).optional(),
//   alternativeText: z.union([z.null(), z.string()]).optional(),
//   caption: z.null().optional(),
//   width: z.union([z.number(), z.null()]).optional(),
//   height: z.union([z.number(), z.null()]).optional(),
//   formats: z.union([FluffyFormatsSchema, z.null()]).optional(),
//   hash: z.union([z.null(), z.string()]).optional(),
//   ext: z.union([ExtSchema, z.null()]).optional(),
//   mime: z.union([MimeSchema, z.null()]).optional(),
//   size: z.union([z.number(), z.null()]).optional(),
//   url: z.union([z.null(), z.string()]).optional(),
//   previewUrl: z.null().optional(),
//   provider: z.union([ProviderSchema, z.null()]).optional(),
//   provider_metadata: z.null().optional(),
//   createdAt: z.coerce.date(),
//   updatedAt: z.coerce.date(),
//   title: z.union([z.null(), z.string()]).optional(),
//   subtitle: z.union([z.null(), z.string()]).optional(),
//   cardNumber: z.union([z.number(), z.null()]).optional(),
//   cardCount: z.union([z.number(), z.null()]).optional(),
//   artist: z.union([z.null(), z.string()]).optional(),
//   artFrontHorizontal: z.union([z.boolean(), z.null()]).optional(),
//   artBackHorizontal: z.null().optional(),
//   hasFoil: z.union([z.boolean(), z.null()]).optional(),
//   cost: z.union([z.number(), z.null()]).optional(),
//   hp: z.union([z.number(), z.null()]).optional(),
//   power: z.union([z.number(), z.null()]).optional(),
//   text: z.union([z.null(), z.string()]).optional(),
//   textStyled: z.union([z.null(), z.string()]).optional(),
//   deployBox: z.union([z.null(), z.string()]).optional(),
//   deployBoxStyled: z.union([z.null(), z.string()]).optional(),
//   epicAction: z.union([z.null(), z.string()]).optional(),
//   epicActionStyled: z.union([z.null(), z.string()]).optional(),
//   linkHtml: z.union([z.null(), z.string()]).optional(),
//   cardId: z.union([z.null(), z.string()]).optional(),
//   publishedAt: z.union([z.coerce.date(), z.null()]).optional(),
//   locale: z.union([PurpleLocaleSchema, z.null()]).optional(),
//   hyperspace: z.union([z.boolean(), z.null()]).optional(),
//   unique: z.union([z.boolean(), z.null()]).optional(),
//   showcase: z.union([z.boolean(), z.null()]).optional(),
//   cardUid: z.union([z.null(), z.string()]).optional(),
//   artFront: z.union([ArenasSchema, z.null()]).optional(),
//   artBack: z.union([ArenasSchema, z.null()]).optional(),
//   artThumbnail: z.union([ArtThumbnailSchema, z.null()]).optional(),
//   localizations: z.union([LocalizationsSchema, z.null()]).optional(),
//   aspects: z.union([AspectDuplicatesSchema, z.null()]).optional(),
//   aspectDuplicates: z.union([AspectDuplicatesSchema, z.null()]).optional(),
//   type: z.union([ExpansionSchema, z.null()]).optional(),
//   type2: z.union([ExpansionSchema, z.null()]).optional(),
//   traits: z.union([AspectDuplicatesSchema, z.null()]).optional(),
//   arenas: z.union([ArenasSchema, z.null()]).optional(),
//   keywords: z.union([AspectDuplicatesSchema, z.null()]).optional(),
//   rarity: z.union([ExpansionSchema, z.null()]).optional(),
//   expansion: z.union([ExpansionSchema, z.null()]).optional(),
//   variantTypes: z.union([ArenasSchema, z.null()]).optional(),
// });
// export type IndigoAttributes = z.infer<typeof IndigoAttributesSchema>;

// export const DataDataSchema = z.object({
//   id: z.number(),
//   attributes: IndigoAttributesSchema,
// });
// export type DataData = z.infer<typeof DataDataSchema>;

export const CardAttributesSchema = z.object({
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
  cardId: z.union([z.null(), z.string()]),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  publishedAt: z.coerce.date(),
  hyperspace: z.boolean(),
  unique: z.boolean(),
  showcase: z.boolean(),
  cardUid: z.string(),

  // arenas: ArenasSchema,
  // artBack: ArtSchema,
  // artFront: ArtSchema,
  // artThumbnail: ArtThumbnailSchema,
  // aspectDuplicates: AspectDuplicatesSchema,
  // aspects: AspectDuplicatesSchema,
  // expansion: ExpansionSchema,
  // keywords: AspectDuplicatesSchema,
  // locale: PurpleLocaleSchema,
  // localizations: LocalizationsSchema,
  // rarity: ExpansionSchema,
  // traits: AspectDuplicatesSchema,
  // type2: ExpansionSchema,
  // type: ExpansionSchema,
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
