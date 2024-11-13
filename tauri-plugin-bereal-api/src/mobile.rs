use serde::de::DeserializeOwned;
use tauri::{
  plugin::{PluginApi, PluginHandle},
  AppHandle, Runtime,
};

use crate::models::*;

#[cfg(target_os = "ios")]
tauri::ios_plugin_binding!(init_plugin_bereal_api);

// initializes the Kotlin or Swift plugin classes
pub fn init<R: Runtime, C: DeserializeOwned>(
  _app: &AppHandle<R>,
  api: PluginApi<R, C>,
) -> crate::Result<BerealApi<R>> {
  #[cfg(target_os = "android")]
  let handle = api.register_android_plugin("com.vexcited.stayreal.bereal.api", "BeRealApiPlugin")?;
  
  #[cfg(target_os = "ios")]
  let handle = api.register_ios_plugin(init_plugin_bereal_api)?;
  
  Ok(BerealApi(handle))
}

/// Access to the bereal-api APIs.
pub struct BerealApi<R: Runtime>(PluginHandle<R>);

impl<R: Runtime> BerealApi<R> {
  pub fn ping(&self, payload: PingRequest) -> crate::Result<PingResponse> {
    self
      .0
      .run_mobile_plugin("ping", payload)
      .map_err(Into::into)
  }
}
