import { defaultFetcher, type Fetcher } from "@literate.ink/utilities";
import { BEREAL_CLIENT_SECRET_KEY, BEREAL_DEFAULT_HEADERS } from "~/constants";
import type { Session, Tokens } from "~/models";

/**
 * will check the otp code and return
 * the tokens for the user. 
 */
export const vonage_verify_otp = async (session: Session, otp: string, phoneNumberUsed: string, fetcher: Fetcher = defaultFetcher): Promise<Tokens> => {
  const response = await fetcher({
    url: new URL("https://auth.bereal.com/token/phone"),
    method: "POST",
    headers: {
      ...BEREAL_DEFAULT_HEADERS(session.deviceID),
      "Content-Type": "application/json",
    },
    content: JSON.stringify({
      code: otp,
      client_id: "android", // yes, we're using android here on purpose...
      client_secret: BEREAL_CLIENT_SECRET_KEY,
      phone_number: phoneNumberUsed,
      device_id: session.deviceID
    }),
  });

  if (response.status !== 201)
    throw new Error("failed to verify code");

  return JSON.parse(response.content);
};
