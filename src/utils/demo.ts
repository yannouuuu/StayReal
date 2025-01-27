export const DEMO_PHONE_NUMBER = "+33612345678";
export const DEMO_OTP = "123456";
export const DEMO_ACCESS_TOKEN = "DEMO_ACCESS_TOKEN";
export const DEMO_REFRESH_TOKEN = (nb: number | string): string => {
  if (typeof nb === "number") {
    return `DEMO_REFRESH_TOKEN_${nb}`;
  }
  else if (typeof nb === "string") {
    nb = nb.split("_")[3].trim();
    return DEMO_REFRESH_TOKEN(parseInt(nb) + 1);
  }
  else throw new TypeError("invalid demo refresh token argument");
}
