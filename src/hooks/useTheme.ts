import { StyleSheet, useColorScheme } from 'react-native';

import { DARK_THEME, LIGHT_THEME } from '@styles/colors';

export function useTheme() {
  const colorScheme = useColorScheme();

  const theme = colorScheme === 'dark' ? DARK_THEME : LIGHT_THEME;

  const styles = StyleSheet.create({
    themedbackground0: {
      backgroundColor: theme.background0,
    },
    themedbackground50: {
      backgroundColor: theme.background50,
    },
    themedbackground100: {
      backgroundColor: theme.background100,
    },
    themedbackground200: {
      backgroundColor: theme.background200,
    },
    themedbackground300: {
      backgroundColor: theme.background300,
    },
    themedbackground400: {
      backgroundColor: theme.background400,
    },
    themedBackgroundBrand: {
      backgroundColor: theme.brand,
    },
    themedBackgroundButton: {
      backgroundColor: theme.button,
    },
    themedBackgroundButtonSubdued: {
      backgroundColor: theme.buttonSubdued,
    },
    themedColor: {
      color: theme.tint,
    },
    themedColorSubdued: {
      color: theme.tintSubdued,
    },
    themedColorButton: {
      color: theme.buttonTint,
    },
    themedColorButtonSubdued: {
      color: theme.buttonSubduedTint,
    },
    themedBorder: {
      borderColor: theme.tint,
    },
    themedBorderSubdued: {
      borderColor: theme.tintSubdued,
    },
  });

  return {
    theme,
    themeStyles: styles,
  };
}
