import { createSignal, For, onMount, Show, type Component } from "solid-js";
import { feeds_friends, type FeedsFriends } from "../api/requests/feeds/friends";
import { person_me, type PersonMe } from "../api";
import FeedFriendsOverview from "../components/feed/friends/overview";
import MdiPeople from '~icons/mdi/people';
import MdiRefresh from '~icons/mdi/refresh'

import FeedUserOverview from "../components/feed/user/overview";
import PullableScreen from "../components/pullable-screen";
import { fetchLastMoment, type Moment } from "tauri-plugin-bereal-api";
import { askNotificationPermission } from "../utils/notification-permission";

const FeedView: Component = () => {
  const [me, setMe] = createSignal<PersonMe>();
  const [feed, setFeed] = createSignal<FeedsFriends>();
  const [moment, setMoment] = createSignal<Moment>();

  const [isRefreshing, setIsRefreshing] = createSignal(false);
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);

      await person_me().then(setMe);
      await Promise.all([
        feeds_friends().then(setFeed),
        fetchLastMoment().then(setMoment)
      ])
    }
    finally {
      setIsRefreshing(false);
    }
  };

  onMount(() => Promise.all([
    askNotificationPermission(),
    handleRefresh()
  ]));

  return (
    <div>
      <header class="z-20 fixed top-0 inset-x-0 bg-gradient-to-b from-black to-transparent pt-[env(safe-area-inset-top)]">
        <nav class="flex items-center justify-between px-4 pb-2 pt-4">
          <a href="/friends" aria-label="Relationships">
            <MdiPeople class="text-xl" />
          </a>

          <p class="absolute inset-x-0 w-fit mx-auto text-2xl text-center text-white font-700" role="banner">
            StayReal.
          </p>

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

            <a href="/profile" aria-label="My profile">
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
      
      <div class="py-16 mt-[env(safe-area-inset-top)]">
        <PullableScreen onRefresh={handleRefresh}>
          <main>
            <Show when={feed()} fallback={
              <p class="text-center text-white/50">
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
                    {overview => <FeedUserOverview overview={overview()} />}
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
        </PullableScreen>
      </div>
    </div>
  )
};

export default FeedView;
