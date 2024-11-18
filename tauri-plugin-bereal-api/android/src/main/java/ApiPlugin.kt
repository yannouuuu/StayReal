package com.vexcited.stayreal.api

import android.app.Activity
import app.tauri.annotation.Command
import app.tauri.annotation.InvokeArg
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin
import app.tauri.plugin.Invoke
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

@InvokeArg
internal class SetAuthDetailsArgs {
  lateinit var deviceId: String
  lateinit var accessToken: String
  lateinit var refreshToken: String
}

val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())

@TauriPlugin
class ApiPlugin(private val activity: Activity): Plugin(activity) {
  private val requests = Requests(activity)

  @Command
  fun setAuthDetails (invoke: Invoke) {
    val args = invoke.parseArgs(SetAuthDetailsArgs::class.java)

    requests.authentication.set(
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

    val details = requests.authentication.get()
    ret.put("deviceId", details.deviceId)
    ret.put("accessToken", details.accessToken)
    ret.put("refreshToken", details.refreshToken)

    invoke.resolve(ret)
  }

  @Command
  fun clearAuthDetails (invoke: Invoke) {
    requests.authentication.clear()
    invoke.resolve()
  }

  @Command
  fun refreshToken (invoke: Invoke) {
    scope.launch {
      try {
        requests.refreshToken()

        withContext(Dispatchers.Main) {
          invoke.resolve()
        }
      }
      catch (e: Exception) {
        withContext(Dispatchers.Main) {
          invoke.reject(e.message)
        }
      }
    }
  }
}
