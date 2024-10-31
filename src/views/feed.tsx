import { createResource, For, Show, type Component } from "solid-js";
import { feeds_friends } from "../api/requests/feeds/friends";

const FeedView: Component = () => {
  const [feed] = createResource(feeds_friends);

  return (
    <div>
      <header class="z-20 fixed top-0 inset-x-0 bg-gradient-to-b from-black to-transparent py-2">
        <nav class="flex items-center justify-between px-4">
          <p>friends</p>
          <p class="text-lg text-center text-white font-600">StayReal.</p>
          <a href="/profile">
            <img src={feed()?.userPosts.user.profilePicture.url} alt={feed()?.userPosts.user.username} class="w-8 h-8 rounded-full" />
          </a>
        </nav>
      </header>

      <main class="pt-16">
        <Show when={feed()} fallback={<p>loading...</p>}>
          {feed => (
            <>
              <div class="flex overflow-x-auto">
                <For each={feed().userPosts.posts}>
                  {post => (
                    <div class="max-w-140px w-full flex-shrink-0">
                      <div class="relative h-auto">
                        <img class="h-16 w-auto absolute top-2 left-2 z-10 rounded-lg border border-black shadow-lg" src={post.secondary.url} />
                        <img class="rounded-xl" src={post.primary.url} />
                      </div>

                      <p class="text-sm">
                        {post.caption}
                      </p>
                    </div>
                  )}
                </For>
              </div>

              <div>
                <For each={[...feed().friendsPosts].sort((a, b) => new Date(b.posts[0].postedAt).getTime() - new Date(a.posts[0].postedAt).getTime())}>
                  {overview => (
                    <div>
                      <div class="flex items-center gap-2">
                        <img class="w-8 h-8 rounded-full" src={overview.user.profilePicture.url} alt={overview.user.username} />
                        <p>{overview.user.username}</p>
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
