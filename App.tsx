import 'expo-dev-client';

import Bugsnag from '@bugsnag/expo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useNavigationContainerRef } from '@react-navigation/native';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type Theme,
} from '@react-navigation/native';
import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { type AppStateStatus, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  QUERY_CACHE_TIME,
  QUERY_STALE_TIME,
  shouldRetryQuery,
} from '@data/queryHelpers';
import { useAppIntentHandler } from '@hooks/useAppIntentHandler';
import { useAppState } from '@hooks/useAppState';
import { useOnlineManager } from '@hooks/useOnlineManager';
import { useTheme } from '@hooks/useTheme';
import { StackNavigator } from '@navigation/StackNavigation';

SplashScreen.preventAutoHideAsync();

if (!__DEV__) {
  Bugsnag.start();
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: QUERY_CACHE_TIME,
      staleTime: QUERY_STALE_TIME,
      retry: shouldRetryQuery,
    },
  },
});

function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

function AppIntentHandler({
  navigationRef,
}: {
  navigationRef: Parameters<typeof useAppIntentHandler>[0];
}) {
  useAppIntentHandler(navigationRef);

  return null;
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
  const [navigationIsReady, setNavigationIsReady] = useState(false);

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
      <QueryClientProvider client={queryClient}>
        <NavigationContainer
          theme={navigationTheme}
          ref={navigationRef}
          onReady={() => setNavigationIsReady(true)}
        >
          <StackNavigator />
        </NavigationContainer>
        {navigationIsReady ? (
          <AppIntentHandler navigationRef={navigationRef} />
        ) : null}
      </QueryClientProvider>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
