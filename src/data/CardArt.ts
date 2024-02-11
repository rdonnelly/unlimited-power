import * as z from 'zod';

export const ExtSchema = z.enum(['.png']);
export type Ext = z.infer<typeof ExtSchema>;

export const MimeSchema = z.enum(['image/png']);
export type Mime = z.infer<typeof MimeSchema>;

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

export const ArtThumbnailSchema = z.object({
  data: z.object({
    id: z.number(),
    attributes: z.object({
      name: z.string(),
      alternativeText: z.nullable(z.string()),
      caption: z.null(),
      width: z.number(),
      height: z.number(),
      formats: z.object({
        xxsmall: ThumbnailSchema,
        xxxsmall: ThumbnailSchema,
        thumbnail: ThumbnailSchema,
      }),
      hash: z.string(),
      ext: ExtSchema,
      mime: MimeSchema,
      size: z.number(),
      url: z.string(),
      previewUrl: z.null(),
      provider_metadata: z.null(),
      createdAt: z.coerce.date(),
      updatedAt: z.coerce.date(),
    }),
  }),
});
export type ArtThumbnail = z.infer<typeof ArtThumbnailSchema>;

export const ArtSchema = z.object({
  data: z.nullable(
    z.object({
      id: z.number(),
      attributes: z.object({
        name: z.string(),
        alternativeText: z.nullable(z.string()),
        caption: z.nullable(z.string()),
        width: z.number(),
        height: z.number(),
        formats: z.object({
          card: z.nullable(ThumbnailSchema).optional(),
          xsmall: z.nullable(ThumbnailSchema).optional(),
          xxsmall: ThumbnailSchema,
          xxxsmall: ThumbnailSchema,
          thumbnail: ThumbnailSchema,
        }),
        hash: z.string(),
        ext: ExtSchema,
        mime: MimeSchema,
        size: z.number(),
        url: z.string(),
        previewUrl: z.null(),
        provider_metadata: z.null(),
        createdAt: z.coerce.date(),
        updatedAt: z.coerce.date(),
      }),
    }),
  ),
});
export type Art = z.infer<typeof ArtSchema>;
