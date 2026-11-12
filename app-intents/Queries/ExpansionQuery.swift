import AppIntents
internal import ExpoAppIntents

/// Resolves ExpansionEntity values from the "expansion" catalog that `useAppIntents` publishes on
/// launch. The catalog is stored natively and survives restarts, so it is empty only until the app
/// has been opened once.
struct ExpansionQuery: EntityStringQuery {
  func entities(for identifiers: [String]) async throws -> [ExpansionEntity] {
    return try await AppIntentEntityStore.shared.entities(ofKind: "expansion", matching: identifiers)
      .map(ExpansionEntity.init(record:))
  }

  func suggestedEntities() async throws -> [ExpansionEntity] {
    return try await AppIntentEntityStore.shared.entities(ofKind: "expansion")
      .map(ExpansionEntity.init(record:))
  }

  func entities(matching string: String) async throws -> [ExpansionEntity] {
    return try await suggestedEntities().filter { $0.matches(string) }
  }
}
