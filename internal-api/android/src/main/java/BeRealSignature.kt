package com.vexcited.stayreal.api

import android.util.Base64
import java.util.*
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec
import kotlin.text.digitToInt

object BeRealSignature {
  private const val BEREAL_HMAC_KEY_HEX =
          "3536303337663461663232666236393630663363643031346532656337316233"

  private val berealHmacKey: ByteArray by lazy {
    val result = ByteArray(BEREAL_HMAC_KEY_HEX.length / 2)
    for (i in BEREAL_HMAC_KEY_HEX.indices step 2) {
      result[i / 2] =
              ((BEREAL_HMAC_KEY_HEX[i].digitToInt(16) shl 4) +
                              BEREAL_HMAC_KEY_HEX[i + 1].digitToInt(16))
                      .toByte()
    }

    result
  }

  fun create(deviceId: String): String {
    val berealTimezone = TimeZone.getDefault().id // e.g. "Europe/Paris"

    val timestamp = (System.currentTimeMillis() / 1000).toString()
    val data = "$deviceId$berealTimezone$timestamp"
    val dataBytes = data.toByteArray(Charsets.UTF_8)

    val mac = Mac.getInstance("HmacSHA256")
    mac.init(SecretKeySpec(berealHmacKey, "HmacSHA256"))
    val hash = mac.doFinal(Base64.encode(dataBytes, Base64.DEFAULT))

    val prefix = "1:$timestamp:".toByteArray(Charsets.UTF_8)
    val combined = prefix + hash

    return Base64.encodeToString(combined, Base64.NO_WRAP)
  }
}
