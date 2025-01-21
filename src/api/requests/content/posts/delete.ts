import auth from "../../../../stores/auth";
import { BEREAL_DEFAULT_HEADERS } from "../../../constants";
import { fetch } from "@tauri-apps/plugin-http";

export const content_posts_delete = async (postId: string): Promise<void> => {
  const response = await fetch(`https://mobile-l7.bereal.com/api/content/posts/${postId}`, {
    method: "DELETE",
    headers: {
      ...BEREAL_DEFAULT_HEADERS(auth.store.deviceId),
      authorization: `Bearer ${auth.store.accessToken}`
    }
  });

  // if token expired, refresh it and retry
  if (response.status === 401) {
    await auth.refresh();
    return content_posts_delete(postId);
  }
}
