import { For, Show, type Component } from "solid-js";
import type { PostsOverview } from "../../api/requests/feeds/friends";

/**
 * realmojis under the post that the user made.
 * this one is specifically done for the
 * posts at the top of the feed view.
 */
const UserPostedRealMojis: Component<{ post: PostsOverview["posts"][number] }> = (props) => {
  const sample = () => props.post.realMojis.slice(0, 2);
  const total = () => {
    let amount = props.post.realMojis.length - 2;
    // just display +9 if total is more than 9
    if (amount > 9) return 9;

    return amount
  }

  // we should limit to two realmojis
  // and show total count of realmojis on third
  return (
    <>
      <For each={sample()}>
        {realMojis => (
          <img class="w-8 h-8 rounded-full border-2 border-black" src={realMojis.media.url} />
        )}
      </For>
      <Show when={total() > 0}>
        <div class="w-8 h-8 rounded-full border-2 border-black bg-#1a1a1c text-white flex justify-center items-center">
          <p class="text-xs">
            +{total()}
          </p>
        </div>
      </Show>
    </>
  )
};

export default UserPostedRealMojis;
