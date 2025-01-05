import { BEREAL_FIREBASE_KEY, BEREAL_IOS_BUNDLE_ID } from "~/api/constants";
import { fetch } from "@tauri-apps/plugin-http";

/**
 * will assign the token to a user.
 */
export const firebase_verify_custom_token = async (token: string): Promise<string> => {
  const response = await fetch(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${BEREAL_FIREBASE_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-ios-bundle-identifier": BEREAL_IOS_BUNDLE_ID
    },
    body: JSON.stringify({
      returnSecureToken: true,
      token
    })
  });

  const json = await response.json() as {
    kind: "identitytoolkit#VerifyCustomTokenResponse",
    idToken: string,
    refreshToken: string,
    expiresIn: "3600",
    isNewUser: boolean,
  }

  return json.idToken;
}
