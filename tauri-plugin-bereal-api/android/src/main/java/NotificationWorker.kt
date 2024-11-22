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
import androidx.work.Constraints
import androidx.work.WorkerParameters
import androidx.work.CoroutineWorker
import androidx.work.ExistingWorkPolicy
import androidx.work.ForegroundInfo
import androidx.work.NetworkType
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import java.io.IOException
import kotlin.random.Random
import kotlinx.coroutines.withContext
import kotlinx.coroutines.Dispatchers
import java.util.concurrent.TimeUnit

class NotificationWorker(appContext: Context, workerParams: WorkerParameters) : CoroutineWorker(appContext, workerParams) {
  private val requests = Requests(applicationContext)
  private val cache = Cache(applicationContext)

  override suspend fun doWork(): Result {
    if (ActivityCompat.checkSelfPermission(applicationContext, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
      enqueueNextWork(10)
      return Result.success()
    }

    val deviceId = requests.authentication.get().deviceId
    if (deviceId == null) {
      enqueueNextWork(10)
      return Result.success()
    }

    return try {
      val moment = requests.fetchLastMoment()
      val lastMomentId = cache.getLastMomentId()

      if (lastMomentId != moment.id && lastMomentId != null) {
        cache.setLastMomentId(moment.id)
        createNotification(
          "moments",
          "BeReal Moments",
          "New moment just dropped",
          "Make sure to post to not lose your streak !",
          NotificationCompat.PRIORITY_HIGH
        )
      }

      enqueueNextWork(4)
      Result.success()
    }
    catch (error: IOException) {
      enqueueNextWork(8)
      Result.retry()
    }
  }

  private fun enqueueNextWork(delaySeconds: Long) {
    Log.d("NotificationWorker", "enqueueNextWork in $delaySeconds seconds")

    val constraints = Constraints.Builder()
      .setRequiredNetworkType(NetworkType.CONNECTED)
      .build()

    val nextRequest = OneTimeWorkRequestBuilder<NotificationWorker>()
      .setInitialDelay(delaySeconds, TimeUnit.SECONDS)
      .setConstraints(constraints)
      .build()

    WorkManager.getInstance(applicationContext).enqueueUniqueWork(
      "NotificationWorker",
      ExistingWorkPolicy.REPLACE,
      nextRequest
    )
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
