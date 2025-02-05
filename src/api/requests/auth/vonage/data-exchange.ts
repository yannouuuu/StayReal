import { BEREAL_DEFAULT_HEADERS } from "~/api/constants";
import { BeRealError } from "~/api/models/errors";
import { fetch } from "@tauri-apps/plugin-http";

export const postVonageDataExchange = async (inputs: {
  deviceID: string
  phoneNumber: string
}): Promise<string> => {
  const response = await fetch("https://auth-l7.bereal.com/api/vonage/data-exchange", {
    method: "POST",
    headers: {
      ...BEREAL_DEFAULT_HEADERS(inputs.deviceID),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      phoneNumber: inputs.phoneNumber,
    }),
  });

  if (response.status !== 200)
    throw new BeRealError("failed to request code from vonage");

  const json = await response.json() as {
    dataExchange: string
  };

  return json.dataExchange;
};
