package com.vexcited.stayreal.api

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import androidx.core.app.NotificationCompat
import androidx.work.WorkerParameters
import androidx.work.CoroutineWorker
import java.io.IOException
import kotlin.random.Random
import kotlinx.coroutines.withContext
import kotlinx.coroutines.Dispatchers

class NotificationWorker(appContext: Context, workerParams: WorkerParameters) : CoroutineWorker(appContext, workerParams) {
  private val requests = Requests(appContext)
  private val cache = Cache(appContext)
  
  override suspend fun doWork(): Result {
    return withContext(Dispatchers.IO) {
      try {
        // If `deviceId` is null, then we're not authenticated so we
        // don't need to check for new moments.
        if (requests.authentication.get().deviceId != null) {
          val moment = requests.fetchLastMoment()
          val lastMomentId = cache.getLastMomentId()

          if (moment.id != lastMomentId) {
            cache.setLastMomentId(moment.id)
            showNotification("new_bereal_moment", "New BeReal moment available", "You have 2 minutes to post something !", NotificationCompat.PRIORITY_HIGH)
          }
          else {
            showNotification("no_new_bereal_moment", "No new BeReal moment available", "Check back later for new moments.")
          }
        }
        Result.success()
      }
      catch (error: IOException) {
        // Retry in case of network or other exceptions
        Result.retry()
      }
    }
  }

  private fun showNotification(channelId: String, title: String, message: String, priority: Int = NotificationCompat.PRIORITY_DEFAULT) {
    val notificationManager = applicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    // NotificationChannel is required for Android 8.0 and above
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
      val channel = NotificationChannel(
        channelId,
        "BeReal Moments",
        NotificationManager.IMPORTANCE_HIGH
      )

      notificationManager.createNotificationChannel(channel)
    }

    val notification = NotificationCompat.Builder(applicationContext, channelId)
      .setSmallIcon(android.R.drawable.ic_dialog_alert)
      .setContentTitle(title)
      .setContentText(message)
      .setPriority(priority)
      .build()

    val uniqueNotificationId = Random.nextInt()
    notificationManager.notify(uniqueNotificationId, notification)
  }
}
