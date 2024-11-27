import { For, Show, type Component } from "solid-js";
import type { PostsOverview } from "~/api/requests/feeds/friends";

/**
 * RealMojis attributed to a given post.
 * 
 * Shows as three realmojis, first two are actual realmojis
 * and the third one is a count of remaining realmojis.
 * 
 * It's negatively spaced to show the realmojis in a row.
 */
const PostRealMojis: Component<{ post: PostsOverview["posts"][number] }> = (props) => {
  const sample = () => props.post.realMojis.slice(0, 2);
  const total = () => {
    let amount = props.post.realMojis.length - 2;
    // just display +9 if total is more than 9
    if (amount > 9) return 9;

    return amount
  }

  return (
    <Show when={props.post.realMojis.length > 0}>
      <div class="flex -space-x-2" role="button" aria-label={`See the ${props.post.realMojis.length} RealMojis.`}>
        <For each={sample()}>
          {realMojis => (
            <img class="w-8 h-8 rounded-full border-2 border-black" src={realMojis.media.url} aria-hidden="true" />
          )}
        </For>
        <Show when={total() > 0}>
          <div class="w-8 h-8 rounded-full border-2 border-black bg-#1a1a1c text-white flex justify-center items-center" aria-hidden="true">
            <p class="text-xs">
              +{total()}
            </p>
          </div>
        </Show>
      </div>
    </Show>
  )
};

export default PostRealMojis;
