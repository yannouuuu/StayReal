import { invoke } from '@tauri-apps/api/core'

/**
 * Initialize the BeReal Moment API notification for the given region.
 */
export async function initBeRealMomentForRegion(region: string): Promise<void> {
  await invoke<{region?: string}>('plugin:mobile-bereal-api|ping', {
    payload: { region }
  });
}
