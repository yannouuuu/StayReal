import { type Component, createSignal, Show } from "solid-js";
import { FeedPost } from "~/api/requests/feeds/friends";
import PostRealMojis from "~/components/feed/realmojis";

const FeedFriendsPost: Component<{ post: FeedPost }> = (props) => {
  const [isReversed, setIsReversed] = createSignal(false);
  const [videoRef, setVideoRef] = createSignal<HTMLVideoElement>();
  const [isFocusing, setIsFocusing] = createSignal(false);

  const primaryURL = () => isReversed() ? props.post.secondary.url : props.post.primary.url;
  const secondaryURL = () => isReversed() ? props.post.primary.url : props.post.secondary.url;

  let timer: ReturnType<typeof setTimeout> | undefined;

  const handleVideoUnfocus = () => {
    setIsFocusing(false);

    const video = videoRef();
    if (video) {
      video.classList.add("hidden");
      video.pause();
      video.currentTime = 0;
    }

    document.removeEventListener("pointerup", handleVideoUnfocus);
  }

  const handleImageUnfocus = () => {
    if (timer) clearTimeout(timer);
    setIsFocusing(false);

    document.removeEventListener("pointerup", handleImageUnfocus);
  }

  const handleFocus = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      setIsFocusing(true);

      const video = videoRef();
      if (video) {
        document.addEventListener("pointerup", handleVideoUnfocus);

        video.classList.remove("hidden");
        video.play();
      }
      else {
        document.addEventListener("pointerup", handleImageUnfocus);
      }
    }, 250);
  }

  return (
    <div class="z-20 relative mx-auto w-fit">
      <img
        class="z-30 h-40 w-auto absolute top-4 left-4 rounded-xl border-2 border-black shadow-lg transition-opacity"
        onClick={() => setIsReversed(prev => !prev)}
        alt="Secondary image"
        src={secondaryURL()}
        classList={{
          "opacity-0 pointer-events-none": isFocusing()
        }}
      />

      <img
        class="rounded-2xl max-h-80vh"
        alt="Primary image"
        src={primaryURL()}
        onPointerDown={handleFocus}
      />

      <Show when={props.post.postType === "bts"}>
        <video ref={setVideoRef}
          class="hidden absolute inset-0 rounded-2xl max-h-80vh"
          src={props.post.btsMedia!.url}
          controls={false}
          autoplay={false}
          muted={false}
          playsinline
          onEnded={handleVideoUnfocus}
        ></video>

        <div class="z-25 absolute top-4 right-4 bg-black/50 px-3.5 py-1 rounded-2xl transition-opacity"
          classList={{
            "opacity-0 pointer-events-none": isFocusing()
          }}
        >
          <p class="font-600">BTS</p>
        </div>
      </Show>

      {/* dimmed background overlay */}
      <div class="z-25 absolute inset-x-0 h-50px bottom-0 bg-gradient-to-t from-black/50 to-transparent" />
      
      {/* small realmojis in the bottom left */}
      <div class="w-fit">
        <div class="absolute z-30 bottom-4 left-4 transition-opacity"
          classList={{
            "opacity-0 pointer-events-none": isFocusing()
          }}
        >
          <PostRealMojis post={props.post} />
        </div>
      </div>
    </div>
  );
};

export default FeedFriendsPost;
