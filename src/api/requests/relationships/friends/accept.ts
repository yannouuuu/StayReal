import auth from "../../../../stores/auth";
import { BEREAL_DEFAULT_HEADERS } from "../../../constants";
import { fetch } from "@tauri-apps/plugin-http";

export interface RelationshipsFriendsAccept {
  id: string
  username: string
  fullname: string
  status: "accepted"
  mutualFriends: number
  updatedAt: string
}

export const relationships_friends_accept = async (id: string): Promise<RelationshipsFriendsAccept> => {
  const response = await fetch(`https://mobile.bereal.com/api/relationships/friend-requests/${id}`, {
    headers: {
      ...BEREAL_DEFAULT_HEADERS(auth.store.deviceId),
      authorization: `Bearer ${auth.store.accessToken}`
    }
  });

  // if token expired, refresh it and retry
  if (response.status === 401) {
    await auth.refresh();
    return relationships_friends_accept(id);
  }

  return response.json()
};
