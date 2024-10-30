import { defaultFetcher, type Fetcher } from "@literate.ink/utilities";
import { BEREAL_DEFAULT_HEADERS } from "~/constants";
import { BeRealError, ExpiredTokenError } from "~/models/errors";

export interface PersonMe {
  id: string
  username: string
  /** @example "2005-10-06T00:00:00.000Z" */
  birthdate: string
  fullname: string
  profilePicture: {
    url: string
    // 1000px for them
    width: number
    height: number
  }
  realmojis: Array<{
    emoji: string
    media: {
      url: string
      // 500px for them
      width: number
      height: number
    }
  }>
  devices: Array<{
    clientVersion: string
    device: string
    deviceId: string
    platform: string
    language: string
    timezone: string
  }>
  canDeletePost: boolean
  canPost: boolean
  canUpdateRegion: boolean
  phoneNumber: string
  biography: string
  location: string
  countryCode: string
  /**
   * used to know which region to check for the bereal moment
   * @example "europe-west"
   */
  region: string
  /** @example "2024-04-12T22:07:19.431Z" */
  createdAt: string,
  isRealPeople: boolean
  userFreshness: "returning" // NOTE: should be an enum ?
  streakLength: number
  /** @example "2024-10-14T10:05:31.618Z" */
  lastBtsPostAt: string
  type: "USER"
  links: Array<unknown>
  customRealmoji: "" // TODO: ??
  gender: "MALE" | "FEMALE" // not sure about the female one
  isPrivate: boolean
}

export const person_me = async (inputs: {
  deviceID: string
  accessToken: string
}, fetcher: Fetcher = defaultFetcher): Promise<PersonMe> => {
  const response = await fetcher({
    url: new URL("https://mobile.bereal.com/api/person/me"),
    headers: {
      ...BEREAL_DEFAULT_HEADERS(inputs.deviceID),
      authorization: `Bearer ${inputs.accessToken}`
    }
  });

  if (response.status !== 200) {
    if (response.status === 401)
      throw new ExpiredTokenError();

    throw new BeRealError("can't read user data, are you authenticated ?");
  }

  return JSON.parse(response.content);
};
