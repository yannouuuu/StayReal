import { type } from "@tauri-apps/plugin-os";
import {
  createResource,
  createSignal,
  For,
  Show,
  type Component,
} from "solid-js";
import me from "~/stores/me";

import MdiChevronRight from "~icons/mdi/chevron-right";
import MdiMagnify from "~icons/mdi/magnify";
import MdiShareVariant from "~icons/mdi/share-variant";

import { relationships_friends } from "../api/requests/relationships/friends/list";

const isAndroid = type() === "android";

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

      <div class="py-16">
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

        <div class="fixed bottom-8 left-4 right-4 z-50">
          <div
            class="bg-[#1a1a1a]/80 rounded-full p-0.75 flex items-center justify-between shadow-lg shadow-black/20"
            classList={{
              "backdrop-blur-sm backdrop-brightness-50": !isAndroid,
            }}
          >
            <For
              each={[
                { label: "Suggestions", path: "/friends/suggestions" },
                { label: "Connections", path: "/friends" },
                { label: "Requests", path: "/friends/requests" },
              ]}
            >
              {(tab) => (
                <a
                  href={tab.path}
                  class="flex-1 px-4 py-2 rounded-full text-center text-[14px] font-semibold transition-colors"
                  classList={{
                    "bg-[#2a2a2a] !py-1.5 text-white":
                      tab.label === "Connections",
                    "text-white/80": tab.label !== "Connections",
                  }}
                >
                  {tab.label}
                </a>
              )}
            </For>
          </div>
        </div>

        <div class="px-4 mb-6 cursor-pointer focus:scale-[0.98] active:scale-95 transition-transform">
          <div class="relative bg-[#121212] rounded-2xl p-3.5 overflow-hidden">
            <Show when={me.get()?.profilePicture}>
              {(profilePicture) => (
                <div
                  class="absolute inset-0 opacity-30 bg-cover bg-center scale-120"
                  classList={{ "blur-xl": !isAndroid }}
                  style={{
                    "background-image": `url(${profilePicture().url})`,
                  }}
                />
              )}
            </Show>

            <div
              class="relative flex items-center justify-between cursor-pointer"
              onClick={async () => {
                const shareUrl = `bere.al/${me.get()?.username}`;
                await navigator.clipboard.writeText(shareUrl);

                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: "Join me on BeReal.",
                      text: "Add me on BeReal.!",
                      url: shareUrl,
                    });
                  } catch (err) {
                    console.log("Share failed");
                  }
                }
              }}
            >
              <div class="flex items-center gap-4">
                <Show
                  when={me.get()?.profilePicture}
                  fallback={
                    <div class="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center flex-shrink">
                      <p class="text-white/90">
                        {me.get()?.username[0] || "?"}
                      </p>
                    </div>
                  }
                >
                  {(profilePicture) => (
                    <img
                      class="w-11 h-11 rounded-full"
                      src={profilePicture().url}
                      alt={me.get()?.username}
                    />
                  )}
                </Show>
                <div class="flex flex-col gap-0.5">
                  <p class="text-white font-500 text-[15px]">
                    Invite friends on BeReal.
                  </p>
                  <p class="text-sm text-white/50">
                    bere.al/{me.get()?.username}
                  </p>
                </div>
              </div>
              <MdiShareVariant class="text-[22px] text-white" />
            </div>
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

            <div class="flex flex-col gap-2">
              <For each={filteredFriends()}>
                {(friend) => (
                  <div class="flex items-center gap-4 p-1.5 rounded-lg cursor-pointer focus:scale-[0.98] active:scale-95 transition-transform">
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
