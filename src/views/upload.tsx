import { type Component, createSignal, Show } from "solid-js";
import { content_posts_create, content_posts_upload_url, upload_content,  } from "../api/requests/content/posts/upload";
import { createMediaPermissionRequest, createStream } from "@solid-primitives/stream";
import { useNavigate } from "@solidjs/router";

const UploadView: Component = () => {
  createMediaPermissionRequest();
  const navigate = useNavigate();

  const [frontStream] = createStream({ video: { facingMode: { exact: "user" }, height: 1000, width: 1500 } });
  const [backStream] = createStream({ video: { facingMode: { exact: "environment" }, height: 1000, width: 1500 } });

  let frontVideo: HTMLVideoElement | undefined;
  let backVideo: HTMLVideoElement | undefined;
  let frontVideoPreview: HTMLCanvasElement | undefined;
  let backVideoPreview: HTMLCanvasElement | undefined;

  /**
   * capture a webp image from the video element.
   * also displays the preview on the canvas element.
   */
  const captureFromVideo = async (video: HTMLVideoElement, canvas: HTMLCanvasElement): Promise<Blob> => new Promise((resolve, reject) => {
    const context = canvas.getContext("2d");

    if (!context) {
      reject(new Error("Could not get canvas context"));
      return;
    }

    const outputWidth = 1500;
    const outputHeight = 2000;
    
    // Set canvas dimensions to fixed size (1500x2000)
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // Calculate video scaling to maintain aspect ratio while covering the canvas area
    const videoAspectRatio = video.videoWidth / video.videoHeight;
    const canvasAspectRatio = outputWidth / outputHeight;
    
    let drawHeight: number;
    let drawWidth: number;
    let offsetX: number;
    let offsetY: number;

    if (videoAspectRatio > canvasAspectRatio) {
      // Video is wider than the canvas aspect ratio
      drawHeight = outputHeight;
      drawWidth = video.videoWidth * (outputHeight / video.videoHeight);
      offsetX = (outputWidth - drawWidth) / 2;  // Center horizontally
      offsetY = 0;
    }
    else {
      // Video is taller than the canvas aspect ratio
      drawHeight = video.videoHeight * (outputWidth / video.videoWidth);
      drawWidth = outputWidth;
      offsetX = 0;
      offsetY = (outputHeight - drawHeight) / 2;  // Center vertically
    }

    // Draw the centered, cropped video frame on the canvas
    context.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);

    canvas.toBlob((blob) => {
      if (!blob) reject(new Error("Failed to capture image"));
      else resolve(blob);
    }, "image/webp", .75);
  });

  const [frontImage, setFrontImage] = createSignal<Blob | undefined>(undefined);
  const [backImage, setBackImage] = createSignal<Blob | undefined>(undefined);
  const [loading, setLoading] = createSignal(false);

  /**
   * capture back and front at exact same time.
   */
  const handleDualCapture = async () => {
    try {
      setLoading(true);
  
      const [frontBlob, backBlob] = await Promise.all([
        captureFromVideo(frontVideo!, frontVideoPreview!),
        captureFromVideo(backVideo!, backVideoPreview!)
      ]);
  
      setFrontImage(frontBlob);
      setBackImage(backBlob);
    }
    finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    try {
      setLoading(true);

      // get the signed URLs for uploading the images
      const { data: [back, front] } = await content_posts_upload_url();
      
      // upload the images
      await Promise.all([
        upload_content(back.url, back.headers, backImage()!),
        upload_content(front.url, front.headers, frontImage()!)
      ]);
  
      // create the post with the uploaded images
      await content_posts_create({
        // NOTE: always `false` when it's not the primary post...
        isLate: false,
        
        backCameraWidth: 1500,
        backCameraHeight: 2000,
        backCameraPath: back.path,

        frontCameraWidth: 1500,
        frontCameraHeight: 2000,
        frontCameraPath: front.path,
        
        bucketName: front.bucket, // or back.bucket, they are the same
        takenAt: new Date(),
        
        // TODO: probably increment each time you hit the "cancel" button
        retakeCounter: 0,

        // TODO: geolocation, if available
        // location: {
        //   latitude: 45,
        //   longitude: 1
        // }
      });
  
      // TODO: show an alert or something

      // navigate to the feed to see the new post
      navigate("/feed");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-100dvh grid gap-4 rows-[auto_1fr_auto]">
      <header class="py-4">
        <nav class="flex items-center justify-between px-4">
          <a href="/feed">
            back
          </a>
          <Show when={backImage() && frontImage()}>
            <button type="button"
              onClick={() => {
                setBackImage(undefined);
                setFrontImage(undefined);
              }}
            >
              cancel
            </button>
          </Show>
        </nav>
      </header>

      <div class="relative mx-auto"
        style={{
          // width: "100vw",
          // height: "calc(100vw * (1500 / 2000))",
          // "max-height": "100%",
          // "max-width": "calc(100% * (2000 / 1500))"

          // TODO: fix this to be responsive, it's very hard...
          height: "min(100vw, calc(50vh * (2000 / 1500)))",
          width: "min(50vh, calc(100vw * (1500 / 2000)))"
        }}
      >
        <div class="absolute top-4 left-4 w-full max-w-[calc(20vh*(1500/2000))] h-20vh">
          <canvas ref={backVideoPreview}
            class="absolute inset-0 z-15 rounded-xl h-full w-full object-cover border-2 border-black"
            classList={{ "opacity-0": backImage() === undefined }}
          />

          {/* @ts-expect-error : special directive ("prop:") */}
          <video ref={backVideo} prop:srcObject={backStream()}
            class="absolute inset-0 z-10 rounded-xl h-full w-full object-cover border-2 border-black"
            classList={{ "opacity-0": backImage() !== undefined }}
            autoplay
          />
        </div>

        <canvas ref={frontVideoPreview}
          class="absolute inset-0 z-5 rounded-2xl h-full w-full object-cover"
          classList={{ "opacity-0": frontImage() === undefined }}
        />

        {/* @ts-expect-error : special directive ("prop:") */}
        <video ref={frontVideo} prop:srcObject={frontStream()}
          class="absolute inset-0 z-0 rounded-2xl h-full w-full object-cover"
          classList={{ "opacity-0": frontImage() !== undefined }}
          autoplay
        />
      </div>

      <div class="pb-8 pt-4 flex justify-center">
        <Show when={!frontImage() && !backImage()}>
          <button
            type="button"
            title="Capture"
            disabled={loading()}
            class="h-24 w-24 bg-white/5 border-6 border-white rounded-full disabled:(bg-white animate-pulse animation-duration-100)"
            onClick={() => handleDualCapture()}
          />
        </Show>

        <Show when={frontImage() && backImage()}>
          <button type="button"
            onClick={() => handleUpload()}
            class="bg-white text-black font-600 py-3.5 px-8 rounded-2xl"
          >
            Upload a BeReal.
          </button>
        </Show>
      </div>
    </div>
  )
};

export default UploadView;