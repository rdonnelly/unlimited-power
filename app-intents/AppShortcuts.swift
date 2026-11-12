import AppIntents

/// All App Shortcuts for this app. Phrases are compiled into the app and cannot be created
/// at runtime. Required parameters that are not in the launch phrase are collected by Siri
/// as follow-up questions.
///
/// System rules:
/// - Every phrase must include \(.applicationName) or the phrase is dropped at build time.
/// - At most 10 App Shortcuts per app. Apple recommends 2-5.
/// - A phrase can interpolate at most one parameter, and only an entity or enum (not free text).
struct AppShortcuts: AppShortcutsProvider {
  static var appShortcuts: [AppShortcut] {
    AppShortcut(
      intent: SearchCardsIntent(),
      phrases: [
        "Search cards in \(.applicationName)",
        "Search \(.applicationName)",
        "Find a card in \(.applicationName)",
      ],
      shortTitle: "Search Cards",
      systemImageName: "magnifyingglass"
    )
    AppShortcut(
      intent: ShowExpansionIntent(),
      phrases: [
        "Show \(\.$expansion) cards in \(.applicationName)",
        "Show \(\.$expansion) in \(.applicationName)",
        "Filter \(.applicationName) by \(\.$expansion)",
        "Show an expansion in \(.applicationName)",
      ],
      shortTitle: "Show Expansion",
      systemImageName: "square.stack.3d.up"
    )
  }
}
