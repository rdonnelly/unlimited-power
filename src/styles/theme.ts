import { colors } from './colors';

export const LIGHT_THEME = {
  scheme: 'light',

  // BRAND
  brand: colors.purple100,

  // BACKGROUND
  background0: colors.white,
  background50: colors.stone50,
  background100: colors.stone100,
  background200: colors.stone200,
  background300: colors.stone300,
  background400: colors.stone400,

  // TINT
  tint: colors.stone950,
  tintSubdued: colors.stone500,

  // BUTTON
  button: colors.purple100,
  buttonTint: colors.purple700,
  buttonBorder: colors.purple300,
  buttonBold: colors.purple700,
  buttonTintBold: colors.purple50,
  buttonBorderBold: colors.purple700,
} as const;

export const DARK_THEME = {
  scheme: 'dark',

  // BRAND
  brand: colors.purple900,

  // BACKGROUND
  background0: colors.black,
  background50: colors.stone950,
  background100: colors.stone900,
  background200: colors.stone800,
  background300: colors.stone700,
  background400: colors.stone600,

  // TINT
  tint: colors.stone50,
  tintSubdued: colors.stone400,

  // BUTTON
  button: colors.stone900,
  buttonTint: colors.stone50,
  buttonBorder: colors.stone400,
  buttonBold: colors.purple950,
  buttonTintBold: colors.purple100,
  buttonBorderBold: colors.purple400,
} as const;
