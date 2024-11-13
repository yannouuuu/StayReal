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

/// Extensions to [`tauri::App`], [`tauri::AppHandle`] and [`tauri::Window`] to access the mobile-bereal-api APIs.
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
  Builder::new("bereal-api")
    .invoke_handler(tauri::generate_handler![
      commands::ping
    ])
    .setup(|app, api| {
      #[cfg(mobile)]
      let bereal_api = mobile::init(app, api)?;

      #[cfg(desktop)]
      let bereal_api = desktop::init(app, api)?;
      
      app.manage(bereal_api);
      Ok(())
    })
    .build()
}
