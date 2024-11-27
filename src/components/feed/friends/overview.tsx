import { Component, createEffect, createSignal, For, Show } from "solid-js";
import type { PostsOverview } from "~/api/requests/feeds/friends";
import createEmblaCarousel from 'embla-carousel-solid'
import MdiDotsVertical from '~icons/mdi/dots-vertical';

import FeedFriendsPost from "./post";
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
import type { EmblaCarouselType } from "embla-carousel";

const FeedFriendsOverview: Component<{
  overview: PostsOverview
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

    api.on('select', setActiveNode)
  })

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
            <p class="font-600 w-fit">
              {props.overview.user.username}
            </p>
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
                  <FeedFriendsPost post={post} />
                </div>
              </div>
            )}
          </For>
        </div>
      </div>

      <div class="px-4 pt-4">
        <p class="text-center">
          {activePost().caption}
        </p>
      </div>
    </div>
  )
};

export default FeedFriendsOverview;
