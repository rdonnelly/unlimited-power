import * as z from 'zod';

export const LocaleSchema = z.enum(['en']);
export type Locale = z.infer<typeof LocaleSchema>;

export const AttributeSchema = z.object({
  // name: z.string(),
  // color: z.union([ColorSchema, z.null()]).optional(),

  // description: z.union([z.null(), z.string()]).optional(),
  // englishName: z.union([EnglishNameSchema, z.null()]).optional(),
  // code: z.union([CodeSchema, z.null()]).optional(),
  // character: z.union([CharacterSchema, z.null()]).optional(),
  // value: z.union([ValueSchema, z.null()]).optional(),

  locale: LocaleSchema,

  // createdAt: z.coerce.date(),
  // updatedAt: z.coerce.date(),
  // publishedAt: z.coerce.date(),
});

export type Attribute = z.infer<typeof AttributeSchema>;

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
