import 'expo-dev-client';

import Bugsnag from '@bugsnag/expo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
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
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { type AppStateStatus, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useAppState } from '@hooks/useAppState';
import { useOnlineManager } from '@hooks/useOnlineManager';
import { useTheme } from '@hooks/useTheme';
import { StackNavigator } from '@navigation/StackNavigation';

SplashScreen.preventAutoHideAsync();

if (!__DEV__) {
  Bugsnag.start();
}

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
  const navigationRef = useNavigationContainerRef();

  useOnlineManager();

  useAppState(onAppStateChange);

  const { theme } = useTheme();

  const navigationTheme = useMemo(() => {
    const baseNavigationTheme =
      theme.scheme === 'dark' ? DarkTheme : DefaultTheme;

    return {
      ...baseNavigationTheme,
      dark: theme.scheme === 'dark',
      colors: {
        ...baseNavigationTheme.colors,
        background: theme.background100,
        card: theme.primary100,
        primary: theme.tint,
        text: theme.tint,
      },
    } satisfies Theme;
  }, [theme]);

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync(FontAwesome6.font);
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      SplashScreen.hide();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
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
    </GestureHandlerRootView>
  );
}
