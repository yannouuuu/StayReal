import { Component, createEffect, createSignal, For, type Setter, Show } from "solid-js";
import type { PostsOverview } from "~/api/requests/feeds/friends";
import createEmblaCarousel from 'embla-carousel-solid'
import MdiDotsVertical from '~icons/mdi/dots-vertical';
import MdiRepost from '~icons/mdi/repost';

import FeedFriendsPost from "./post";
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
import type { EmblaCarouselType } from "embla-carousel";

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

  return (
    <div>
      <div class="flex items-center justify-between gap-4 px-4 pb-2">
        <div class="flex items-center gap-2">
        <Show when={props.overview.user.profilePicture} fallback={
            <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <p class="text-center font-500">{props.overview.user.username[0]}</p>
            </div>
          }>
            {profilePicture => (
              <img
                class="w-8 h-8 rounded-full"
                src={profilePicture().url}
                alt={`Profile picture of ${props.overview.user.username}`}
              />
            )}
          </Show>
          <div class="flex flex-col">
            <div class="flex items-center gap-3">
              <p class="font-600 w-fit">
                {props.overview.user.username}
              </p>
              <Show when={activePost().origin === "repost"}>
                <p class="text-white/80 flex items-center gap-1 bg-white/20 pl-2 pr-2.5 rounded-full text-sm">
                  <MdiRepost /> {activePost().parentPostUsername}
                </p>
              </Show>
            </div>
              
            <div class="text-sm text-white/60 flex flex-wrap gap-1.5">
              <time>
                <span class="tts-only">Posted at</span> {new Date(activePost().postedAt).toLocaleTimeString()}
              </time>
              <Show when={props.overview.posts[0].lateInSeconds > 0}>
                <span aria-hidden="true">-</span>
                <p>
                  Late of {props.overview.posts[0].lateInSeconds} seconds
                </p>
              </Show>
            </div>
          </div>
        </div>

        <MdiDotsVertical class="text-xl" />
      </div>
      
      <div class="overflow-hidden relative" ref={emblaRef}>
        <div class="flex">
          <For each={props.overview.posts}>
            {(post, index) => (
              <div class="min-w-0  transition-all"
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

      <div class="px-6 pt-4">
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

          <div class="opacity-50 flex items-center gap-2 mt-2">
            <div class="rounded-full w-6 h-6 bg-warmGray shrink-0" />
            <button type="button" class="w-full text-left">
              Add a comment...
            </button>
          </div>
        </div>
      </div>
    </div>
  )
};

export default FeedFriendsOverview;
