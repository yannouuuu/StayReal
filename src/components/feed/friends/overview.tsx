import { Component, createEffect, createMemo, createSignal, For, type Setter, Show } from "solid-js";
import type { PostsOverview } from "~/api/requests/feeds/friends";
import createEmblaCarousel from 'embla-carousel-solid'
import MdiDotsVertical from '~icons/mdi/dots-vertical';
import MdiRepost from '~icons/mdi/repost';
import MdiCommentOutline from '~icons/mdi/comment-outline'
import MdiMapSearch from '~icons/mdi/map-search'
import FeedFriendsPost from "./post";
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
import type { EmblaCarouselType } from "embla-carousel";
import Location from "~/components/location";
import { Duration } from "luxon";
import { open } from "@tauri-apps/plugin-shell"
import { DropdownMenu } from "@kobalte/core/dropdown-menu";
import MdiSend from '~icons/mdi/send'
import me from "~/stores/me";
import { content_posts_comment } from "~/api/requests/content/posts/comment";
import feed from "~/stores/feed";

const FeedFriendsOverview: Component<{
  overview: PostsOverview
  setScrolling: Setter<boolean>
}> = (props) => {
  const [emblaRef, emblaApi] = createEmblaCarousel(
    () => ({
      skipSnaps: false,
      containScroll: false,
      startIndex: props.overview.posts.length - 1,
    }),
    () => [WheelGesturesPlugin()]
  );

  const [activeIndex, setActiveIndex] = createSignal(props.overview.posts.length - 1);
  const activePost = () => props.overview.posts[activeIndex()];

  const setActiveNode = (api: EmblaCarouselType): void => {
    setActiveIndex(api.selectedScrollSnap());
  }

  createEffect(() => {
    const api = emblaApi()
    if (!api) return;

    api
      .on('select', setActiveNode)
      // To prevent pull to refresh to trigger while we're scrolling on a post.
      // Note that those is only useful for the first post...
      .on("pointerDown", () => props.setScrolling(true))
      .on("pointerUp", () => props.setScrolling(false))
  });

  // show up to 2 comments as a sample
  const commentsSample = () => activePost().comments.slice(0, 2);

  const lateDuration = createMemo(() => {
    if (activePost().lateInSeconds > 0) {
      const duration = Duration.fromObject({ seconds: activePost().lateInSeconds });
      return duration.rescale().toHuman({ unitDisplay: "short" });
    }

    return "";
  });

  const activePostDate = () => new Date(activePost().postedAt);

  const [comment, setComment] = createSignal("");
  const handlePostComment = async (event: SubmitEvent) => {
    event.preventDefault();

    const content = comment().trim();
    if (!content) return;

    await content_posts_comment(activePost().id, props.overview.user.id, content);
    await feed.refetch();
  };

  return (
    <div>
      <div class="flex items-center gap-3 px-4 bg-white/6 py-2.5 rounded-t-2xl">
        <Show when={props.overview.user.profilePicture} fallback={
          <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <p class="text-center font-500">{props.overview.user.username[0]}</p>
          </div>
        }>
          {profilePicture => (
            <img
              class="w-9 h-9 rounded-full"
              src={profilePicture().url}
              alt={`Profile picture of ${props.overview.user.username}`}
            />
          )}
        </Show>
        <div class="flex flex-col gap-.5">
          <p class="font-600 w-fit">
            {props.overview.user.username}
          </p>
          <Show when={activePost().origin === "repost"}>
            <p class="w-fit text-white/80 flex items-center gap-1 bg-white/20 pl-2 pr-2.5 rounded-full text-xs">
              <MdiRepost /> {activePost().parentPostUsername}
            </p>
          </Show>
        </div>

        <DropdownMenu>
          <DropdownMenu.Trigger class="ml-auto hover:bg-white/8 rounded-full p-1.5 -mr-1.5 transition-colors">
            <DropdownMenu.Icon>
              <MdiDotsVertical class="text-xl" />
            </DropdownMenu.Icon>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content class="min-w-[220px] p-2 bg-[#080808] rounded-xl outline-none border border-white/8 transform-origin-[var(--kb-menu-content-transform-origin)]">
              <DropdownMenu.Item class="cursor-pointer rounded-lg py-1.5 px-4 hover:bg-white/8 text-white/80 hover:text-white"
                onSelect={() => open(activePost().primary.url)}
              >
                Open main image URL
              </DropdownMenu.Item>
              <DropdownMenu.Item class="cursor-pointer rounded-lg py-1.5 px-4 hover:bg-white/8 text-white/80 hover:text-white"
                onSelect={() => open(activePost().secondary.url)}
              >
                Open secondary image URL
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu>

      </div>

      <div class="bg-white/4 pb-4 rounded-b-2xl">
        <div class="flex flex-col w-full px-4 py-2 rounded-t-2xl">
          <div class="flex flex-col py-2">
            <div class="flex text-sm text-white/60 space-x-1">
              <time class="shrink-0">
                <span class="tts-only">Posted</span>{" "}
                {activePostDate().getDate() === new Date().getDate() ? "Today" : "Yesterday"}
                {", "}<span class="tts-only">at</span>{" "}
                <span class="text-white/80">{activePostDate().toLocaleTimeString()}</span>
              </time>
              <span>•</span>
              <p class="truncate">
                {lateDuration() ? `Late of ${lateDuration()}` : "Just in time !"}
              </p>
            </div>
            <Show when={activePost().location}>
              {location => (
                <div class="flex items-center gap-1 text-white/60">
                  <p class="text-sm flex items-center gap-1">
                    Took at{" "}
                    <button type="button"
                      onClick={() => open(`https://maps.google.com/?q=${location().latitude},${location().longitude}`)}
                      class="bg-white/10 flex items-center gap-1 py-.5 px-2 rounded-md text-white/80"
                    >
                      <Location
                        latitude={location().latitude}
                        longitude={location().longitude}
                      />
                      <MdiMapSearch />
                    </button>
                  </p>
                </div>
              )}
            </Show>
          </div>
        </div>

        <div class="overflow-hidden relative" ref={emblaRef}>
          <div class="flex">
            <For each={props.overview.posts}>
              {(post, index) => (
                <div class="min-w-0 transition-all"
                  classList={{
                    "flex-[0_0_auto] max-w-94%": props.overview.posts.length > 1,
                    "flex-[0_0_100%] max-w-full": props.overview.posts.length === 1,
                    "scale-98 opacity-60": activeIndex() !== index(),
                    "scale-100 opacity-100": activeIndex() === index()
                  }}
                >
                  <div class="relative">
                    <FeedFriendsPost
                      post={post}
                      postUserId={props.overview.user.id}
                    />
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>

      <div class="px-6 pt-4 mb-2">
        <p class="text-left">
          {activePost().caption}
        </p>

        <div class="text-sm font-300">
          <Show when={commentsSample().length > 0}>
            <div class="flex items-center gap-1 opacity-50">
              <MdiCommentOutline class="text-xs" />
              <p>See the comments</p>
            </div>
          </Show>

          <For each={commentsSample()}>
            {comment => (
              <div class="flex items-center gap-1">
                <p class="font-600">{comment.user.username}</p>
                <p>{comment.content}</p>
              </div>
            )}
          </For>

          <form onSubmit={handlePostComment} class="flex items-center gap-2 mt-2">
            <Show when={me.get()?.profilePicture} fallback={
              <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <p class="text-center font-500">{me.get()?.username[0] ?? "?"}</p>
              </div>
            }>
              {profilePicture => (
                <img
                  class="w-6 h-6 rounded-full shrink-0"
                  src={profilePicture().url}
                  alt={`Profile picture of ${me.get()!.username}`}
                />
              )}
            </Show>
            <input
              type="text"
              placeholder="Add a comment..."
              class="bg-transparent text-white outline-none w-full focus:bg-white/10 py-1 px-2 rounded-lg transition-colors"
              value={comment()}
              onInput={event => setComment(event.currentTarget.value)}
            />
            <button type="submit" class="bg-white/20 text-white py-1.5 px-2 rounded-lg disabled:bg-white/10 disabled:text-white/50 hover:bg-white/25 focus:bg-white/25 transition-colors"
              disabled={!comment().trim()}
            >
              <MdiSend class="text-xs" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
};

export default FeedFriendsOverview;
