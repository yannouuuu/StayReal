import { Component, createResource, createSignal, Show } from "solid-js";
import { content_posts_upload_url } from "../api/requests/content/posts/upload";
import { createMediaPermissionRequest, createStream } from "@solid-primitives/stream";

const UploadView: Component = () => {
  createMediaPermissionRequest();

  const [frontStream] = createStream({ video: { facingMode: { exact: "user" }, height: 1000, width: 1500 } });
  const [backStream] = createStream({ video: { facingMode: { exact: "environment" }, height: 1000, width: 1500 } });
  // const [uploadURL] = createResource(content_posts_upload_url);

  let frontVideo: HTMLVideoElement | undefined;
  let backVideo: HTMLVideoElement | undefined;
  let frontVideoPreview: HTMLCanvasElement | undefined;
  let backVideoPreview: HTMLCanvasElement | undefined;

  const captureFromVideo = async (video: HTMLVideoElement, canvas: HTMLCanvasElement): Promise<Blob> => new Promise((resolve, reject) => {
    const context = canvas.getContext("2d");

    if (!context) {
      reject(new Error("Could not get canvas context"));
      return;
    }

    const outputWidth = 1500;
    const aspectRatio = video.videoWidth / video.videoHeight;

    canvas.width = outputWidth;
    canvas.height = outputWidth / aspectRatio;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) reject(new Error("Failed to capture image"));
      else resolve(blob);
    }, "image/webp", .75);
  });

  const [frontImage, setFrontImage] = createSignal<Blob | undefined>(undefined);
  const [backImage, setBackImage] = createSignal<Blob | undefined>(undefined);

  const handleDualCapture = async () => {
    const [frontBlob, backBlob] = await Promise.all([
      captureFromVideo(frontVideo!, frontVideoPreview!),
      captureFromVideo(backVideo!, backVideoPreview!)
    ]);

    setFrontImage(frontBlob);
    setBackImage(backBlob);
  }

  return (
    <div class="min-h-screen grid rows-[auto_1fr_auto]">
      <header class="py-4">
        <nav class="flex items-center justify-between px-4">
          <a href="/feed">
            back
          </a>
        </nav>
      </header>

      <div>
        <div class="relative">
          <canvas ref={backVideoPreview}
            class="absolute z-15 top-4 left-4 h-140px w-auto rounded-xl border-2 border-black"
            classList={{ "opacity-0": backImage() === undefined }}
          />

          {/* @ts-expect-error : special directive ("prop:") */}
          <video ref={backVideo} prop:srcObject={backStream()}
            class="absolute z-10 top-4 left-4 h-140px w-auto rounded-xl border-2 border-black"
            classList={{ "opacity-0": backImage() !== undefined }}
            autoplay
          />

          <canvas ref={frontVideoPreview}
            class="absolute z-5 inset-0 h-full mx-auto rounded-2xl"
            classList={{ "opacity-0": frontImage() === undefined }}
          />

          {/* @ts-expect-error : special directive ("prop:") */}
          <video ref={frontVideo} prop:srcObject={frontStream()}
            class="z-0 rounded-2xl"
            classList={{ "opacity-0": frontImage() !== undefined }}
            autoplay
          />
        </div>
      </div>

      <div class="pb-12 flex justify-center">
        <button
          type="button"
          title="Capture"
          class="h-24 w-24 bg-white/5 border-6 border-white rounded-full"
          onClick={() => handleDualCapture()}
        />
      </div>
    </div>
  )
};

export default UploadView;