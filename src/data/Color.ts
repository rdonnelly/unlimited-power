import * as z from 'zod';

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
