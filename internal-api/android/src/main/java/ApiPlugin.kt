package com.vexcited.stayreal.api

import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.webkit.WebView
import android.Manifest
import android.os.Build
import androidx.core.app.NotificationManagerCompat
import androidx.core.app.ActivityCompat
import app.tauri.PermissionState
import app.tauri.annotation.Permission
import app.tauri.annotation.Command
import app.tauri.annotation.InvokeArg
import app.tauri.annotation.PermissionCallback
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

@InvokeArg
internal class SetRegionArgs {
  lateinit var region: String
}

val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())

const val LOCAL_NOTIFICATIONS = "permissionState"

@TauriPlugin(
  permissions = [
    Permission(strings = [Manifest.permission.POST_NOTIFICATIONS], alias = "permissionState")
  ]
)
class ApiPlugin(private val activity: Activity): Plugin(activity) {
  private val requests = Requests(activity)
  private val cache = Cache(activity)

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

  @Command
  override fun checkPermissions(invoke: Invoke) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
      val permissionsResultJSON = JSObject()
      permissionsResultJSON.put("permissionState", getPermissionState())
      invoke.resolve(permissionsResultJSON)
    } else {
      super.checkPermissions(invoke)
    }
  }

  @Command
  override fun requestPermissions(invoke: Invoke) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
      permissionState(invoke)
    } else {
      if (getPermissionState(LOCAL_NOTIFICATIONS) !== PermissionState.GRANTED) {
        requestPermissionForAlias(LOCAL_NOTIFICATIONS, invoke, "permissionsCallback")
      }
    }
  }

  @Command
  fun permissionState(invoke: Invoke) {
    val permissionsResultJSON = JSObject()
    permissionsResultJSON.put("permissionState", getPermissionState())
    invoke.resolve(permissionsResultJSON)
  }

  @PermissionCallback
  private fun permissionsCallback(invoke: Invoke) {
    val permissionsResultJSON = JSObject()
    permissionsResultJSON.put("permissionState", getPermissionState())
    invoke.resolve(permissionsResultJSON)
  }

  private fun getPermissionState(): String {
    val notificationManager = NotificationManagerCompat.from(activity)

    return if (notificationManager.areNotificationsEnabled()) {
      "granted"
    } else {
      "denied"
    }
  }

  @Command
  fun startNotificationService(invoke: Invoke) {
    if (
      ActivityCompat.checkSelfPermission(
        activity,
        Manifest.permission.POST_NOTIFICATIONS
      ) != PackageManager.PERMISSION_GRANTED
    ) {
      invoke.reject("notifications permission denied")
      return
    }

    val intent = Intent(activity, NotificationService::class.java)

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      activity.startForegroundService(intent)
    }
    else {
      activity.startService(intent)
    }

    invoke.resolve()
  }
}
