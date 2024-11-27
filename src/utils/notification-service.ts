import { startNotificationService } from "@stayreal/api";
import { askNotificationPermission } from "./notification-permission";

export const tryToStartNotificationService = async () => {
  const permissionGranted = await askNotificationPermission();

  if (permissionGranted) {
    // We don't have to stop it, it should be done automatically.
    await startNotificationService();
  }
}