import AppIntents
internal import ExpoAppIntents
import Foundation

private func normalizeExpansionText(_ value: String) -> String {
  return
    value
    .folding(options: [.caseInsensitive, .diacriticInsensitive], locale: .current)
    .trimmingCharacters(in: .whitespacesAndNewlines)
}

/// A card expansion (for example "Homeworlds"). The id is the expansion code (for example "HMW"),
/// and the catalog is published from JavaScript in `useAppIntents`.
struct ExpansionEntity: AppEntity {
  static let typeDisplayRepresentation: TypeDisplayRepresentation = "Expansion"
  static let defaultQuery = ExpansionQuery()

  var id: String
  @Property(title: "Name")
  var name: String
  var synonyms: [String]

  var displayRepresentation: DisplayRepresentation {
    if #available(iOS 17.0, *) {
      return DisplayRepresentation(
        title: "\(name)",
        subtitle: "\(id)",
        synonyms: synonyms.map { LocalizedStringResource(stringLiteral: $0) }
      )
    }
    return DisplayRepresentation(title: "\(name)", subtitle: "\(id)")
  }

  init(record: AppIntentEntityRecord) {
    self.id = record.id
    self.synonyms = record.synonyms
    self.name = record.title
  }

  private var searchableTerms: [String] {
    return [id, name] + synonyms
  }

  func matches(_ searchText: String) -> Bool {
    let normalizedSearch = normalizeExpansionText(searchText)
    guard !normalizedSearch.isEmpty else {
      return false
    }

    return searchableTerms.map(normalizeExpansionText).contains { term in
      normalizedSearch == term || normalizedSearch.contains(term) || term.contains(normalizedSearch)
    }
  }
}
