package com.vexcited.stayreal.api

import android.content.Context
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.Headers
import okhttp3.MediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import java.util.Locale
import java.util.TimeZone
import org.json.JSONObject
import java.io.IOException

class Requests (private val context: Context) {
  val authentication = Authentication(context)

  private val appAndroidBundleId = "com.bereal.ft"
  private val appAndroidVersion = "3.10.1"
  private val appAndroidBuild = "2348592"
  private val clientSecretKey = "F5A71DA-32C7-425C-A3E3-375B4DACA406"

  private fun defaultHeaders (deviceId: String): Headers {
    val androidVersion = android.os.Build.VERSION.RELEASE

    return Headers.Builder()
      .add("bereal-platform", "android")
      .add("bereal-os-version", androidVersion)
      .add("bereal-app-version", appAndroidVersion)
      .add("bereal-app-version-code", appAndroidBuild)
      .add("bereal-device-language", Locale.getDefault().language) // e.g. "en"
      .add("bereal-app-language", Locale.getDefault().toLanguageTag()) // e.g. "en-US"
      .add("bereal-device-id", deviceId)
      .add("bereal-timezone", TimeZone.getDefault().id) // e.g. "Europe/Paris"
      .add("bereal-signature", BeRealSignature.create(deviceId))
      .add("user-agent", "BeReal/$appAndroidVersion ($appAndroidBundleId; build:$appAndroidBuild; Android $androidVersion) 4.12.0/OkHttp")
      .build()
  }

  suspend fun refreshToken () {
    val details = authentication.get()

    val json = JSONObject().apply {
      put("client_id", "android")
      put("grant_type", "refresh_token")
      put("client_secret", clientSecretKey)
      put("refresh_token", details.refreshToken)
    }

    val client = OkHttpClient()

    val request = Request.Builder()
      .url("https://auth.bereal.com/token")
      .headers(defaultHeaders(details.deviceId!!))
      .post(json.toString().toRequestBody("application/json".toMediaType()))
      .build()

    val response = withContext(Dispatchers.IO) {
      client.newCall(request).execute()
    }

    if (response.code != 201) {
      throw IOException("refresh token failed with status code ${response.code}")
    }

    val body = response.body?.string()
      ?: throw IOException("empty response body")

    val jsonBody = JSONObject(body)

    authentication.set(
      AuthenticationDetails(
        deviceId = details.deviceId,
        accessToken = jsonBody.getString("access_token"),
        refreshToken = jsonBody.getString("refresh_token")
      )
    )
  }
}