package com.vexcited.stayreal.api

import android.app.Activity
import app.tauri.annotation.Command
import app.tauri.annotation.InvokeArg
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin
import app.tauri.plugin.Invoke

@InvokeArg
class SetAuthDetailsArgs {
  lateinit var deviceId: String
  lateinit var accessToken: String
  lateinit var refreshToken: String
}

@TauriPlugin
class ApiPlugin(private val activity: Activity): Plugin(activity) {
  // private val implementation = Example()
  private val authentication = Authentication(activity)
  private val requests = Requests(activity)

  @Command
  fun setAuthDetails (invoke: Invoke) {
    val args = invoke.parseArgs(SetAuthDetailsArgs::class.java)

    authentication.set(
      AuthenticationDetails(
        deviceId = args.deviceId,
        accessToken = args.accessToken,
        refreshToken = args.refreshToken
      )
    )

    invoke.resolve()
  }

  @Command
  fun getAuthDetails (invoke: Invoke) {
    val ret = JSObject()

    val details = authentication.get()
    ret.put("deviceId", details.deviceId)
    ret.put("accessToken", details.accessToken)
    ret.put("refreshToken", details.refreshToken)

    invoke.resolve(ret)
  }

  @Command
  fun clearAuthDetails (invoke: Invoke) {
    authentication.clear()
    invoke.resolve()
  }

  @Command
  fun refreshToken (invoke: Invoke) {
    var details = authentication.get()
    details = requests.refreshToken(details)

    // Save the new details directly to the shared preferences.
    authentication.set(details)

    // We don't return anything, if we need the
    // new details we can call `getAuthDetails()` client-side.
    invoke.resolve()
  }
}
