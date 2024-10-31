import auth from "../../../stores/auth";
import { BEREAL_DEFAULT_HEADERS } from "../../constants";
import { fetch } from "@tauri-apps/plugin-http";

export interface MomentsLast {
  id: string
  startDate: string
  // NOTE: should be 2 mins after the start date
  endDate: string
  region: string
  timezone: string
  localTime: string
  localDate: string
}

export const moments_last = async (region: string): Promise<MomentsLast> => {
  const response = await fetch(`https://mobile.bereal.com/api/bereal/moments/last/${region}`, {
    headers: BEREAL_DEFAULT_HEADERS(auth.store.deviceID)
  });

  return response.json();
};
