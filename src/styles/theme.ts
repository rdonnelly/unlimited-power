import { colors } from '@styles/colors';

export const LIGHT_THEME = {
  scheme: 'light',

  // BRAND
  primary100: colors.purple100,
  secondary100: colors.teal50,

  // BACKGROUND
  background0: colors.white,
  background50: colors.stone50,
  background100: colors.stone100,
  background200: colors.stone200,
  background300: colors.stone300,
  background400: colors.stone400,

  // TINT
  tint: colors.stone950,
  tintSubdued: colors.stone400,

  // TEXT
  text: colors.stone950,
  textSubdued: colors.stone500,

  // BUTTON
  button: colors.purple100,
  buttonTint: colors.purple700,
  buttonBorder: colors.purple200,
  buttonBold: colors.purple700,
  buttonTintBold: colors.purple50,
  buttonBorderBold: colors.purple950,
} as const;

export const DARK_THEME = {
  scheme: 'dark',

  // BRAND
  primary100: colors.purple900,
  secondary100: colors.teal900,

  // BACKGROUND
  background0: colors.black,
  background50: colors.stone950,
  background100: colors.stone900,
  background200: colors.stone800,
  background300: colors.stone700,
  background400: colors.stone600,

  // TINT
  tint: colors.stone50,
  tintSubdued: colors.stone600,

  // TEXT
  text: colors.stone200,
  textSubdued: colors.stone500,

  // BUTTON
  button: colors.stone900,
  buttonTint: colors.stone50,
  buttonBorder: colors.stone700,
  buttonBold: colors.purple900,
  buttonTintBold: colors.purple100,
  buttonBorderBold: colors.purple400,
} as const;
