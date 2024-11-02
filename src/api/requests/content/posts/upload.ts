import auth from "../../../../stores/auth";
import { BEREAL_DEFAULT_HEADERS } from "../../../constants";
import { fetch } from "@tauri-apps/plugin-http";

export interface ContentPostsUploadUrls {
  data: Array<{
    url: string
    expireAt: string
    bucket: string
    path: string
    headers: Record<string, string>
  }>
}

export const content_posts_upload_url = async () => {
  const response = await fetch("https://mobile.bereal.com/api/content/posts/multi-format-upload-url?mimeTypes=image/webp&mimeTypes=image/webp", {
    method: "GET",
    headers: {
      ...BEREAL_DEFAULT_HEADERS(auth.store.deviceID),
      authorization: `Bearer ${auth.store.accessToken}`
    }
  });

  return response.json();
};
