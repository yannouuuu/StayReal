import { hex } from '@scure/base';
import { createBeRealSignature } from "./core/signature";

export const BEREAL_ANDROID_BUNDLE_ID = "com.bereal.ft";
export const BEREAL_ANDROID_VERSION = "3.10.1";
export const BEREAL_ANDROID_BUILD = "2348592";

// TODO: make this dynamic based on a configuration given to functions
export const BEREAL_TIMEZONE = "Europe/Paris";

export const BEREAL_CLIENT_SECRET_KEY = "F5A71DA-32C7-425C-A3E3-375B4DACA406"
export const BEREAL_ARKOSE_PUBLIC_KEY = "CCB0863E-D45D-42E9-A6C8-9E8544E8B17E";
export const BEREAL_RECAPTCHA_SITE_KEY = "6LfqjDgoAAAAAPy3wiCP92R3nDyNgDDIsjZACoVT";
export const BEREAL_HMAC_KEY = hex.decode('3536303337663461663232666236393630663363643031346532656337316233')

export const BEREAL_DEFAULT_HEADERS = (deviceID: string) => ({
  "bereal-platform": "android",
  "bereal-os-version": "14",
  "bereal-app-version": BEREAL_ANDROID_VERSION,
  "bereal-app-version-code": BEREAL_ANDROID_BUILD,
  "bereal-device-language": "en",
  "bereal-app-language": "en-US",
  "bereal-timezone": BEREAL_TIMEZONE,
  "bereal-device-id": deviceID,
  "bereal-signature": createBeRealSignature(deviceID),
  "user-agent": `BeReal/${BEREAL_ANDROID_VERSION} (${BEREAL_ANDROID_BUNDLE_ID}; build:${BEREAL_ANDROID_BUILD}; Android 14) 4.12.0/OkHttp`
});
