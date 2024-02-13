import { StyleSheet, useColorScheme } from 'react-native';

import { DARK_THEME, LIGHT_THEME } from '@styles/colors';

export function useTheme() {
  const colorScheme = useColorScheme();

  const theme = colorScheme === 'dark' ? DARK_THEME : LIGHT_THEME;

  const styles = StyleSheet.create({
    themedBackground100: {
      backgroundColor: theme.background100,
    },
    themedBackground200: {
      backgroundColor: theme.background200,
    },
    themedBackground300: {
      backgroundColor: theme.background300,
    },
    themedColor: {
      color: theme.tint,
    },
    themedColorSubdued: {
      color: theme.tintSubdued,
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
