package com.vexcited.stayreal.api

import android.Manifest
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.util.Log
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.work.WorkerParameters
import androidx.work.CoroutineWorker
import androidx.work.ForegroundInfo
import java.io.IOException
import kotlin.random.Random
import kotlinx.coroutines.withContext
import kotlinx.coroutines.Dispatchers

class NotificationWorker(appContext: Context, workerParams: WorkerParameters) : CoroutineWorker(appContext, workerParams) {
  private val requests = Requests(applicationContext)
  private val cache = Cache(applicationContext)

  override suspend fun doWork(): Result {
    if (ActivityCompat.checkSelfPermission(applicationContext, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
      return Result.success()
    }

    return try {
      if (requests.authentication.get().deviceId != null) {
        val moment = requests.fetchLastMoment()
        val lastMomentId = cache.getLastMomentId()

        if (moment.id != lastMomentId && lastMomentId != null) {
          cache.setLastMomentId(moment.id)
          createNotification(
            "moments",
            "StayReal Moments",
            "New BeReal moment available",
            "You have 2 minutes to post something !",
            NotificationCompat.PRIORITY_HIGH
          )
        }
      }

      Result.success()
    }
    catch (error: IOException) {
      Result.retry()
    }
  }

  fun createNotificationChannel(channelId: String, channelName: String) {
    val notificationManager = applicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

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
  }

  fun createNotification(channelId: String, channelName: String, title: String, message: String, priority: Int = NotificationCompat.PRIORITY_DEFAULT) {
    createNotificationChannel(channelId, channelName)

    val notification = NotificationCompat.Builder(applicationContext, channelId)
      .setSmallIcon(android.R.drawable.ic_dialog_info)
      .setContentTitle(title)
      .setContentText(message)
      .setPriority(priority)
      .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
      .build()

    val notificationId = Random.nextInt(0, 1000)
    val notificationManager = applicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    notificationManager.notify(notificationId, notification)
  }
}
