use serde::{Deserialize, Serialize};

// #[derive(Debug, Deserialize, Serialize)]
// #[serde(rename_all = "camelCase")]
// pub struct PingRequest {
//   pub value: Option<String>,
// }

// #[derive(Debug, Clone, Default, Deserialize, Serialize)]
// #[serde(rename_all = "camelCase")]
// pub struct PingResponse {
//   pub value: Option<String>,
// }

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AuthDetails {
  pub device_id: String,
  pub access_token: String,
  pub refresh_token: String
}
