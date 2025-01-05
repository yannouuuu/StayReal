package com.vexcited.stayreal.api

import android.content.Context

class Cache(private val context: Context) {
  private val preferencesName = "Cache"

  fun setLastMomentId(id: String) {
    val sharedPreferences = context.getSharedPreferences(preferencesName, Context.MODE_PRIVATE)

    with(sharedPreferences.edit()) {
      putString("lastMomentId", id)
      apply()
    }
  }

  fun getLastMomentId(): String? {
    val sharedPreferences = context.getSharedPreferences(preferencesName, Context.MODE_PRIVATE)

    return sharedPreferences.getString("lastMomentId", null)
  }
}
