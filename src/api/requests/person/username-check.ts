import { BEREAL_DEFAULT_HEADERS } from "../../constants";
import { fetch } from "@tauri-apps/plugin-http";
import auth from "../../../stores/auth";

export interface PersonProfilesUsernameCheck {
  /**
   * The username that was requested to be checked.
   */
  username: string

  /**
   * Whether the username is available or not.
   */
  exists: boolean

  /**
   * Contains a list of available usernames that
   * are similar to the requested username.
   *
   * If the requested username is in the list,
   * it means that it is available.
   */
  availableUsernames: Array<string>
}

export const getPersonProfilesUsernameCheck = async (username: string, fullName: string): Promise<PersonProfilesUsernameCheck> => {
  const url = new URL(`https://mobile-l7.bereal.com/api/person/profiles/usernamecheck/${username}`);
  url.searchParams.append("fullName", fullName);

  const response = await fetch(url, {
    headers: {
      ...BEREAL_DEFAULT_HEADERS(auth.store.deviceId),
      authorization: `Bearer ${auth.store.accessToken}`
    }
  });

  if (response.status !== 200) {
    throw new Error(`failed to check username ${username}`);
  }

  return response.json();
};
