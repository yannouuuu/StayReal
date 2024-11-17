import auth from "../../../../stores/auth";
import { BEREAL_DEFAULT_HEADERS } from "../../../constants";
import { fetch } from "@tauri-apps/plugin-http";

// TODO: typing on return value

export const content_posts_caption = async (postId: string, caption: string, tags: unknown[] = []): Promise<any> => {
  const response = await fetch(`https://mobile.bereal.com/api/content/posts/caption/${postId}`, {
    method: "PATCH",
    headers: {
      ...BEREAL_DEFAULT_HEADERS(auth.store.deviceId),
      authorization: `Bearer ${auth.store.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tags,
      caption
    })
  });
  
  // if token expired, refresh it and retry
  if (response.status === 401) {
    await auth.refresh();
    return content_posts_caption(postId, caption, tags);
  }

  return response.json();
}