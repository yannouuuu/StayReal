export type Tokens = Readonly<{
  token_type: "bearer"
  access_token: string
  /** @default 3600 */
  expires_in: number
  scope: ""
  refresh_token: string
}>;
