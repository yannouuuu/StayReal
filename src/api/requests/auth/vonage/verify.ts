import { BEREAL_CLIENT_SECRET_KEY, BEREAL_DEFAULT_HEADERS } from "../../../constants";
import { BeRealError, type Tokens } from "../../../models";
import { fetch } from "@tauri-apps/plugin-http";

/**
 * will check the otp code and return
 * the tokens for the user. 
 */
export const vonage_verify_otp = async (inputs: {
  otp: string
  deviceID: string,
  phoneNumberUsed: string
}): Promise<Tokens> => {
  const response = await fetch("https://auth.bereal.com/token/phone", {
    method: "POST",
    headers: {
      ...BEREAL_DEFAULT_HEADERS(inputs.deviceID),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: inputs.otp,
      client_id: "android",
      client_secret: BEREAL_CLIENT_SECRET_KEY,
      phone_number: inputs.phoneNumberUsed,
      device_id: inputs.deviceID
    }),
  });

  if (response.status !== 201)
    throw new BeRealError("failed to verify code");

  return response.json();
};
