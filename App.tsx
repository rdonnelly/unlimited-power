import 'expo-dev-client';

import { useAsyncStorageDevTools } from '@dev-plugins/async-storage';
import { useReactNavigationDevTools } from '@dev-plugins/react-navigation';
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { useNavigationContainerRef } from '@react-navigation/native';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type Theme,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';

import { useTheme } from '@hooks/useTheme';
import { StackNavigator } from '@navigation/StackNavigation';

const queryClient = new QueryClient();

export default function App() {
  useAsyncStorageDevTools();
  useReactQueryDevTools(queryClient);
  const navigationRef = useNavigationContainerRef();
  useReactNavigationDevTools(navigationRef);

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
        <NavigationContainer theme={navigationTheme} ref={navigationRef}>
          <StackNavigator />
        </NavigationContainer>
      </QueryClientProvider>
      <StatusBar style="auto" />
    </>
  );
}
