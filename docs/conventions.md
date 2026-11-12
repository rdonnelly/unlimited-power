# Conventions

## Theme system

- Dual light/dark themes are defined in [src/styles/theme.ts](../src/styles/theme.ts).
- Access via the `useTheme()` hook, which returns the `theme` object plus `themeStyles` helpers.
- Usage: `style={[styles.text, themeStyles.color]}`.

## Data & store patterns

- **Filters** live in one store with `setGroup` / `reset` / `apply`; groups are defined once in `FILTER_GROUPS`. See [useFilterStore.ts](../src/data/stores/useFilterStore.ts).

## Component patterns

- **Pressables**: use the native `Pressable` with the `pressed` render prop for visual feedback.
- **Animated interactions**: extend `PressableScale` for scale-on-press animations.
- **Dimension constants**: export component dimensions rather than inlining them — e.g. `ITEM_HEIGHT = 64` in [CardListItem.tsx](../src/components/CardListItem.tsx#L15).
