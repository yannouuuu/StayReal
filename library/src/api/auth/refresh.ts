import { defaultFetcher, type Fetcher } from "@literate.ink/utilities";
import { BEREAL_CLIENT_SECRET_KEY, BEREAL_DEFAULT_HEADERS } from "~/constants";
import { BeRealError, type Tokens } from "~/models";

/**
 * 
 * @param session 
 * @param fetcher 
 * @returns new tokens
 */
export const auth_refresh = async (inputs: {
  deviceID: string,
  refreshToken: string
}, fetcher: Fetcher = defaultFetcher): Promise<Tokens> => {
  const response = await fetcher({
    url: new URL("https://auth.bereal.com/token"),
    method: "POST",
    headers: {
      ...BEREAL_DEFAULT_HEADERS(inputs.deviceID),
      "Content-Type": "application/json",
    },
    content: JSON.stringify({
      client_id: "android", // yes, we're using android here on purpose...
      grant_type: "refresh_token",
      client_secret: BEREAL_CLIENT_SECRET_KEY,
      refresh_token: inputs.refreshToken
    }),
  });

  if (response.status !== 201)
    throw new BeRealError("failed to refresh authentification");

  return JSON.parse(response.content);
}