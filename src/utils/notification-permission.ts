import {
  isPermissionGranted,
  requestPermission,
} from 'tauri-plugin-bereal-api';

export const askNotificationPermission = async (): Promise<boolean> => {
  let permissionGranted = await isPermissionGranted();

  // If not we need to request it
  if (!permissionGranted) {
    const permission = await requestPermission();
    permissionGranted = permission === 'granted';
  }

  return permissionGranted;
};
