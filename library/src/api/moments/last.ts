import { defaultFetcher, type Fetcher } from "@literate.ink/utilities";
import { BEREAL_DEFAULT_HEADERS } from "~/constants";
import type { Session } from "~/models";

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

export const moments_last = async (session: Session, region: string, fetcher: Fetcher = defaultFetcher): Promise<MomentsLast> => {
  const response = await fetcher({
    url: new URL(`https://mobile.bereal.com/api/bereal/moments/last/${region}`),
    headers: BEREAL_DEFAULT_HEADERS(session.deviceID)
  });

  return JSON.parse(response.content);
};
