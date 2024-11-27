import { BEREAL_DEFAULT_HEADERS } from "../../constants";
import { fetch } from "@tauri-apps/plugin-http";
import { ApiMedia } from "../../types/media";
import auth from "../../../stores/auth";
import { setRegion } from "@stayreal/api";

export interface PersonMe {
  id: string
  username: string
  /** @example "2005-10-06T00:00:00.000Z" */
  birthdate: string
  fullname: string
  profilePicture: ApiMedia | null
  realmojis: Array<{
    emoji: string
    media: ApiMedia
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
  userFreshness: "returning" | "new"
  streakLength: number
  /** @example "2024-10-14T10:05:31.618Z" */
  lastBtsPostAt: string
  type: "USER"
  links: Array<unknown>
  customRealmoji: "" // TODO: ??
  gender: "MALE" | "FEMALE" // not sure about the female one
  isPrivate: boolean
}

export const person_me = async (): Promise<PersonMe> => {
  const response = await fetch("https://mobile.bereal.com/api/person/me", {
    headers: {
      ...BEREAL_DEFAULT_HEADERS(auth.store.deviceId),
      authorization: `Bearer ${auth.store.accessToken}`
    }
  });

  // if token expired, refresh it and retry
  if (response.status === 401) {
    await auth.refresh();
    return person_me();
  }

  const json = await response.json() as PersonMe;
  await setRegion(json.region);

  return json;
};
