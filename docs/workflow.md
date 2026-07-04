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
