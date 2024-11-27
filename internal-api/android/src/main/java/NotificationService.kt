package com.vexcited.stayreal.api

import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat
import kotlin.random.Random
import android.app.Service
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.IBinder
import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.core.app.ServiceCompat
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

/**
 * This service is responsible for checking if a new moment has been posted.
 * If so, it will show a notification to the user.
 * 
 * Other notifications are ran in a periodic worker, see the
 * [`NotificationWorker`] class for more information.
 */
class NotificationService : Service() {
  private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())
  private val requests = Requests(this)
  private val cache = Cache(this)
  private val handler = Handler(Looper.getMainLooper())
  private val interval: Long = 5000 // 5 seconds

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    startForegroundService()
    handler.post(runnableCode)
    return START_STICKY
  }

  private fun startForegroundService() {
    val channelId = "NotificationServiceChannel"
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val channel = NotificationChannel(
        channelId,
        "BeReal Moments (Service)",
        NotificationManager.IMPORTANCE_DEFAULT
      )

      val manager = getSystemService(NotificationManager::class.java)
      manager.createNotificationChannel(channel)
    }

    try {
      val notification = NotificationCompat.Builder(this, channelId)
        .setContentTitle("Listening to BeReal events")
        .setContentText("Read the FAQ to learn more about this.")
        .setSmallIcon(R.drawable.ic_stayreal)
        .setOngoing(true)
        .build()

      ServiceCompat.startForeground(
        this,
        100,
        notification,
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
          ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC
        } else {
          0
        }
      )
    }
    catch (e: Exception) {
      Log.d("NotificationService", "Failed to start foreground service, see the stack trace below.")
      e.printStackTrace()
    }
  }

  private val runnableCode = object : Runnable {
    override fun run() {
      scope.launch {
        checkMoment()
      }

      handler.postDelayed(this, interval)
    }
  }

  private suspend fun checkMoment() {
    // If we're not authenticated, it's kinda useles...
    val deviceId = requests.authentication.get().deviceId
    if (deviceId == null) return

    try {
      val moment = requests.fetchLastMoment()
      val lastMomentId = cache.getLastMomentId()
      Log.d("NotificationService", "Last moment ID: $lastMomentId")

      if (lastMomentId != moment.id && lastMomentId != null) {
        cache.setLastMomentId(moment.id)
        showMomentNotification()
      }
    }
    catch (e: Exception) {
      // Ignore, we'll try again later.
      Log.d("NotificationService", "Failed to fetch last moment and/or show notification...")
    }
  }

  fun showMomentNotification () {
    val notificationManager = applicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    val channelId = "moments"
    val channelName = "BeReal Moments"

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val notificationChannel = NotificationChannel(
        channelId,
        channelName,
        NotificationManager.IMPORTANCE_HIGH,
      ).apply {
        description = "Notifications for $channelName"
      }

      notificationManager.createNotificationChannel(
        notificationChannel
      )
    }

    val notification = NotificationCompat.Builder(applicationContext, channelId)
      .setSmallIcon(R.drawable.ic_stayreal)
      .setContentTitle("New moment just dropped")
      .setContentText("Make sure to post to not lose your streak !")
      .setPriority(NotificationCompat.PRIORITY_HIGH)
      .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
      .build()

    val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    manager.notify(10, notification)
  }

  override fun onBind(intent: Intent?): IBinder? {
    return null
  }

  override fun onDestroy() {
    super.onDestroy()
    handler.removeCallbacks(runnableCode)
  }
}
