import { invoke } from '@tauri-apps/api/core';

export interface AuthDetails {
  deviceId: string;
  accessToken: string;
  refreshToken: string;
}

export async function setAuthDetails(payload: AuthDetails): Promise<void> {
  return invoke('plugin:bereal-api|set_auth_details', {
    payload
  });
}

export async function getAuthDetails(): Promise<AuthDetails> {
  return invoke('plugin:bereal-api|get_auth_details');
}

export async function clearAuthDetails(): Promise<void> {
  return invoke('plugin:bereal-api|clear_auth_details');
}

export async function refreshToken(): Promise<void> {
  return invoke('plugin:bereal-api|refresh_token');
}
