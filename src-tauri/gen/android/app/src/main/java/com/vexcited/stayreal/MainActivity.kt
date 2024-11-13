package com.vexcited.stayreal

import android.content.Context
import android.os.Bundle
import androidx.work.Constraints
import androidx.work.NetworkType
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import java.util.concurrent.TimeUnit

class MainActivity : TauriActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    schedulePeriodicHttpRequest(this)
  }
}

fun schedulePeriodicHttpRequest(context: Context) {
  val constraints = Constraints.Builder()
    .setRequiredNetworkType(NetworkType.UNMETERED) // only Wi-Fi
    .build()

  val periodicHttpRequestWork = PeriodicWorkRequestBuilder<HttpRequestWorker>(15, TimeUnit.MINUTES)
    .setConstraints(constraints)
    .build()

  WorkManager.getInstance(context).enqueue(periodicHttpRequestWork)
}
