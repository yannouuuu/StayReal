import type { Session, Tokens } from "~/models";

export const createSession = (deviceID: string, tokens?: Partial<Tokens>): Session => ({
  deviceID,
  accessToken: tokens?.access_token,
  refreshToken: tokens?.refresh_token
});
