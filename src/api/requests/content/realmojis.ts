import auth from "../../../stores/auth";
import { BEREAL_DEFAULT_HEADERS } from "../../constants";
import { fetch } from "@tauri-apps/plugin-http";

// TODO: typings

export const content_realmojis_put = async (postId: string, postUserId: string, emoji: string): Promise<any> => {
  /// example of the body sent :
  /// { "emoji": "😍" }

  const response = await fetch(`https://mobile.bereal.com/api/content/realmojis?postId=${postId}&postUserId=${postUserId}`, {
    method: "PUT",
    headers: {
      ...BEREAL_DEFAULT_HEADERS(auth.store.deviceId),
      authorization: `Bearer ${auth.store.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ emoji }),
  });

  return response.json();
}