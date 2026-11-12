import AppIntents
internal import ExpoAppIntents

/// Opens the card list filtered to a single expansion.
struct ShowExpansionIntent: AppIntent {
  static let title: LocalizedStringResource = "Show Expansion"
  static let description = IntentDescription("Show the cards from one Star Wars Unlimited expansion.")
  static let openAppWhenRun: Bool = true

  @Parameter(title: "Expansion", requestValueDialog: "Which expansion?")
  var expansion: ExpansionEntity

  static var parameterSummary: some ParameterSummary {
    Summary("Show \(\.$expansion) cards")
  }

  @MainActor
  func perform() async throws -> some IntentResult & ProvidesDialog {
    await AppIntentDispatcher.shared.dispatch(
      name: "showExpansion",
      params: ["expansion": .string(expansion.id)]
    )

    return .result(dialog: "Showing \(expansion.name) cards.")
  }
}
