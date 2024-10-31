import auth from "../../../stores/auth";
import { BEREAL_CLIENT_SECRET_KEY, BEREAL_DEFAULT_HEADERS } from "../../constants";
import { BeRealError, type Tokens } from "../../models";
import { fetch } from "@tauri-apps/plugin-http";

/**
 * @returns new tokens
 */
export const auth_refresh = async (): Promise<Tokens> => {
  const response = await fetch("https://auth.bereal.com/token", {
    method: "POST",
    headers: {
      ...BEREAL_DEFAULT_HEADERS(auth.store.deviceID),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: "android",
      grant_type: "refresh_token",
      client_secret: BEREAL_CLIENT_SECRET_KEY,
      refresh_token: auth.store.refreshToken
    }),
  });

  if (response.status !== 201)
    throw new BeRealError("failed to refresh authentification");

  return response.json();
}