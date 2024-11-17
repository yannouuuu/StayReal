import { BEREAL_DEFAULT_HEADERS } from "../../constants";
import { fetch } from "@tauri-apps/plugin-http";
import { ApiMedia } from "../../types/media";
import auth from "../../../stores/auth";

export interface RecommendationsFriends {
  recommendations: Array<{
    username: string
    fullname: string
    hashedPhoneNumber: string
    profilePicture?: ApiMedia
    userId: string
    explanation: Array<("MUTUAL_FRIENDS")>
  }>
  totalRecommendations: number
}

export const recommendations_friends = async (limit = 5, source = "onboarding"): Promise<RecommendationsFriends> => {
  const response = await fetch(`https://mobile.bereal.com/api/recommendations/friends?source=${source}&limit=${limit}`, {
    headers: {
      ...BEREAL_DEFAULT_HEADERS(auth.store.deviceId),
      authorization: `Bearer ${auth.store.accessToken}`
    }
  });

  // if token expired, refresh it and retry
  if (response.status === 401) {
    await auth.refresh();
    return recommendations_friends(limit, source);
  }

  return response.json();
};
