import { createEffect, createResource, createSignal, For, onCleanup, Show, type Component } from "solid-js";
import { feeds_friends, PostsOverview } from "../api/requests/feeds/friends";
import UserPostedRealMojis from "../components/feed/realmojis";
import { moments_last, person_me } from "../api";
import FeedFriendsOverview from "../components/feed/friends/overview";
import MdiPeople from '~icons/mdi/people';
import MdiRefresh from '~icons/mdi/refresh'
import MdiPlus from '~icons/mdi/plus'

import "swiper/css";
import Swiper from "swiper";
import { useNavigate } from "@solidjs/router";

const FeedView: Component = () => {
  const navigate = useNavigate();
  const [me] = createResource(person_me);
  const [moment, { refetch: refetchMoment }] = createResource(me, (me) => moments_last(me.region))
  const [feed, { refetch: refetchFeed }] = createResource(feeds_friends);

  const [isRefreshing, setIsRefreshing] = createSignal(false);
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);

      await refetchMoment();
      await refetchFeed();
    }
    finally {
      setIsRefreshing(false);
    }
  };

  const SwipingUserPosts: Component<{overview: PostsOverview}> = (props) => {
    let container: HTMLDivElement | undefined;

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

            <div class="scale-90! swiper-slide rounded-lg h-140px! border-2 border-white/75 px-4 flex! items-center justify-center w-100px! text-center">
              <MdiPlus class="text-3xl" />
            </div>
          </div>
        </div>

        <p class="text-sm text-center">
          {activePost().caption}
        </p>
        <p class="text-sm text-center text-white/50">
          {new Date(activePost().postedAt).toLocaleString()}
        </p>
      </div>
    );
  };

  return (
    <div>
      <header class="z-20 fixed top-0 inset-x-0 bg-gradient-to-b from-black to-transparent py-2">
        <nav class="flex items-center justify-between px-4 py-1">
          <MdiPeople class="text-xl" />

          <p class="absolute inset-x-0 w-fit mx-auto text-2xl text-center text-white font-700">StayReal.</p>

          <div class="flex gap-4 items-center">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing()}
              title="Refresh feed & last moment"
            >
              <MdiRefresh class="text-white text-2xl rounded-full p-1"
                classList={{
                  "animate-spin text-white/50 bg-white/10": isRefreshing()
                }}
              />
            </button>

            <a href="/profile">
              <Show when={me()?.profilePicture}
                fallback={
                  <div>
                    <p>{me()?.username[0] || "?"}</p>
                  </div>
                }
              >
                {profilePicture => (
                  <img
                    class="w-8 h-8 rounded-full"
                    src={profilePicture().url}
                    alt={me()?.username}
                  />
                )}
              </Show>
            </a>
          </div>
        </nav>
      </header>

      <main class="py-16">
        <Show when={feed()} fallback={
          <p class="text-center">
            finding your feed...
          </p>
        }>
          {feed => (
            <>
              <Show when={feed().userPosts} fallback={
                <div class="text-center flex flex-col gap-1 px-4 mx-4 bg-white/10 py-4 rounded-2xl">
                  <p class="mb-4">
                    You haven't posted any BeReal today !
                  </p>

                  <a href="/upload" class="block text-center py-3 font-600 bg-white text-black rounded-2xl">
                    StayReal by posting a BeReal.
                  </a>

                  <Show when={moment()}>
                    {moment => (
                      <p class="text-white/50 mt-1 text-xs">
                        Last moment was at {new Date(moment().startDate).toLocaleTimeString()}
                      </p>
                    )}
                  </Show>
                </div>
              }>
                {overview => <SwipingUserPosts overview={overview()} />}
              </Show>

              <div class="flex flex-col gap-6 mt-8">
                <For each={[...feed().friendsPosts].sort((a, b) => new Date(b.posts[b.posts.length - 1].postedAt).getTime() - new Date(a.posts[a.posts.length - 1].postedAt).getTime())}>
                  {overview => <FeedFriendsOverview overview={overview} />}
                </For>
              </div>

              <section class="pt-16 px-8">
                <p class="text-center text-white/50">
                  You're at the end of your feed, come back later !
                </p>
              </section>
            </>
          )}
        </Show>
      </main>
    </div>
  )
};

export default FeedView;
