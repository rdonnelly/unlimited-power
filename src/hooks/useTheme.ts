import { StyleSheet, useColorScheme } from 'react-native';

import { DARK_THEME, LIGHT_THEME, type Theme } from '@styles/theme';

function createThemeStyles(theme: Theme) {
  return StyleSheet.create({
    // BACKGROUND
    background0: {
      backgroundColor: theme.background0,
    },
    background50: {
      backgroundColor: theme.background50,
    },
    background100: {
      backgroundColor: theme.background100,
    },
    background200: {
      backgroundColor: theme.background200,
    },
    background300: {
      backgroundColor: theme.background300,
    },
    background400: {
      backgroundColor: theme.background400,
    },

    // COLOR
    color: {
      color: theme.text,
    },
    colorSubdued: {
      color: theme.textSubdued,
    },

    // BORDER
    border: {
      borderColor: theme.tint,
    },
    borderSubdued: {
      borderColor: theme.tintSubdued,
    },

    // BUTTON
    buttonContainer: {
      backgroundColor: theme.button,
    },
    buttonContainerBold: {
      backgroundColor: theme.buttonBold,
    },
    buttonText: {
      color: theme.buttonTint,
    },
    buttonTextBold: {
      color: theme.buttonTintBold,
    },
    buttonBorder: {
      borderColor: theme.buttonBorder,
    },
    buttonBorderBold: {
      borderColor: theme.buttonBorderBold,
    },

    // CHIP
    chipContainer: {
      backgroundColor: theme.chip,
    },
    chipBorder: {
      borderColor: theme.chipBorder,
    },
    chipText: {
      color: theme.chipTint,
    },
    chipSelectedContainer: {
      backgroundColor: theme.chipSelected,
    },
    chipSelectedText: {
      color: theme.chipSelectedTint,
    },
    chipSelectedBorder: {
      borderColor: theme.chipSelectedBorder,
    },
  });
}

const LIGHT_STYLES = createThemeStyles(LIGHT_THEME);
const DARK_STYLES = createThemeStyles(DARK_THEME);

export function useTheme() {
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';

  return {
    theme: isDark ? DARK_THEME : LIGHT_THEME,
    themeStyles: isDark ? DARK_STYLES : LIGHT_STYLES,
  };
}
