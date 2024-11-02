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
  next: unknown | null // NOTE: not sure, probably because of the "page" query parameter
  total: number
}

export const relationships_friends = async (): Promise<RelationshipsFriends> => {
  const response = await fetch("https://mobile.bereal.com/api/relationships/friends?page", {
    headers: {
      ...BEREAL_DEFAULT_HEADERS(auth.store.deviceID),
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
