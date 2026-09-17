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

## Upgrading the Expo SDK

- Go one major at a time. Per SDK: `npx expo install expo@^<N>.0.0 --fix`, then manually bump the libs in `expo.install.exclude` (reanimated, worklets, gesture-handler, screens, flash-list) to that SDK's `bundledNativeModules.json` targets.
- Verify each step: `npm run check:ts`, `npm run check:lint`, `npm run check:format`, `npx expo-doctor@latest`, confirm the render-html patch still applies, and `npx expo export --platform ios` for an end-to-end bundle check.
