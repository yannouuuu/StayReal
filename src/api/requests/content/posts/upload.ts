import auth from "../../../../stores/auth";
import { BEREAL_DEFAULT_HEADERS } from "../../../constants";
import { fetch } from "@tauri-apps/plugin-http";

export interface ContentPostsUploadUrls {
  data: Array<{
    /** @example "https://storage.googleapis.com/.../Photos/.../post/..." */
    url: string
    expireAt: string
    bucket: string
    /** @example "Photos/:user_id/post/:post_id.webp" */
    path: string
    /**
     * contains `cache-control`, `content-type` and `x-goog-content-length-range`
     */
    headers: Record<string, string>
  }>
}

export const content_posts_upload_url = async (): Promise<ContentPostsUploadUrls> => {
  const response = await fetch("https://mobile.bereal.com/api/content/posts/multi-format-upload-url?mimeTypes=image/webp&mimeTypes=image/webp", {
    method: "GET",
    headers: {
      ...BEREAL_DEFAULT_HEADERS(auth.store.deviceID),
      authorization: `Bearer ${auth.store.accessToken}`
    }
  });

  return response.json();
};

export const upload_content = async (url: string, headers: Record<string, string>, file: Blob): Promise<void> => {
  const response = await fetch(url, {
    method: "PUT",
    body: file,
    headers
  });

  if (response.status !== 200)
    throw new Error("failed to upload content, image may be too big!");
};

export const content_posts_create = async (inputs: {
  isLate: boolean
  retakeCounter: number
  bucketName: string,
  frontCameraPath: string
  frontCameraHeight: number
  frontCameraWidth: number,
  backCameraPath: string
  backCameraHeight: number
  backCameraWidth: number,
  location?: { longitude: number, latitude: number }
  takenAt: Date
}): Promise<void> => {
  const response = await fetch("https://mobile.bereal.com/api/content/posts", {
    method: "POST",
    headers: {
      ...BEREAL_DEFAULT_HEADERS(auth.store.deviceID),
      authorization: `Bearer ${auth.store.accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      visibility: ["friends"],
      frontCamera: {
        bucket: inputs.bucketName,
        path: inputs.frontCameraPath,
        height: inputs.frontCameraHeight,
        width: inputs.frontCameraWidth,
        mediaType: "image"
      },
      postType: "default",
      isLate: inputs.isLate,
      retakeCounter: inputs.retakeCounter,
      location: inputs.location || null,
      backCamera: {
        bucket: inputs.bucketName,
        path: inputs.backCameraPath,
        height: inputs.backCameraHeight,
        width: inputs.backCameraWidth,
        mediaType: "image"
      },
      takenAt: inputs.takenAt.toISOString()
    })
  });

  if (response.status !== 201) {
    throw new Error("failed to create post");
  }
};
