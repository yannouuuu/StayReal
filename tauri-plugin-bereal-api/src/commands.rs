use tauri::{ AppHandle, command, Runtime };
use crate::{ BerealApiExt, models::* };

// #[command]
// pub(crate) async fn ping<R: Runtime>(
//   app: AppHandle<R>,
//   payload: PingRequest,
// ) -> Result<PingResponse> {
//   app.bereal_api().ping(payload)
// }

#[command]
pub(crate) async fn set_auth_details<R: Runtime>(
  app: AppHandle<R>,
  payload: AuthDetails,
) -> crate::Result<()> {
  app.bereal_api().set_auth_details(payload)
}

#[command]
pub(crate) async fn get_auth_details<R: Runtime>(
  app: AppHandle<R>
) -> crate::Result<AuthDetails> {
  app.bereal_api().get_auth_details()
}

#[command]
pub(crate) async fn clear_auth_details<R: Runtime>(
  app: AppHandle<R>
) -> crate::Result<()> {
  app.bereal_api().clear_auth_details()
}

#[command]
pub(crate) async fn refresh_token<R: Runtime>(
  app: AppHandle<R>
) -> crate::Result<()> {
  app.bereal_api().refresh_token().await
}