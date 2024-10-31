import { BEREAL_CLIENT_SECRET_KEY, BEREAL_DEFAULT_HEADERS } from "../../../constants";
import { BeRealError } from "../../../models";
import { fetch } from "@tauri-apps/plugin-http";

export const VonageRequestCodeTokenIdentifier = {
  RECAPTCHA: "RE",
  ARKOSE: "AR"
} as const;

export type VonageRequestCodeTokenIdentifier = typeof VonageRequestCodeTokenIdentifier[keyof typeof VonageRequestCodeTokenIdentifier];

export interface VonageRequestCodeToken {
  identifier: VonageRequestCodeTokenIdentifier
  token: string
}

/**
 * will send an otp code to the phone number.
 * you can use only the ARKOSE token here.
 */
export const vonage_request_code = async (inputs: {
  deviceID: string
  phoneNumber: string
  tokens: VonageRequestCodeToken[]
}): Promise<void> => {
  const response = await fetch("https://auth.bereal.com/token/phone", {
    method: "POST",
    headers: {
      ...BEREAL_DEFAULT_HEADERS(inputs.deviceID),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tokens: inputs.tokens,
      client_id: "android",
      client_secret: BEREAL_CLIENT_SECRET_KEY,
      phone_number: inputs.phoneNumber,
      device_id: inputs.deviceID
    }),
  });

  if (response.status !== 204)
    throw new BeRealError("failed to request code from vonage");
};
