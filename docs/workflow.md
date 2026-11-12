# Workflow

## Building & submitting

```bash
npm run build:ios:simulator:local    # local iOS simulator build
npm run build:android:dev:local      # local Android dev build
npm run push:ios                      # build + auto-submit iOS to the App Store
npm run push:android                  # build + auto-submit Android
```

All build/submit scripts wrap `eas-cli`; profiles are defined in [eas.json](../eas.json).

## Validation

Use the Node version in [.nvmrc](../.nvmrc), then run:

```bash
npm test
npm run check:ts
npm run check:lint
npm run check:format
npx expo export --platform ios --platform android
```

The Node regression runner uses the existing TypeScript dependency; it covers filter identity, None/Neutral semantics, pagination/cancellation, search reset races, serialized sheet focus/navigation transitions, in-memory cache reuse/background errors, image fallback, and native integration helpers. Native UI behavior still requires rebuilt development clients, not Expo Go.

Before shipping browsing changes, validate on iOS and Android:

- Verify the search-and-handle peek is always available on the card list. Drag up/down, scroll filters, and test Done, Android back, search keyboard/submission, dark mode, and accessibility focus/text sizes. Swiping down must collapse, not dismiss. Background cards must remain tappable, including the last result above the peek. Details/About must hide the sheet and returning must restore it.
- Change filters live, use None/All/Reset, and reset while search is debouncing.
- Disconnect after loading cards: loaded content should remain visible. A fresh offline launch should show an actionable connection message, not restore saved card data. Reconnect and retry pagination/detail/image failures without losing usable content.
- Switch card variants, physically touch and hold card art to open native sharing, cancel and repeat, and exercise the image's Share image accessibility action. Check pinch/two-finger pan, horizontal detail paging, and standalone cards. Error retries must remain available without dedicated share/refresh-card buttons.
- On iOS, test Siri/Shortcuts cold and warm entry after the first catalog-publishing launch; malformed/stale card IDs should fail safely. Android must remain usable without App Intents.

Keep FlashList unless a reproducible problem warrants comparison. For performance decisions, use release builds, identical data and devices, rapid scrolling, blank-cell observations, memory, filtering, and large text. Development-client smoke tests are not performance benchmarks.

### Current native baseline

The True Sheet migration builds locally on iOS and Android with Expo 58.0.12 / React Native 0.88.0; production JavaScript exports also pass for both platforms. Native smoke checks cover filtering and image-share presentation. Android checks additionally cover larger text/dark mode, detail paging, loaded-card availability while offline, fresh offline launch, and recovery after reconnecting.

The revised persistent-search sheet and physical long-press sharing were additionally verified in the installed iOS development client: drag/Done collapse, search submission, scrolling filters, last-result access, details/About hide-and-restore, pinch, and detail paging. Production JavaScript exports pass for both platforms; the revised UX still needs an Android native smoke check. XCTest required coordinate touches for the search input even though typing worked; this does not establish VoiceOver behavior.

Remaining release checks include real Siri/Shortcuts cold/warm invocation, VoiceOver/TalkBack focus, and representative physical-device performance. The app is configured for portrait orientation; simulator rotation is not evidence of landscape support.

`expo install --check` reports newer compatible patch versions across the existing SDK baseline. Android haptics also logged a caught native `NoSuchMethodError` during smoke testing. Align and revalidate those SDK patches in a separate dependency update; haptics are not considered verified. Sharing no longer depends on crypto and was verified with native image previews.

## Patches

- `patch-package` runs automatically on `postinstall`.
- Existing patch: `react-native-render-html+6.3.4.patch` — re-verify and maintain it when upgrading dependencies.

## Upgrading the Expo SDK

- Go one major at a time. Per SDK: `npx expo install expo@^<N>.0.0 --fix`, then manually bump the libs in `expo.install.exclude` (reanimated, worklets, gesture-handler, screens, flash-list) to that SDK's `bundledNativeModules.json` targets.
- Verify each step: `npm run check:ts`, `npm run check:lint`, `npm run check:format`, `npx expo-doctor@latest`, confirm the render-html patch still applies, and `npx expo export --platform ios` for an end-to-end bundle check.
- `@bugsnag/expo` often lags behind new SDKs. Until it publishes a compatible release, `overrides` in package.json force its `expo` peer and its transitive `expo-*` native modules to the app's versions (this avoids duplicate native modules). Remove the overrides once Bugsnag supports the SDK.
