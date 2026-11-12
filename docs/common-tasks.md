# Common Tasks

## Add a new filter

1. Add the option list, a `CardFilters` field, and a `FILTER_GROUPS` entry in [CardFilters.ts](../src/data/CardFilters.ts). The sheet's chips, the active-filter count, Reset, and normalization all derive from `FILTER_GROUPS` and `DEFAULT_FILTERS`.
2. Add the request condition in `buildCardFilters` (and local matching, if the API can't filter it) in the same file. Do not read live store state after a fetch.
3. Add the field to `selectFilters` in [useFilterStore.ts](../src/data/stores/useFilterStore.ts) so it's part of the query key.
4. Extend [browsing.test.cjs](../tests/browsing.test.cjs) for query identity, selection semantics, reset, and pagination. Run `npm test`.

## Add a new screen

Define the screen in `StackParamList` ([src/navigation/types.ts](../src/navigation/types.ts)) → add it to the `Stack.Navigator` → create the screen component following the existing screens.

## Update theme colors

Modify **both** `LIGHT_THEME` and `DARK_THEME` in [src/styles/theme.ts](../src/styles/theme.ts), keeping the semantic naming consistent across the two.

## Add an App Intent (Siri / Shortcuts)

1. Add an `AppIntent` struct in [app-intents/](../app-intents/) whose `perform()` calls `AppIntentDispatcher.shared.dispatch(name:params:)`.
2. Optionally, add phrases in [AppShortcuts.swift](../app-intents/AppShortcuts.swift). The limits are 10 shortcuts, every phrase must include `\(.applicationName)`, and each phrase can interpolate at most one entity parameter.
3. Add its discriminated payload schema in [appIntentParams.ts](../src/data/appIntentParams.ts), then handle the validated invocation in [useAppIntentHandler.ts](../src/hooks/useAppIntentHandler.ts). Coordinate sheet hiding/restoration through [cardSearchSheet.ts](../src/data/cardSearchSheet.ts), including list-directed intents when the list is already focused. Test malformed parameters, cold/warm entry, and acknowledgment failure without duplicate navigation.
4. Rebuild the dev client (`npx expo prebuild -p ios && npx expo run:ios`). Swift changes don't hot-reload.
