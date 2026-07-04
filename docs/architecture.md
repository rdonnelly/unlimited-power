# Architecture & Core Libraries

## Data layer

- **TanStack Query** for server state, persisted to AsyncStorage (24h cache). Config in [App.tsx](../App.tsx#L36).
- **Zustand** for client state — filters only. See [src/data/stores/](../src/data/stores/).
- **Zod** for schema validation. See [src/data/Card.ts](../src/data/Card.ts).
- **API fetching pattern**: build the query with `qs.stringify()`, then filter client-side by aspects. See [useCards.ts](../src/data/hooks/useCards.ts#L47).
- **Infinite scroll**: `useInfiniteQuery` with `PAGE_SIZE = 50`.
- **Card models**: base attributes plus relational data (aspects, expansion, type). See [Card.ts](../src/data/Card.ts) for the schema.

## UI stack

- **React Navigation** native stack with custom header rendering. See [StackNavigation.tsx](../src/navigation/StackNavigation.tsx).
  - Define screen params in [src/navigation/types.ts](../src/navigation/types.ts) and use typed props (`CardListScreenProps`, `CardDetailScreenProps`).
- **@gorhom/bottom-sheet** for filter UI. See [CardListBottomSheet.tsx](../src/components/CardListBottomSheet.tsx).
- **@shopify/flash-list** for list virtualization (required for the large card dataset).
- **Reanimated v4 + Worklets** for animations, using the `scheduleOnRN` / `scheduleOnUI` pattern. See [PressableScale.tsx](../src/components/PressableScale.tsx).

## App lifecycle & integrations

- **Splash screen**: manually controlled via `expo-splash-screen` — hide after font loading completes. See [App.tsx](../App.tsx#L91).
- **App-state focus**: focus manager syncs React Query with app state. See [App.tsx](../App.tsx#L44).
- **Online manager**: network-aware refetching. See [useOnlineManager.ts](../src/hooks/useOnlineManager.ts).
- **Bugsnag**: enabled in production only (`if (!__DEV__)`, [App.tsx](../App.tsx#L29)); API key in [app.json](../app.json) at `extra.bugsnag.apiKey`.
