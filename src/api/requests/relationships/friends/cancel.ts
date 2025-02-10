import auth from "~/stores/auth";
import { BEREAL_DEFAULT_HEADERS } from "../../../constants";
import { fetch } from "@tauri-apps/plugin-http";
import { ApiMedia } from "~/api/types/media";

export interface RelationshipsFriendsCancel {
  id: string
  username: string
  fullname: string
  status: "canceled"
  profilePicture?: ApiMedia
  mutualFriends: number
  updatedAt: string
}

export const relationships_friends_cancel = async (id: string): Promise<RelationshipsFriendsCancel> => {
  const response = await fetch(`https://mobile-l7.bereal.com/api/relationships/friend-requests/${id}`, {
    method: "PATCH",
    headers: {
      ...BEREAL_DEFAULT_HEADERS(auth.store.deviceId),
      authorization: `Bearer ${auth.store.accessToken}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      status: "canceled"
    })
  });

  // if token expired, refresh it and retry
  if (response.status === 401) {
    await auth.refresh();
    return relationships_friends_cancel(id);
  }

  return response.json()
};
