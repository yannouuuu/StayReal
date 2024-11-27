import { type Component, createSignal } from "solid-js";
import { FeedPost } from "~/api/requests/feeds/friends";
import PostRealMojis from "~/components/feed/realmojis";

const FeedFriendsPost: Component<{ post: FeedPost }> = (props) => {
  const [isReversed, setIsReversed] = createSignal(false);

  const primaryURL = () => isReversed() ? props.post.secondary.url : props.post.primary.url;
  const secondaryURL = () => isReversed() ? props.post.primary.url : props.post.secondary.url;

  return (
    <div class="z-20 relative mx-auto w-fit">
      <img
        class="z-30 h-40 w-auto absolute top-4 left-4 rounded-xl border-2 border-black shadow-lg"
        onClick={() => setIsReversed(prev => !prev)}
        alt="Secondary image"
        src={secondaryURL()}
      />

      <img
        class="rounded-2xl max-h-80vh"
        alt="Primary image"
        src={primaryURL()}
      />

      {/* dimmed background overlay */}
      <div class="z-25 absolute inset-x-0 h-50px bottom-0 bg-gradient-to-t from-black/50 to-transparent" />
      
      {/* small realmojis in the bottom left */}
      <div class="w-fit">
        <div class="absolute z-30 bottom-4 left-4">
          <PostRealMojis post={props.post} />
        </div>
      </div>
    </div>
  );
};

export default FeedFriendsPost;
