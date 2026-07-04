# Common Tasks

## Add a new filter

Create a Zustand store in [src/data/stores/](../src/data/stores/), export its options array and selector, then integrate the selector into `useCardsQueryKey`.

## Add a new screen

Define the screen in `StackParamList` ([src/navigation/types.ts](../src/navigation/types.ts)) → add it to the `Stack.Navigator` → create the screen component following the existing screens.

## Update theme colors

Modify **both** `LIGHT_THEME` and `DARK_THEME` in [src/styles/theme.ts](../src/styles/theme.ts), keeping the semantic naming consistent across the two.
