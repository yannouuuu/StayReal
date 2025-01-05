use serde::de::DeserializeOwned;
use serde::Deserialize;
use tauri::{
  plugin::{PermissionState, PluginApi, PluginHandle},
  AppHandle, Runtime,
};

use crate::models::*;

#[cfg(target_os = "ios")]
tauri::ios_plugin_binding!(init_plugin_bereal_api);

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct PermissionResponse {
  permission_state: PermissionState,
}

pub fn init<R: Runtime, C: DeserializeOwned>(
  _app: &AppHandle<R>,
  api: PluginApi<R, C>,
) -> crate::Result<BerealApi<R>> {
  #[cfg(target_os = "android")]
  let handle = api.register_android_plugin("com.vexcited.stayreal.api", "ApiPlugin")?;

  #[cfg(target_os = "ios")]
  let handle = api.register_ios_plugin(init_plugin_bereal_api)?;

  Ok(BerealApi(handle))
}

pub struct BerealApi<R: Runtime>(PluginHandle<R>);

impl<R: Runtime> BerealApi<R> {
  pub fn set_auth_details(&self, payload: AuthDetails) -> crate::Result<()> {
    self
      .0
      .run_mobile_plugin("setAuthDetails", payload)
      .map_err(Into::into)
  }

  pub fn get_auth_details(&self) -> crate::Result<AuthDetails> {
    self
      .0
      .run_mobile_plugin("getAuthDetails", ())
      .map_err(Into::into)
  }

  pub fn clear_auth_details(&self) -> crate::Result<()> {
    self
      .0
      .run_mobile_plugin("clearAuthDetails", ())
      .map_err(Into::into)
  }

  pub async fn refresh_token(&self) -> crate::Result<()> {
    self
      .0
      .run_mobile_plugin("refreshToken", ())
      .map_err(Into::into)
  }

  pub fn set_region(&self, payload: SetRegionArgs) -> crate::Result<()> {
    self
      .0
      .run_mobile_plugin("setRegion", payload)
      .map_err(Into::into)
  }

  pub async fn fetch_last_moment(&self) -> crate::Result<Moment> {
    self
      .0
      .run_mobile_plugin("fetchLastMoment", ())
      .map_err(Into::into)
  }

  pub fn request_permission(&self) -> crate::Result<PermissionState> {
    self
      .0
      .run_mobile_plugin::<PermissionResponse>("requestPermissions", ())
      .map(|r| r.permission_state)
      .map_err(Into::into)
  }

  pub fn permission_state(&self) -> crate::Result<PermissionState> {
    self
      .0
      .run_mobile_plugin::<PermissionResponse>("checkPermissions", ())
      .map(|r| r.permission_state)
      .map_err(Into::into)
  }

  pub fn start_notification_service(&self) -> crate::Result<()> {
    self
      .0
      .run_mobile_plugin("startNotificationService", ())
      .map_err(Into::into)
  }
}
