use serde::de::DeserializeOwned;
use tauri::{plugin::PluginApi, AppHandle, Runtime};

use crate::models::*;

pub fn init<R: Runtime, C: DeserializeOwned>(
  app: &AppHandle<R>,
  _api: PluginApi<R, C>,
) -> crate::Result<BerealApi<R>> {
  Ok(BerealApi(app.clone()))
}

/// Access to the mobile-bereal-api APIs.
pub struct BerealApi<R: Runtime>(AppHandle<R>);

impl<R: Runtime> BerealApi<R> {
  pub fn ping(&self, payload: PingRequest) -> crate::Result<PingResponse> {
    Ok(PingResponse {
      value: payload.value,
    })
  }
}
