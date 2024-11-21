package com.vexcited.stayreal.api

import android.app.Activity
import android.webkit.WebView
import android.Manifest
import androidx.work.Constraints
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.NetworkType
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import app.tauri.annotation.Permission
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
import java.util.concurrent.TimeUnit

@InvokeArg
internal class SetAuthDetailsArgs {
  lateinit var deviceId: String
  lateinit var accessToken: String
  lateinit var refreshToken: String
}

@InvokeArg
internal class SetRegionArgs {
  lateinit var region: String
}

val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())

@TauriPlugin(
  permissions = [
    Permission(strings = [Manifest.permission.POST_NOTIFICATIONS], alias = "postNotification")
  ]
)
class ApiPlugin(private val activity: Activity): Plugin(activity) {
  private val requests = Requests(activity)
  private val cache = Cache(activity)

  override fun load(webView: WebView) {
    val constraints = Constraints.Builder()
      // The work will only run when the device is connected to the Internet.
      .setRequiredNetworkType(NetworkType.CONNECTED)
      .build()

    val periodicWork = PeriodicWorkRequestBuilder<NotificationWorker>(1, TimeUnit.MINUTES)
      .setConstraints(constraints)
      .build()

    val workManager = WorkManager.getInstance(activity)

    // Ensure no duplicate workers are created.
    workManager.enqueueUniquePeriodicWork(
      "NotificationWorker",
      ExistingPeriodicWorkPolicy.KEEP,
      periodicWork
    )
  }

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

  @Command
  fun setRegion (invoke: Invoke) {
    val region = invoke.parseArgs(SetRegionArgs::class.java).region
    requests.preferences.setRegion(region)
    invoke.resolve()
  }

  @Command
  fun fetchLastMoment (invoke: Invoke) {
    scope.launch {
      try {
        val moment = requests.fetchLastMoment()
        cache.setLastMomentId(moment.id)

        val ret = JSObject()
        ret.put("id", moment.id)
        ret.put("region", moment.region)
        ret.put("startDate", moment.startDate)
        ret.put("endDate", moment.endDate)

        with(Dispatchers.Main) {
          invoke.resolve(ret)
        }
      }
      catch (error: Exception) {
        with(Dispatchers.Main) {
          invoke.reject(error.message)
        }
      }
    }
  }
}
