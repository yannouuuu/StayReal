import { BEREAL_DEFAULT_HEADERS, BEREAL_CLIENT_SECRET, BEREAL_PLATFORM } from "~/api/constants";
import type { Tokens } from "~/api/models/tokens";
import { fetch } from "@tauri-apps/plugin-http";

/**
 * Retrieves final tokens using the Firebase `idToken`.
 */
export const grant_firebase = async (inputs: {
  deviceID: string
  idToken: string
}): Promise<Tokens> => {
  const response = await fetch("https://auth-l7.bereal.com/token?grant_type=firebase", {
    method: "POST",
    headers: {
      ...BEREAL_DEFAULT_HEADERS(inputs.deviceID),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token: inputs.idToken,
      client_id: BEREAL_PLATFORM.toLowerCase(),
      grant_type: "firebase",
      client_secret: BEREAL_CLIENT_SECRET
    })
  });

  if (response.status !== 201)
    throw new Error("failed to generate tokens from firebase");

  return response.json();
};
