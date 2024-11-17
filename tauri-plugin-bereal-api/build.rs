const COMMANDS: &[&str] = &[
  "set_auth_details",
  "get_auth_details",
  "clear_auth_details",
  "refresh_token"
];

fn main() {
  tauri_plugin::Builder::new(COMMANDS)
    .android_path("android")
    .ios_path("ios")
    .build();
}
