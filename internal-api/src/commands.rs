use crate::{models::*, InternalApi, InternalApiExtension};
use tauri::{command, plugin::PermissionState, AppHandle, Runtime, State};

#[command]
pub(crate) async fn set_auth_details<R: Runtime>(
  app: AppHandle<R>,
  payload: AuthDetails,
) -> crate::Result<()> {
  app.api().set_auth_details(payload)
}

#[command]
pub(crate) async fn get_auth_details<R: Runtime>(app: AppHandle<R>) -> crate::Result<AuthDetails> {
  app.api().get_auth_details()
}

#[command]
pub(crate) async fn clear_auth_details<R: Runtime>(app: AppHandle<R>) -> crate::Result<()> {
  app.api().clear_auth_details()
}

#[command]
pub(crate) async fn refresh_token<R: Runtime>(app: AppHandle<R>) -> crate::Result<()> {
  app.api().refresh_token().await
}

#[command]
pub(crate) async fn set_region<R: Runtime>(
  app: AppHandle<R>,
  payload: SetRegionArgs,
) -> crate::Result<()> {
  app.api().set_region(payload)
}

#[command]
pub(crate) async fn fetch_last_moment<R: Runtime>(app: AppHandle<R>) -> crate::Result<Moment> {
  app.api().fetch_last_moment().await
}

#[command]
pub(crate) async fn is_permission_granted<R: Runtime>(
  _app: AppHandle<R>,
  notification: State<'_, InternalApi<R>>,
) -> crate::Result<Option<bool>> {
  let state = notification.permission_state()?;
  match state {
    PermissionState::Granted => Ok(Some(true)),
    PermissionState::Denied => Ok(Some(false)),
    PermissionState::Prompt | PermissionState::PromptWithRationale => Ok(None),
  }
}

#[command]
pub(crate) async fn request_permission<R: Runtime>(
  _app: AppHandle<R>,
  notification: State<'_, InternalApi<R>>,
) -> crate::Result<PermissionState> {
  notification.request_permission()
}

#[command]
pub(crate) async fn start_notification_service<R: Runtime>(app: AppHandle<R>) -> crate::Result<()> {
  app.api().start_notification_service()
}
