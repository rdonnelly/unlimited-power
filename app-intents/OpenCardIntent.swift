import AppIntents
internal import ExpoAppIntents

/// Opens a single card. It has no App Shortcut phrase: it reaches the user through the donations
/// that `CardDetailScreen` makes as cards are viewed (see OpenCardIntent+Donation.swift).
struct OpenCardIntent: AppIntent {
  static let title: LocalizedStringResource = "Open Card"
  static let description = IntentDescription("Open a Star Wars Unlimited card.")
  static let openAppWhenRun: Bool = true

  @Parameter(title: "Card ID")
  var id: Int

  @Parameter(title: "Card")
  var cardTitle: String

  static var parameterSummary: some ParameterSummary {
    Summary("Open \(\.$cardTitle)") {
      \.$id
    }
  }

  @MainActor
  func perform() async throws -> some IntentResult {
    await AppIntentDispatcher.shared.dispatch(
      name: "openCard",
      params: [
        "id": .int(id),
        "title": .string(cardTitle),
      ]
    )

    return .result()
  }
}
