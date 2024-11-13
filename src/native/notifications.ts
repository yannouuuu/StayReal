import { type as os } from "@tauri-apps/plugin-os"

export const initializeBeRealNotifications = async (region: string): Promise<void> => {
  switch (os()) {
    case "android":
      console.info("WORK IN PROGRESS")
      console.info("CALL PLUGIN")
      break
    case "ios":
      console.warn("Notifications were not initialized since not implemented on iOS");
      break
    default:
      console.warn("Fallback to default notifications using a background rust async thread.");
  }
}
