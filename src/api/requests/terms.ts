import { fetch } from "@tauri-apps/plugin-http";
import { BEREAL_DEFAULT_HEADERS } from "../constants";
import auth from "../../stores/auth";

export interface Terms {
  data: Array<{
    code: string
    status: "ACCEPTED" | "UNKNOWN" | "DECLINED"
    signedAt: string
    termUrl: string
    version: string
  }>
}

export const terms = async (): Promise<Terms> => {
  const response = await fetch("https://mobile.bereal.com/api/terms", {
    headers: {
      ...BEREAL_DEFAULT_HEADERS(auth.store.deviceID),
      authorization: `Bearer ${auth.store.accessToken}`
    }
  });

  // if token expired, refresh it and retry
  if (response.status === 401) {
    await auth.refresh();
    return terms();
  }

  return response.json();
};
