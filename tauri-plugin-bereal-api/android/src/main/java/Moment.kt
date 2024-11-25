package com.vexcited.stayreal.api

data class Moment (
  val id: String,
  // ex: "2024-11-20T16:50:27.930Z"
  val startDate: String,
  // ex: "2024-11-20T16:52:27.930Z"
  val endDate: String,
  val region: String
)
