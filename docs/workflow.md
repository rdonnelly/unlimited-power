# Workflow

## Building & submitting

```bash
npm run build:ios:simulator:local    # local iOS simulator build
npm run build:android:dev:local      # local Android dev build
npm run push:ios                      # build + auto-submit iOS to the App Store
npm run push:android                  # build + auto-submit Android
```

All build/submit scripts wrap `eas-cli`; profiles are defined in [eas.json](../eas.json).

## Patches

- `patch-package` runs automatically on `postinstall`.
- Existing patch: `react-native-render-html+6.3.4.patch` — re-verify and maintain it when upgrading dependencies.

## Dependency overrides

- [package.json](../package.json) has an `overrides` block for `@bugsnag/expo` and its plugins. Bugsnag versions its Expo package to track the Expo SDK major, and it lags — there is no SDK 56/57 release. The overrides relax its `expo-*` / `@react-native-community/netinfo` peer pins to the app's own (newer) versions so installs resolve.
- **When upgrading the Expo SDK, bump these override versions** to match the new `expo-*` deps (see the `comments.overrides` note in package.json). If Bugsnag ships a version matching the app's SDK, drop the corresponding overrides. If a runtime issue surfaces, the fallback is migrating to `@bugsnag/react-native` + its Expo config plugin.

## Upgrading the Expo SDK

- Go one major at a time. Per SDK: `npx expo install expo@^<N>.0.0 --fix`, then manually bump the libs in `expo.install.exclude` (reanimated, worklets, gesture-handler, screens, flash-list) to that SDK's `bundledNativeModules.json` targets, then update the Bugsnag `overrides` (above).
- Verify each step: `npm run check:ts`, `npm run check:lint`, `npx expo-doctor@latest`, confirm the render-html patch still applies, and `npx expo export --platform ios` for an end-to-end bundle check.
