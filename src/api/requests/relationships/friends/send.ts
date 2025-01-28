import auth from "~/stores/auth";
import { BEREAL_DEFAULT_HEADERS } from "~/api/constants";
import { fetch } from "@tauri-apps/plugin-http";
import type { ApiMedia } from "~/api/types/media";

export interface PostRelationshipsFriendRequests {
  id: string
  username: string
  fullname: string
  status: "sent"
  profilePicture?: ApiMedia
  mutualFriends: number
  updatedAt: string
}

export const postRelationshipsFriendRequests = async (userId: string): Promise<PostRelationshipsFriendRequests> => {
  const response = await fetch(`https://mobile-l7.bereal.com/api/relationships/friend-requests/`, {
    method: "POST",
    headers: {
      ...BEREAL_DEFAULT_HEADERS(auth.store.deviceId),
      authorization: `Bearer ${auth.store.accessToken}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({ userId })
  });

  // if token expired, refresh it and retry
  if (response.status === 401) {
    await auth.refresh();
    return postRelationshipsFriendRequests(userId);
  }

  if (response.status !== 201) {
    throw new Error("failed to send friend request")
  }

  return response.json();
};
