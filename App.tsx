import 'expo-dev-client';

import { useAsyncStorageDevTools } from '@dev-plugins/async-storage';
import { useReactNavigationDevTools } from '@dev-plugins/react-navigation';
// import { useReactQueryDevTools } from '@dev-plugins/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigationContainerRef } from '@react-navigation/native';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type Theme,
} from '@react-navigation/native';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { focusManager, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { type AppStateStatus, Platform } from 'react-native';

import { useAppState } from '@hooks/useAppState';
import { useOnlineManager } from '@hooks/useOnlineManager';
import { useTheme } from '@hooks/useTheme';
import { StackNavigator } from '@navigation/StackNavigation';

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

export default function App() {
  useAsyncStorageDevTools();
  // useReactQueryDevTools(queryClient);
  const navigationRef = useNavigationContainerRef();
  useReactNavigationDevTools(navigationRef);

  useOnlineManager();

  useAppState(onAppStateChange);

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
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: asyncStoragePersister,
          buster: __DEV__
            ? (Math.random() + 1).toString(36).substring(7)
            : undefined,
        }}
      >
        <NavigationContainer theme={navigationTheme} ref={navigationRef}>
          <StackNavigator />
        </NavigationContainer>
      </PersistQueryClientProvider>
      <StatusBar style="auto" />
    </>
  );
}
