import Foundation

struct Cache {
  private let lastMomentIdKey = "lastMomentId"

  var lastMomentId: String? {
    get {
      return UserDefaults.standard.string(forKey: lastMomentIdKey)
    }
    set {
      UserDefaults.standard.set(newValue, forKey: lastMomentIdKey)
    }
  }

  static let shared = Cache()
}
