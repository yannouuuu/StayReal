import { BEREAL_DEFAULT_HEADERS } from "../../constants";
import { fetch } from "@tauri-apps/plugin-http";
import { ApiMedia } from "../../types/media";
import auth from "../../../stores/auth";

export interface RecommendationsContacts {
  recommendations: Array<{
    username: string
    fullname: string
    // hashedPhoneNumber: string
    profilePicture?: ApiMedia
    userId: string
    // explanation: Array<("MUTUAL_FRIENDS")>
  }>
  totalRecommendations: number
}

export const recommendations_contacts = async (phoneNumbers: Array<string>): Promise<RecommendationsContacts> => {
  const url = "https://mobile.bereal.com/api/recommendations/contacts";
  let response: Response;

  response = await fetch(url, {
    method: "POST",
    headers: {
      ...BEREAL_DEFAULT_HEADERS(auth.store.deviceId),
      authorization: `Bearer ${auth.store.accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      phoneNumbers
    })
  });

  // if token expired, refresh it and retry
  if (response.status === 401) {
    await auth.refresh();
    return recommendations_contacts(phoneNumbers);
  }

  response = await fetch(url, {
    headers: {
      ...BEREAL_DEFAULT_HEADERS(auth.store.deviceId),
      authorization: `Bearer ${auth.store.accessToken}`
    }
  });

  return response.json();
};
