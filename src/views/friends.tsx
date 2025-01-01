import { createResource, For, Show, type Component } from "solid-js";
import MdiChevronRight from "~icons/mdi/chevron-right";
import { relationships_friends } from "../api/requests/relationships/friends/list";

const FriendsView: Component = () => {
  const [friends] = createResource(relationships_friends);

  return (
    <div class="pt-[env(safe-area-inset-top)] pb-20vh mb-[env(safe-area-inset-bottom)]">
      <header class="mb-12">
        <nav class="flex items-center justify-end px-4 pb-2 pt-4">
          <a href="/feed">
            <MdiChevronRight class="text-xl" />
          </a>
        </nav>
      </header>

      <Show
        when={friends()}
        fallback={
          <p class="text-center text-white/50">gathering your friends...</p>
        }
      >
        {(friends) => (
          <main class="px-4">
            <p class="text-sm text-white/60 uppercase font-600 mb-4">
              My Friends ({friends()?.total})
            </p>

            <div class="flex flex-col gap-4">
              <For each={friends().data}>
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
        )}
      </Show>
    </div>
  );
};

export default FriendsView;
