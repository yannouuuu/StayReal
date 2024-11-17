use std::path::PathBuf;

use serde::{ser::Serializer, Serialize};

pub type Result<T> = std::result::Result<T, Error>;

#[derive(Debug, thiserror::Error)]
#[non_exhaustive]
pub enum Error {
  #[error(transparent)]
  Json(#[from] serde_json::Error),
  #[error(transparent)]
  Tauri(#[from] tauri::Error),
  #[error(transparent)]
  Io(#[from] std::io::Error),
  #[error("forbidden path: {0}")]
  PathForbidden(PathBuf),
  #[error(transparent)]
  Reqwest(#[from] reqwest::Error),
  #[cfg(target_os = "android")]
  #[error(transparent)]
  PluginInvoke(#[from] tauri::plugin::mobile::PluginInvokeError),
  #[error("URL is not a valid path")]
  InvalidPathUrl,
  #[error("Unsafe PathBuf: {0}")]
  UnsafePathBuf(&'static str),
  #[error("an error occurred while refreshing the token")]
  RefreshTokenError(),
}

impl Serialize for Error {
  fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
  where
    S: Serializer,
  {
    serializer.serialize_str(self.to_string().as_ref())
  }
}
