import { createEffect, createResource, createSignal, For, onCleanup, Show, type Component } from "solid-js";
import { feeds_friends, PostsOverview } from "../api/requests/feeds/friends";

import "swiper/css";
import Swiper from "swiper";
import UserPostedRealMojis from "../components/feed/realmojis";

const FeedView: Component = () => {
  const [feed] = createResource(feeds_friends);

  const SwipingUserPosts: Component<{overview: PostsOverview}> = (props) => {
    let container: HTMLDivElement | undefined;
    let pagination: HTMLDivElement | undefined;

    const [activeIndex, setActiveIndex] = createSignal(0);
    const activePost = () => props.overview.posts[activeIndex()];

    createEffect(() => {
      if (!container || !pagination) return;

      const swiper = new Swiper(container, {
        spaceBetween: 12,
        slidesPerView: "auto",
        centeredSlides: true,
        
        pagination: {
          el: pagination
        },

        on: {
          slideChange: () => setActiveIndex(swiper.activeIndex)
        }
      });

      onCleanup(() => swiper.destroy());
    });

    return (
      <div>
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
                  <img class="h-11 w-auto absolute top-1 left-1 z-10 rounded-md border border-black shadow-lg" src={post.secondary.url} />
                  <img class="rounded-lg h-140px" src={post.primary.url} />

                  <div class="absolute flex justify-center z-20 -bottom-4 inset-x-0 -space-x-2">
                    <UserPostedRealMojis post={post} />
                  </div>
                </div>
              )}
            </For>
          </div>

          <div ref={pagination} />
        </div>

        <p class="text-sm text-center">
          {activePost().caption}
        </p>
        <p class="text-sm text-center text-white/50">
          {new Date(activePost().postedAt).toLocaleString()}
        </p>
      </div>
    )
  }

  return (
    <div>
      <header class="z-20 fixed top-0 inset-x-0 bg-gradient-to-b from-black to-transparent py-2">
        <nav class="flex items-center justify-between px-4 py-1">
          <p>friends</p>

          <p class="absolute inset-x-0 w-fit mx-auto text-2xl text-center text-white font-700">StayReal.</p>

          <a href="/profile">
            <img
              src={feed()?.userPosts.user.profilePicture.url}
              alt={feed()?.userPosts.user.username}
              class="w-8 h-8 rounded-full"
            />
          </a>
        </nav>
      </header>

      <main class="pt-16">
        <Show when={feed()} fallback={<p>loading...</p>}>
          {feed => (
            <>
              <SwipingUserPosts overview={feed().userPosts} />

              <div class="mt-8">
                <For each={[...feed().friendsPosts].sort((a, b) => new Date(b.posts[0].postedAt).getTime() - new Date(a.posts[0].postedAt).getTime())}>
                  {overview => (
                    <div>
                      <div class="flex items-center gap-2">
                        <img class="w-8 h-8 rounded-full" src={overview.user.profilePicture.url} alt={overview.user.username} />
                        <div class="flex flex-col">
                          <p class="font-600">{overview.user.username}</p>
                          
                        </div>
                      </div>
                      
                      <For each={overview.posts}>
                        {post => (
                          <div class="max-w-420px">
                            <p>Late of {post.lateInSeconds} seconds</p>
                            <p>{new Date(post.postedAt).toLocaleTimeString()}</p>

                            <div class="relative">
                              <img class="h-40 w-auto absolute top-4 left-4 z-10 rounded-lg border border-black shadow-lg" src={post.secondary.url} />
                              <img class="rounded-xl" src={post.primary.url} />
                            </div>
                          </div>
                        )}
                      </For>
                    </div>
                  )}
                </For>
              </div>
            </>
          )}
        </Show>
      </main>
    </div>
  )
};

export default FeedView;
