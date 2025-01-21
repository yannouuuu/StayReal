import Foundation

struct AuthenticationDetails: Codable {
  let deviceId: String?
  let accessToken: String?
  let refreshToken: String?
}

struct Authentication {
  private let userDefaults = UserDefaults.standard
  private let deviceIdKey = "deviceId"
  private let accessTokenKey = "accessToken"
  private let refreshTokenKey = "refreshToken"

  var details: AuthenticationDetails {
    get {
      AuthenticationDetails(
        deviceId: userDefaults.string(forKey: deviceIdKey),
        accessToken: userDefaults.string(forKey: accessTokenKey),
        refreshToken: userDefaults.string(forKey: refreshTokenKey)
      )
    }
    set {
      userDefaults.set(newValue.deviceId, forKey: deviceIdKey)
      userDefaults.set(newValue.accessToken, forKey: accessTokenKey)
      userDefaults.set(newValue.refreshToken, forKey: refreshTokenKey)
    }
  }

  func clear() {
    userDefaults.removeObject(forKey: deviceIdKey)
    userDefaults.removeObject(forKey: accessTokenKey)
    userDefaults.removeObject(forKey: refreshTokenKey)
  }

  static let shared = Authentication()
}
