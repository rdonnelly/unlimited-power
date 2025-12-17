# Unlimited Power - AI Coding Instructions

## Project Overview

React Native app for Star Wars Unlimited card game using Expo SDK 54 with the new architecture enabled. Displays a searchable/filterable card list fetching from `admin.starwarsunlimited.com` API.

## Architecture & Core Libraries

### Data Layer

- **TanStack Query** for server state with AsyncStorage persistence (24h cache, config in [App.tsx](../App.tsx#L36))
- **Zustand** for client state (filters only - see [src/data/stores/](../src/data/stores/))
- **Zod** for schema validation ([src/data/Card.ts](../src/data/Card.ts), etc.)
- API fetching pattern: Build query with `qs.stringify()`, then client-side filter by aspects (see [useCards.ts](../src/data/hooks/useCards.ts#L47))

### UI Stack

- **React Navigation** native stack with custom header rendering ([StackNavigation.tsx](../src/navigation/StackNavigation.tsx))
- **@gorhom/bottom-sheet** for filter UI ([CardListBottomSheet.tsx](../src/components/CardListBottomSheet.tsx))
- **@shopify/flash-list** for list virtualization (required for large card datasets)
- **Reanimated v4 + Worklets** for animations - see [PressableScale.tsx](../src/components/PressableScale.tsx) pattern using `scheduleOnRN/scheduleOnUI`

## Key Conventions

### Path Aliases (required in both tsconfig.json and babel.config.js)

```typescript
import { Card } from '@data/Card'; // not '../data/Card'
import { useTheme } from '@hooks/useTheme'; // not '../../hooks/useTheme'
```

### Theme System

- Dual light/dark themes defined in [src/styles/theme.ts](../src/styles/theme.ts)
- Access via `useTheme()` hook which provides `theme` object + `themeStyles` helpers
- Example usage: `style={[styles.text, themeStyles.color]}`

### Data Patterns

- Filter stores: Toggle pattern with `selectAll/selectNone` helpers (see [useAspectFilterStore.ts](../src/data/stores/useAspectFilterStore.ts))
- Card models: Base attributes + relational data (aspects, expansion, type) - check [Card.ts](../src/data/Card.ts) for schema
- Infinite scroll: Use `useInfiniteQuery` with `PAGE_SIZE = 50` constant

### Component Patterns

- Pressable components: Use native `Pressable` with `pressed` render prop for visual feedback
- Animated interactions: Extend `PressableScale` for scale animations on press
- Constants: Export component dimensions (e.g., `ITEM_HEIGHT = 64` in [CardListItem.tsx](../src/components/CardListItem.tsx#L15))

## Developer Workflow

### Running

```bash
npm run dev              # Start dev client (requires pre-built dev client)
npm run check:ts         # TypeScript validation
npm run check:lint       # ESLint with auto-sort imports
```

### Building

```bash
npm run build:ios:simulator:local    # Local iOS simulator build
npm run build:android:dev:local      # Local Android dev build
npm run push:ios                     # Submit iOS to App Store
```

### Patches

- Uses `patch-package` (runs on postinstall)
- Existing patch: `react-native-render-html+6.3.4.patch` - maintain when upgrading dependencies

## Critical Details

### Bugsnag Integration

- Only enabled in production (`if (!__DEV__)`) - see [App.tsx](../App.tsx#L29)
- API key in [app.json](../app.json) `extra.bugsnag.apiKey`

### App State Management

- Focus manager syncs React Query with app state (see [App.tsx](../App.tsx#L44))
- Online manager handles network-aware refetching ([useOnlineManager.ts](../src/hooks/useOnlineManager.ts))

### Navigation Types

- Define screen params in [src/navigation/types.ts](../src/navigation/types.ts)
- Use typed navigation props: `CardListScreenProps`, `CardDetailScreenProps`

### Splash Screen

- Manually controlled via `expo-splash-screen` - hide after font loading completes ([App.tsx](../App.tsx#L91))

## Common Tasks

**Add new filter**: Create zustand store in `src/data/stores/`, export options array + selector, integrate in `useCardsQueryKey`

**Add new screen**: Define in `StackParamList` types → add to `Stack.Navigator` → create screen component following existing patterns

**Update theme colors**: Modify both `LIGHT_THEME` and `DARK_THEME` in [theme.ts](../src/styles/theme.ts) - keep semantic naming consistent
