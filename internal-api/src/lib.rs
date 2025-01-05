use tauri::{
  plugin::{Builder, TauriPlugin},
  Manager, Runtime,
};

pub use models::*;

#[cfg(desktop)]
mod desktop;
#[cfg(mobile)]
mod mobile;

mod commands;
mod error;
mod models;

pub use error::{Error, Result};

#[cfg(desktop)]
use desktop::BerealApi;
#[cfg(mobile)]
use mobile::BerealApi;

/// Extensions to [`tauri::App`], [`tauri::AppHandle`] and [`tauri::Window`]
/// to access the internal APIs.
pub trait BerealApiExt<R: Runtime> {
  fn bereal_api(&self) -> &BerealApi<R>;
}

impl<R: Runtime, T: Manager<R>> crate::BerealApiExt<R> for T {
  fn bereal_api(&self) -> &BerealApi<R> {
    self.state::<BerealApi<R>>().inner()
  }
}

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
  Builder::new("internal-api")
    .invoke_handler(tauri::generate_handler![
      commands::set_auth_details,
      commands::get_auth_details,
      commands::clear_auth_details,
      commands::refresh_token,
      commands::set_region,
      commands::fetch_last_moment,
      commands::is_permission_granted,
      commands::request_permission,
      commands::start_notification_service
    ])
    .setup(|app, api| {
      #[cfg(mobile)]
      let internal_api = mobile::init(app, api)?;

      #[cfg(desktop)]
      let internal_api = desktop::init(app, api)?;

      app.manage(internal_api);

      Ok(())
    })
    .build()
}
