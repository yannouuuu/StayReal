import auth from "~/stores/auth";
import { BEREAL_DEFAULT_HEADERS } from "~/api/constants";
import { fetch } from "@tauri-apps/plugin-http";

export const content_posts_repost = async (postId: string, userId: string, visibility: "friends" | "friends-of-friends"): Promise<void> => {
  const response = await fetch(`https://mobile.bereal.com/api/content/posts/repost/${postId}`, {
    method: "POST",
    headers: {
      ...BEREAL_DEFAULT_HEADERS(auth.store.deviceId),
      authorization: `Bearer ${auth.store.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      visibility
    })
  });

  // if token expired, refresh it and retry
  if (response.status === 401) {
    await auth.refresh();
    return content_posts_repost(postId, userId, visibility);
  }

  if (response.status !== 201) {
    const json = await response.json();
    throw new Error("failed to repost, probably not tagged: " + (json.errorKey || json.error));
  }
}