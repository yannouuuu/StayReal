import { BEREAL_DEFAULT_HEADERS } from "../../constants";
import { fetch } from "@tauri-apps/plugin-http";
import auth from "../../../stores/auth";

export type MomentsRegions = Array<{
  code: string
  name: string
}>

export const moments_regions = async (): Promise<MomentsRegions> => {
  const response = await fetch("https://mobile.bereal.com/api/bereal/regions?language=en", {
    headers: {
      ...BEREAL_DEFAULT_HEADERS(auth.store.deviceId),
      authorization: `Bearer ${auth.store.accessToken}`
    }
  });

  // if token expired, refresh it and retry
  if (response.status === 401) {
    await auth.refresh();
    return moments_regions();
  }

  return response.json();
};
