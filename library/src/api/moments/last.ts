import { defaultFetcher, type Fetcher } from "@literate.ink/utilities";
import { BEREAL_DEFAULT_HEADERS } from "~/constants";

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

export const moments_last = async (inputs: {
  deviceID: string,
  region: string
}, fetcher: Fetcher = defaultFetcher): Promise<MomentsLast> => {
  const response = await fetcher({
    url: new URL(`https://mobile.bereal.com/api/bereal/moments/last/${inputs.region}`),
    headers: BEREAL_DEFAULT_HEADERS(inputs.deviceID)
  });

  return JSON.parse(response.content);
};
