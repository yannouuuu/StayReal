import { createResource, For, Show, type Component } from "solid-js";
import { person_me } from "../api";
import MdiChevronLeft from '~icons/mdi/chevron-left'

const ProfileView: Component = () => {
  const [me] = createResource(person_me);

  return (
    <>
      <header class="z-20 fixed top-0 inset-x-0 bg-gradient-to-b from-black to-transparent pb-2 pt-[env(safe-area-inset-top)]">
        <nav class="flex items-center justify-between px-4 pb-2 pt-4">
          <a href="/feed">
            <MdiChevronLeft class="text-xl" />
          </a>

          <a href="/settings">
            settings
          </a>
        </nav>
      </header>

      <main class="pt-16 space-y-8 mt-[env(safe-area-inset-top)]">
        <Show when={me()} fallback={<p>loading...</p>}>
          {me => (
            <>
              <div class="flex flex-col items-center text-center gap-4">
                <img
                  class="rounded-full h-42 w-42" src={me().profilePicture?.url}
                  alt={me().username}
                />

                <div class="flex flex-col">
                  <h1 class="text-2xl font-700 line-height-none">
                    {me().fullname}
                  </h1>
                  <p class="text-white/60">{me().username}</p>
                </div>
                
                <p>{me().biography}</p>
              </div>

              <div class="flex justify-center gap-2 md:gap-6">
                <For each={me().realmojis}>
                  {realmoji => (
                    <div class="relative flex-shrink-0">
                      <img
                        class="w-12 h-12 sm:(w-16 h-16) md:(w-20 h-20) rounded-full"
                        src={realmoji.media.url}
                        alt={realmoji.emoji}
                      />
                      <p class="text-xs sm:text-sm md:text-base absolute -bottom-2 -right-2 bg-black rounded-full p-1.5">
                        {realmoji.emoji}
                      </p>
                    </div>
                  )}
                </For>
              </div>

              <div>
                <p>
                  from {me().location} ({me().countryCode})
                </p>
                <p>
                  streak of {me().streakLength} days
                </p>
                <p>
                  birthday {new Date(me().birthdate).toLocaleDateString()}
                </p>
                <p>{me().phoneNumber}</p>
                <p>{me().gender}</p>
                <p>{me().region}</p>
                <p>is {me().isPrivate ? "private" : "public"}</p>
                <p class="text-white/50">
                  account created @ {new Date(me().createdAt).toLocaleString()}
                </p>
              </div>
            </>
          )}
        </Show>
      </main>
    </>
  )
};

export default ProfileView;
