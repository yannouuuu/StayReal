package com.vexcited.stayreal.api

import android.content.Context
import android.content.SharedPreferences

data class AuthenticationDetails (
  val deviceId: String?,
  val accessToken: String?,
  val refreshToken: String?
)

class Authentication (private val context: Context) {
  private val preferencesName = "AuthenticationPreferences"

  fun set (details: AuthenticationDetails) {
    val sharedPreferences: SharedPreferences = context.getSharedPreferences(
      preferencesName,
      Context.MODE_PRIVATE
    )

    with(sharedPreferences.edit()) {
      putString("deviceId", details.deviceId)
      putString("accessToken", details.accessToken)
      putString("refreshToken", details.refreshToken)
      apply()
    }
  }

  fun get (): AuthenticationDetails {
    val sharedPreferences: SharedPreferences = context.getSharedPreferences(
      preferencesName,
      Context.MODE_PRIVATE
    )

    return AuthenticationDetails(
      deviceId = sharedPreferences.getString("deviceId", null),
      accessToken = sharedPreferences.getString("accessToken", null),
      refreshToken = sharedPreferences.getString("refreshToken", null)
    )
  }

  fun clear () {
    val sharedPreferences: SharedPreferences = context.getSharedPreferences(
      preferencesName,
      Context.MODE_PRIVATE
    )

    with(sharedPreferences.edit()) {
      remove("deviceId")
      remove("accessToken")
      remove("refreshToken")
      apply()
    }
  }
}