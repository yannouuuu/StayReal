import { fetch } from "@tauri-apps/plugin-http";
import { BEREAL_DEFAULT_HEADERS } from "~/api/constants";
import { ApiMedia } from "~/api/types/media";
import auth from "~/stores/auth";

export type CommentPost = {
  id: string
  user: {
    id: string
    username: string
    profilePicture?: ApiMedia
    type: "USER"
  }
  content: string
  /** @example "2025-01-21T21:30:56.125Z" */
  postedAt: string
}

export const content_posts_comment = async (postId: string, postUserId: string, content: string): Promise<CommentPost> => {
  const response = await fetch(`https://mobile-l7.bereal.com/api/content/comments?postId=${postId}&postUserId=${postUserId}`, {
    method: "POST",
    headers: {
      ...BEREAL_DEFAULT_HEADERS(auth.store.deviceId),
      authorization: `Bearer ${auth.store.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  // if token expired, refresh it and retry
  if (response.status === 401) {
    await auth.refresh();
    return content_posts_comment(postId, postUserId, content);
  }

  if (response.status !== 201) {
    throw new Error(`failed to comment on post ${postId}`);
  }

  return response.json();
}
