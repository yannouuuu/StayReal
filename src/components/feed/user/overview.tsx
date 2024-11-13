import { createEffect, createSignal, For, onCleanup, type Component } from "solid-js";
import type { PostsOverview } from "../../../api/requests/feeds/friends";
import PostRealMojis from "../realmojis";
import { useNavigate } from "@solidjs/router";
import MdiPlus from '~icons/mdi/plus'

import "swiper/css";
import Swiper from "swiper";

const FeedUserOverview: Component<{overview: PostsOverview}> = (props) => {
  let container: HTMLDivElement | undefined;
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = createSignal(props.overview.posts.length - 1);
  const activePost = () => props.overview.posts[activeIndex()];

  createEffect(() => {
    if (!container) return;

    const swiper = new Swiper(container, {
      spaceBetween: 12,
      slidesPerView: "auto",
      centeredSlides: true,
      initialSlide: props.overview.posts.length - 1,

      on: {
        slideChange: (swiper) => {
          if (swiper.activeIndex === swiper.slides.length - 1) {
            // prevent sliding to the "add post" slide
            swiper.slideTo(swiper.slides.length - 2);
          }
          else {
            setActiveIndex(swiper.activeIndex)
          }
        },
        click: (swiper) => {
          // when clicking on the "add post" slide, redirect to upload page
          if (swiper.clickedIndex === swiper.slides.length - 1) {
            navigate("/upload");
          }
          else {
            swiper.slideTo(swiper.clickedIndex);
          }
        }
      }
    });

    onCleanup(() => swiper.destroy());
  });

  return (
    <article role="article">
      <div class="swiper" ref={container}>
        <div class="swiper-wrapper py-5">
          <For each={props.overview.posts}>
            {(post, index) => (
              <div class="relative swiper-slide w-fit! transition-all duration-300"
                style={{
                  transform: activeIndex() === index() ? "scale(1)" : "scale(.9)",
                  opacity: activeIndex() === index() ? 1 : .5
                }}
              >
                <img
                  class="h-11 w-auto absolute top-1 left-1 z-10 rounded-md border border-black shadow-lg"
                  src={post.secondary.url}
                  alt="Secondary image"
                />
                <img
                  class="rounded-lg h-140px"
                  src={post.primary.url}
                  alt="Primary image"
                />

                <div class="absolute flex justify-center z-20 -bottom-4 inset-x-0">
                  <PostRealMojis post={post} />
                </div>
              </div>
            )}
          </For>

          <a href="/upload"
            class="scale-90! swiper-slide rounded-lg h-140px! border-2 border-white/75 px-4 flex! items-center justify-center w-100px! text-center"
            aria-label="Make a new BeReal."
          >
            <MdiPlus class="text-3xl" />
          </a>
        </div>
      </div>

      <p class="text-sm text-center w-fit mx-auto">
        {activePost().caption}
      </p>
      <p class="text-sm text-center text-white/50">
        <time>
          {new Date(activePost().postedAt).toLocaleString()}
        </time>
      </p>
    </article>
  );
};

export default FeedUserOverview;
