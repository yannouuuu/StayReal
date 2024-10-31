import auth from "../../../../stores/auth";
import { BEREAL_DEFAULT_HEADERS } from "../../../constants";
import { fetch } from "@tauri-apps/plugin-http";

export const content_posts_caption = async (postId: string, caption: string, tags: unknown[] = []) => {
  const response = await fetch(`https://mobile.bereal.com/api/content/posts/caption/${postId}`, {
    method: "PATCH",
    headers: {
      ...BEREAL_DEFAULT_HEADERS(auth.store.deviceID),
      authorization: `Bearer ${auth.store.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tags,
      caption
    })
  });

  return response.json();
}