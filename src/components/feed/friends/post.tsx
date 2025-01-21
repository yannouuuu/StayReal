import { type Component, createSignal, Show } from "solid-js";
import { content_posts_repost } from "~/api/requests/content/posts/repost";
import { FeedPost } from "~/api/requests/feeds/friends";
import PostRealMojis from "~/components/feed/realmojis";
import feed from "~/stores/feed";
import me from "~/stores/me";
import SolarSmileCircleBold from '~icons/solar/smile-circle-bold'
import ReactionBar from "../ReactionBar";

const FeedFriendsPost: Component<{
  post: FeedPost

  /**
   * User ID of the post owner.
   */
  postUserId: string
}> = (props) => {
  const [isReversed, setIsReversed] = createSignal(false);
  const [videoRef, setVideoRef] = createSignal<HTMLVideoElement>();
  const [isFocusing, setIsFocusing] = createSignal(false);
  const [isReacting, setIsReacting] = createSignal(false);

  const primaryURL = () => isReversed() ? props.post.secondary.url : props.post.primary.url;
  const secondaryURL = () => isReversed() ? props.post.primary.url : props.post.secondary.url;

  let timer: ReturnType<typeof setTimeout> | undefined;

  // On mobile, when having pointer down and scrolling
  // doesn't trigger pointerup, but pointercancel instead.
  // That's why we need to handle both.
  const upEvents = ["pointerup", "pointercancel", "pointermove"];

  const handleVideoUnfocus = () => {
    if (timer) clearTimeout(timer);
    setIsFocusing(false);

    const video = videoRef();
    if (video) {
      video.classList.add("hidden");
      video.pause();
      video.currentTime = 0;
    }

    upEvents.forEach(name => document.removeEventListener(name, handleVideoUnfocus));
  };

  const handleImageUnfocus = () => {
    if (timer) clearTimeout(timer);
    setIsFocusing(false);

    upEvents.forEach(name => document.removeEventListener(name, handleImageUnfocus));
  };

  const handleFocus = (event: PointerEvent) => {
    // We ignore right-clicking.
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (timer) clearTimeout(timer);

    // If we're currently reacting, clicking on the focused image
    // should remove the reaction bar.
    if (isReacting()) {
      setIsReacting(false);
      return;
    }

    if (videoRef()) {
      upEvents.forEach(name => document.addEventListener(name, handleVideoUnfocus));
    }
    else {
      upEvents.forEach(name => document.addEventListener(name, handleImageUnfocus));
    }

    timer = setTimeout(() => {
      setIsFocusing(true);

      const video = videoRef();
      if (video) {
        video.classList.remove("hidden");
        video.play();
      }
    }, 350);
  };

  const [isReposting, setIsReposting] = createSignal(false);
  const handleRepost = async () => {
    setIsReposting(true);

    try {
      // TODO: add "friends of friends" support and modal to ask which one to use
      await content_posts_repost(props.post.id, props.postUserId, "friends");
      await feed.refetch();
    }
    catch (error) {
      // TODO: show toast with error message
      console.error((error as Error).message);
    }
    finally {
      setIsReposting(false);
    }
  };

  const isUserTagged = () => props.post.tags.some(tag => tag.userId === me.get()?.id);
  const isCurrentlyReposted = () => (feed.get()?.userPosts?.posts ?? []).some(post =>
    post.origin === "repost" && post.parentPostId === props.post.id
  );

  return (
    <div class="z-20 relative mx-auto w-fit">
      <img
        class="z-30 h-40 w-auto absolute top-4 left-4 rounded-xl border-2 border-black shadow-l transition-opacity"
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
      <Show when={isReacting()}>
        <div class="z-25 absolute inset-x-0 h-50px bottom-0 bg-gradient-to-t from-black/50 to-transparent" />
      </Show>

      {/* small realmojis in the bottom left */}
      <div class="w-fit">
        <div class="absolute z-30 bottom-4 left-4 transition-opacity"
          classList={{
            "opacity-0 pointer-events-none": isFocusing() || isReacting()
          }}
        >
          <PostRealMojis post={props.post} size={2} shouldReverseZIndex />
        </div>
      </div>

      <div class="w-fit">
        <div class="absolute z-30 bottom-2 right-4 transition-opacity"
          classList={{
            "opacity-0 pointer-events-none": isFocusing() || isReacting()
          }}
        >
          <button type="button"
            onClick={() => setIsReacting(true)}
          >
            <SolarSmileCircleBold class="text-white text-3xl text-shadow-xl" />
          </button>
        </div>
      </div>

      {/* Reaction using realmojis feature. */}
      <div class="absolute z-30 left-4 right-4 transition-all"
        classList={{
          "opacity-0 pointer-events-none -bottom-6": !isReacting(),
          "bottom-4": isReacting()
        }}
      >
        <ReactionBar post={props.post} postUserId={props.postUserId}
          onReact={() => {
            setIsReacting(false);
            feed.refetch();
          }}
        />
      </div>

      {/*
        * Repost feature :
        * We should show it only when the current user is tagged in the post
        * and the post is not already reposted by the current user.
        */}
      <Show when={isUserTagged() && !isCurrentlyReposted()}>
        <div class="absolute z-30 bottom-4.5 inset-x-0 w-fit mx-auto">
          <button
            type="button"
            class="bg-white text-black uppercase font-bold px-4 py-.5 rounded-full shadow-lg disabled:opacity-50"
            disabled={isReposting()}
            onClick={handleRepost}
          >
            Repost
          </button>
        </div>
      </Show>
    </div>
  );
};

export default FeedFriendsPost;
