import 'expo-dev-client';

import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type Theme,
} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { useTheme } from '@hooks/useTheme';
import { StackNavigator } from '@navigation/StackNavigation';

const queryClient = new QueryClient();

export default function App() {
  const { theme } = useTheme();

  const navigationTheme = useMemo(() => {
    const baseNavigationTheme =
      theme.scheme === 'light' ? DefaultTheme : DarkTheme;

    return {
      ...baseNavigationTheme,
      dark: theme.scheme === 'dark',
      colors: {
        ...baseNavigationTheme.colors,
        background: theme.background100,
        card: theme.brand,
        primary: theme.tint,
        text: theme.tint,
      },
    } satisfies Theme;
  }, [theme]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer theme={navigationTheme}>
          <StackNavigator />
        </NavigationContainer>
      </QueryClientProvider>
      <StatusBar style="auto" />
    </>
  );
}
