package com.vexcited.stayreal

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import androidx.core.app.NotificationCompat
import androidx.work.Worker
import androidx.work.WorkerParameters
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import java.io.IOException
import kotlin.random.Random

class HttpRequestWorker(appContext: Context, workerParams: WorkerParameters) : Worker(appContext, workerParams) {

  companion object {
    const val CHANNEL_ID = "http_request_channel"
  }

  override fun doWork(): Result {
    // Initialize OkHttpClient
    val client = OkHttpClient()

    // Create HTTP request
    val request = Request.Builder()
      .url("https://jsonplaceholder.typicode.com/posts/1")  // Sample URL
      .build()

    return try {
      // Execute the request
      val response: Response = client.newCall(request).execute()
      if (response.isSuccessful) {
        val currentTime = System.currentTimeMillis()
        
        // If successful, show a notification
        showNotification("Request Success", "HTTP request was successful at $currentTime !")
        Result.success() // Indicate successful completion
      } else {
        Result.retry() // Retry in case of failure
      }
    } catch (e: IOException) {
      Result.retry() // Retry in case of network or other exceptions
    }
  }

  private fun showNotification(title: String, message: String) {
    // Get NotificationManager
    val notificationManager = applicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    // Create a Notification Channel (required for Android 8.0 and above)
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
      val channel = NotificationChannel(
        CHANNEL_ID,
        "HTTP Request Channel",
        NotificationManager.IMPORTANCE_DEFAULT
      )
      notificationManager.createNotificationChannel(channel)
    }

    // Create the notification
    val notification = NotificationCompat.Builder(applicationContext, CHANNEL_ID)
      .setSmallIcon(android.R.drawable.ic_dialog_info) // Icon to display in the notification
      .setContentTitle(title)
      .setContentText(message)
      .setPriority(NotificationCompat.PRIORITY_DEFAULT)
      .build()

    // Show the notification
    val uniqueNotificationId = Random.nextInt()
    notificationManager.notify(uniqueNotificationId, notification)
  }
}
