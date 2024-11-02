import { Component, createEffect, createSignal, For, onCleanup } from "solid-js";
import type { PostsOverview } from "../../../api/requests/feeds/friends";
import MdiDotsVertical from '~icons/mdi/dots-vertical';

import "swiper/css";
import "swiper/css/pagination";
import Swiper from "swiper";
import { Pagination } from "swiper/modules";

const FeedFriendsOverview: Component<{
  overview: PostsOverview
}> = (props) => {
  let container: HTMLDivElement | undefined;
  let pagination: HTMLDivElement | undefined;

  const [activeIndex, setActiveIndex] = createSignal(props.overview.posts.length - 1);
  const activePost = () => props.overview.posts[activeIndex()];

  createEffect(() => {
    if (!container || !pagination) return;

    const swiper = new Swiper(container, {
      slidesPerView: "auto",
      centeredSlides: true,
      watchOverflow: false,

      // initial to the latest post
      initialSlide: props.overview.posts.length - 1,

      modules: [Pagination],
      pagination: {
        enabled: true,
        el: pagination
      },

      on: {
        slideChange: (swiper) => setActiveIndex(swiper.activeIndex)
      }
    });

    onCleanup(() => swiper.destroy());
  });

  return (
    <div>
      <div class="flex items-center justify-between gap-4 px-4 pb-2">
        <div class="flex items-center gap-2">
          <img class="w-8 h-8 rounded-full" src={props.overview.user.profilePicture.url} alt={props.overview.user.username} />
          <div class="flex flex-col">
            <p class="font-600">{props.overview.user.username}</p>
            <p class="text-sm text-white/60">
              {new Date(activePost().postedAt).toLocaleTimeString()} - Late of {activePost().lateInSeconds} seconds
            </p>
          </div>
        </div>

        <MdiDotsVertical class="text-xl" />
      </div>
      
      <div class="swiper relative" ref={container}>
        <div class="swiper-wrapper">
          <For each={props.overview.posts}>
            {(post, index) => (
              <div class="swiper-slide w-fit! transition-all"
                style={{
                  transform: activeIndex() === index() ? "scale(1)" : "scale(.95)",
                  opacity: activeIndex() === index() ? 1 : .8
                }}
              >
                <div class="relative">
                  <div class="z-20 relative mx-auto w-fit">
                    <img class="z-30 h-40 w-auto absolute top-4 left-4 rounded-xl border-2 border-black shadow-lg" src={post.secondary.url} />
                    <img class="rounded-2xl w-auto max-h-80vh" src={post.primary.url} />
                  </div>

                  {/* overlay */}
                  <div class="z-25 absolute inset-x-0 h-50px bottom-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              </div>
            )}
          </For>
        </div>

        <div class="swiper-pagination" ref={pagination} />
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
