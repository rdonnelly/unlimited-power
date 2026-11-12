import AppIntents
internal import ExpoAppIntents
internal import ExpoModulesCore

/// Lets JavaScript donate a viewed card with `donateIntentAsync('openCard', { id, title })`, so the
/// system can suggest opening it again in Siri Suggestions, Spotlight and on the Lock Screen.
extension OpenCardIntent: DonatableAppIntent {
  struct DonationParams: Record {
    // A `@Field` needs an initial value, because a record is created with `init()` and then filled
    // in. `.required` rejects params without the field, so these defaults are never used.
    @Field(.required) var id: Int = 0
    @Field(.required) var title: String = ""
  }

  init(donationParams: DonationParams) {
    self.init()
    self.id = donationParams.id
    self.cardTitle = donationParams.title
  }
}
