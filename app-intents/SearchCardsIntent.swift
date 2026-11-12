import AppIntents
internal import ExpoAppIntents

/// Opens the card list searching for the given text (matched against title, traits and keywords).
struct SearchCardsIntent: AppIntent {
  static let title: LocalizedStringResource = "Search Cards"
  static let description = IntentDescription("Search Star Wars Unlimited cards by name, trait or keyword.")
  static let openAppWhenRun: Bool = true

  @Parameter(title: "Search", requestValueDialog: "What would you like to search for?")
  var query: String

  static var parameterSummary: some ParameterSummary {
    Summary("Search cards for \(\.$query)")
  }

  @MainActor
  func perform() async throws -> some IntentResult & ProvidesDialog {
    await AppIntentDispatcher.shared.dispatch(
      name: "searchCards",
      params: ["query": .string(query)]
    )

    return .result(dialog: "Searching for \(query).")
  }
}
