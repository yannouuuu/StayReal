import CryptoKit
import Foundation

struct BeRealSignature {
  private static let BEREAL_HMAC_KEY_HEX =
    "3536303337663461663232666236393630663363643031346532656337316233"

  private static var berealHmacKey: [UInt8] {
    var result = [UInt8]()

    stride(from: 0, to: BEREAL_HMAC_KEY_HEX.count, by: 2).forEach { i in
      let start = BEREAL_HMAC_KEY_HEX.index(BEREAL_HMAC_KEY_HEX.startIndex, offsetBy: i)
      let end = BEREAL_HMAC_KEY_HEX.index(start, offsetBy: 2)
      let byte = UInt8(BEREAL_HMAC_KEY_HEX[start..<end], radix: 16) ?? 0
      result.append(byte)
    }

    return result
  }

  static func create(deviceId: String) -> String {
    let berealTimezone = TimeZone.current.identifier
    let timestamp = String(Int(Date().timeIntervalSince1970))
    let data = "\(deviceId)\(berealTimezone)\(timestamp)"

    let dataBytes = data.data(using: .utf8)!
    let base64Data = dataBytes.base64EncodedData()

    let key = SymmetricKey(data: Data(berealHmacKey))
    let signature = HMAC<SHA256>.authenticationCode(
      for: base64Data,
      using: key
    )

    let prefix = "1:\(timestamp):".data(using: .utf8)!

    var combined = Data()
    combined.append(prefix)
    combined.append(Data(signature))

    return combined.base64EncodedString()
      .replacingOccurrences(of: "\n", with: "")
  }
}
