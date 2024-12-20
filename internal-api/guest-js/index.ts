import { invoke } from '@tauri-apps/api/core';

export interface AuthDetails {
  deviceId: string;
  accessToken: string;
  refreshToken: string;
}

export interface Moment {
  id: string
  region: string
  startDate: string
  endDate: string
}

export async function setAuthDetails(payload: AuthDetails): Promise<void> {
  return invoke('plugin:internal-api|set_auth_details', {
    payload
  });
}

export async function getAuthDetails(): Promise<AuthDetails> {
  return invoke('plugin:internal-api|get_auth_details');
}

export async function clearAuthDetails(): Promise<void> {
  return invoke('plugin:internal-api|clear_auth_details');
}

export async function refreshToken(): Promise<void> {
  return invoke('plugin:internal-api|refresh_token');
}

export async function setRegion(region: string): Promise<void> {
  return invoke('plugin:internal-api|set_region', {
    payload: { region }
  });
}

export async function fetchLastMoment(): Promise<Moment> {
  return invoke('plugin:internal-api|fetch_last_moment');
}

export async function requestPermission(): Promise<PermissionState> {
  return invoke<PermissionState>('plugin:internal-api|request_permission' )
}

export async function isPermissionGranted(): Promise<boolean> {
  return invoke('plugin:internal-api|is_permission_granted')
}

export async function startNotificationService(): Promise<void> {
  return invoke('plugin:internal-api|start_notification_service')
}
