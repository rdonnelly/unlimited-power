import { StyleSheet, useColorScheme } from 'react-native';

import { DARK_THEME, LIGHT_THEME } from '@styles/theme';

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
    themedColor: {
      color: theme.text,
    },
    themedColorSubdued: {
      color: theme.textSubdued,
    },
    themedBorder: {
      borderColor: theme.tint,
    },
    themedBorderSubdued: {
      borderColor: theme.tintSubdued,
    },

    // BUTTON
    themedButtonContainer: {
      backgroundColor: theme.button,
    },
    themedButtonContainerBold: {
      backgroundColor: theme.buttonBold,
    },
    themedButtonBorder: {
      borderColor: theme.buttonBorder,
    },
    themedButtonText: {
      color: theme.buttonTint,
    },
    themedButtonTextBold: {
      color: theme.buttonTintBold,
    },
    themedButtonBorderBold: {
      borderColor: theme.buttonBorderBold,
    },
  });

  return {
    theme,
    themeStyles: styles,
  };
}
