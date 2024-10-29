import { defaultFetcher, type Fetcher } from "@literate.ink/utilities";
import { BEREAL_CLIENT_SECRET_KEY, BEREAL_DEFAULT_HEADERS } from "~/constants";

/**
 * will check the otp code and return
 * the tokens for the user. 
 */
export const vonage_verify_otp = async (otp: string, phoneNumber: string, deviceID: string, fetcher: Fetcher = defaultFetcher) => {
  const response = await fetcher({
    url: new URL("https://auth.bereal.com/token/phone"),
    method: "POST",
    headers: {
      ...BEREAL_DEFAULT_HEADERS(deviceID),
      "Content-Type": "application/json",
    },
    content: JSON.stringify({
      code: otp,
      client_id: "android", // yes, we're using android here on purpose...
      client_secret: BEREAL_CLIENT_SECRET_KEY,
      phone_number: phoneNumber,
      device_id: deviceID
    }),
  });

  if (response.status !== 201)
    throw new Error("failed to verify code");

  return JSON.parse(response.content) as {
    token_type: "bearer"
    access_token: string
    /** @default 3600 */
    expires_in: number
    scope: ""
    refresh_token: string
  };
};
