import auth from "../../../../stores/auth";
import { BEREAL_DEFAULT_HEADERS } from "../../../constants";
import { fetch } from "@tauri-apps/plugin-http";
import { ApiMedia } from "../../../types/media";

export interface RelationshipsFriends {
  data: Array<{
    id: string
    username: string
    fullname: string
    profilePicture?: ApiMedia
    status: "accepted"
  }>
  next: unknown | null
  total: number
}

export const relationships_friends = async (): Promise<RelationshipsFriends> => {
  const response = await fetch("https://mobile-l7.bereal.com/api/relationships/friends", {
    headers: {
      ...BEREAL_DEFAULT_HEADERS(auth.store.deviceId),
      authorization: `Bearer ${auth.store.accessToken}`
    }
  });

  // if token expired, refresh it and retry
  if (response.status === 401) {
    await auth.refresh();
    return relationships_friends();
  }

  return response.json()
};
