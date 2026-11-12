import {
  type NavigationContainerRefWithCurrent,
  StackActions,
} from '@react-navigation/native';
import * as AppIntents from 'expo-app-intents';
import { useCallback, useEffect, useRef } from 'react';
import { AppState, Keyboard } from 'react-native';
import { cardSearchSheet } from '@data/cardSearchSheet';
import { parseAppIntent } from '@data/appIntentParams';

import { ExpansionEnum, ExpansionNames } from '@data/Expansion';
import type { CardFilters } from '@data/CardFilters';

// Intents are declared in Swift in app-intents/. Each one dispatches to JS by
// name with the params below.

type NavigationRef =
  NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>;

// Same entry point as unlimitedpower://cards links: the list screen applies
// the filters on arrival (see CardListScreen).
function showCardList(
  navigationRef: NavigationRef,
  filters: Partial<CardFilters>,
) {
  navigationRef.dispatch(
    StackActions.popTo('StackCardListScreen', { filters }),
  );
}

function handleInvocation(
  navigationRef: NavigationRef,
  invocation: NonNullable<ReturnType<typeof parseAppIntent>>,
) {
  switch (invocation.name) {
    case 'searchCards': {
      const { query } = invocation.params;
      showCardList(navigationRef, { search: query });
      break;
    }
    case 'showExpansion': {
      const { expansion } = invocation.params;
      showCardList(navigationRef, { expansions: [expansion] });
      break;
    }
    case 'openCard': {
      const { id, title } = invocation.params;
      navigationRef.dispatch(
        StackActions.push('StackCardDetailScreen', {
          id,
          title,
          index: 0,
          standalone: true,
        }),
      );
      break;
    }
  }
}

// Must only be mounted once the navigation container is ready, so that
// invocations recorded before launch can navigate.
export function useAppIntentHandler(navigationRef: NavigationRef) {
  const handled = useRef(new Set<string>());

  useEffect(() => {
    if (!AppIntents.isAvailable()) {
      return;
    }

    AppIntents.setEntityCatalogAsync(
      'expansion',
      ExpansionEnum.options.map((code) => ({
        id: code,
        title: ExpansionNames[code],
        synonyms: [code],
      })),
    ).catch((e) => console.warn(e));
  }, []);

  const processing = useRef(new Set<string>());
  const processPending = useCallback(
    async (pending: AppIntents.AppIntentInvocation[]) => {
      if (!AppIntents.isAvailable() || !navigationRef.isReady()) return;
      for (const invocation of pending) {
        if (processing.current.has(invocation.id)) continue;
        processing.current.add(invocation.id);
        try {
          if (!handled.current.has(invocation.id)) {
            const parsed = parseAppIntent(invocation);
            if (parsed) {
              Keyboard.dismiss();
              await cardSearchSheet.hide();
              try {
                handleInvocation(navigationRef, parsed);
              } catch (error) {
                void cardSearchSheet.restore().catch(console.warn);
                throw error;
              }
              if (parsed.name !== 'openCard') {
                void cardSearchSheet.restore().catch(console.warn);
              }
            } else
              console.warn(
                `Discarding invalid or unknown App Intent: ${invocation.name}`,
              );
            handled.current.add(invocation.id);
          }
          // A failed acknowledgement retries without navigating a second time.
          await AppIntents.removePendingInvocationAsync(invocation.id);
        } catch (error) {
          // Keep recoverable failures pending for the next foreground retry.
          console.warn(error);
        } finally {
          processing.current.delete(invocation.id);
        }
      }
    },
    [navigationRef],
  );

  AppIntents.useAppIntents(processPending);
  useEffect(() => {
    if (!AppIntents.isAvailable()) return;
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void AppIntents.getPendingInvocationsAsync()
          .then(processPending)
          .catch(console.warn);
      }
    });
    return () => subscription.remove();
  }, [processPending]);
}
