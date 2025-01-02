import {
  createResource,
  createSignal,
  For,
  Show,
  type Component,
} from "solid-js";
import MdiChevronRight from "~icons/mdi/chevron-right";
import MdiMagnify from "~icons/mdi/magnify";
import { relationships_friends } from "../api/requests/relationships/friends/list";

const FriendsView: Component = () => {
  const [friends] = createResource(relationships_friends);
  const [searchQuery, setSearchQuery] = createSignal("");

  const filteredFriends = () => {
    const query = searchQuery().toLowerCase();
    const friendsList = friends()?.data || [];

    if (!query) return friendsList;

    return friendsList.filter(
      (friend) =>
        friend.username.toLowerCase().includes(query) ||
        friend.fullname.toLowerCase().includes(query)
    );
  };

  return (
    <div>
      <header class="z-20 fixed top-0 inset-x-0 bg-gradient-to-b from-black to-transparent pt-[env(safe-area-inset-top)] max-h-[72px] h-full">
        <nav class="flex items-center justify-between px-4 pb-2 pt-4">
          <div class="w-8" />

          <p
            class="absolute inset-x-0 w-fit mx-auto text-2xl text-center text-white font-700"
            role="banner"
          >
            StayReal.
          </p>

          <a href="/feed" aria-label="Return Feed">
            <MdiChevronRight class="text-xl" />
          </a>
        </nav>
      </header>

      <div class="py-16 mt-[env(safe-area-inset-top)]">
        <div class="px-4 mb-6">
          <div class="relative flex items-center">
            <MdiMagnify class="absolute w-6 h-6 left-4 text-white/40 text-2xl" />
            <input
              type="text"
              value={searchQuery()}
              onInput={(e) => setSearchQuery(e.currentTarget.value)}
              placeholder="Add or search friends"
              class="w-full bg-[#121212] rounded-xl py-2.5 pl-14 pr-4 text-[16px] placeholder:text-white/55 focus:outline-none"
            />
          </div>
        </div>

        <Show
          when={friends()}
          fallback={
            <p class="text-center text-white/50">gathering your friends...</p>
          }
        >
          <main class="px-4">
            <p class="text-sm text-white/60 uppercase font-600 mb-4">
              My Friends ({filteredFriends().length})
            </p>

            <div class="flex flex-col gap-4">
              <For each={filteredFriends()}>
                {(friend) => (
                  <div class="flex items-center gap-4">
                    <div class="relative">
                      <Show
                        when={friend.profilePicture}
                        fallback={
                          <div class="rounded-full h-15 w-15 bg-white/20 flex items-center justify-center">
                            <span class="text-[24px] font-500 uppercase leading-[0] translate-y-[2px]">
                              {friend.username[0]}
                            </span>
                          </div>
                        }
                      >
                        {(profilePicture) => (
                          <img
                            class="rounded-full h-15 w-15"
                            src={profilePicture().url}
                            alt={friend.username}
                          />
                        )}
                      </Show>
                    </div>

                    <div class="flex flex-col">
                      <p class="font-500">{friend.fullname}</p>
                      <p class="text-sm text-white/60">@{friend.username}</p>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </main>
        </Show>
      </div>
    </div>
  );
};

export default FriendsView;
