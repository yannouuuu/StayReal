const COMMANDS: &[&str] = &[
  "set_auth_details",
  "get_auth_details",
  "clear_auth_details",
  "refresh_token",
  "set_region",
  "fetch_last_moment",
  "is_permission_granted",
  "request_permission",
  "start_notification_service"
];

fn main() {
  tauri_plugin::Builder::new(COMMANDS)
    .android_path("android")
    .ios_path("ios")
    .build();
}
