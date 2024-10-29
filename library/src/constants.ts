import { base16 } from '@scure/base';
import { createBeRealSignature } from "./core/signature";

export const BEREAL_IOS_BUNDLE_ID = "AlexisBarreyat.BeReal";
export const BEREAL_IOS_VERSION = "3.15.0";
export const BEREAL_IOS_BUILD = "19455";

// TODO: make this dynamic based on a configuration given to functions
export const BEREAL_TIMEZONE = "Europe/Paris";

export const BEREAL_CLIENT_SECRET_KEY = "F5A71DA-32C7-425C-A3E3-375B4DACA406"
export const BEREAL_ARKOSE_PUBLIC_KEY = "CCB0863E-D45D-42E9-A6C8-9E8544E8B17E";
export const BEREAL_RECAPTCHA_SITE_KEY = "6LfqjDgoAAAAAPy3wiCP92R3nDyNgDDIsjZACoVT";
export const BEREAL_HMAC_KEY = base16.decode('3536303337663461663232666236393630663363643031346532656337316233')

// NOTE: yes we're running iOS 18.0.0 in those headers
// NOTE: yes, we'll use client_id: "android" in the vonage request; it's a feature, not a bug.
export const BEREAL_DEFAULT_HEADERS = (deviceID: string) => ({
  "bereal-platform": "iOS",
  "bereal-os-version": "18.0",
  "bereal-app-version": BEREAL_IOS_VERSION,
  "bereal-app-version-code": BEREAL_IOS_BUILD,
  "bereal-device-language": "en",
  "bereal-app-language": "en-US",
  "bereal-timezone": BEREAL_TIMEZONE,
  "bereal-device-id": deviceID,
  "bereal-signature": createBeRealSignature(deviceID),
  "user-agent": `BeReal/${BEREAL_IOS_VERSION} (${BEREAL_IOS_BUNDLE_ID}; build:${BEREAL_IOS_BUILD}; iOS 18.0.0)`
});
