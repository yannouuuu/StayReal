import { type Component, createSignal } from "solid-js";
import { FeedPost } from "../../../api/requests/feeds/friends";

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
        class="rounded-2xl w-auto max-h-80vh"
        alt="Primary image"
        src={primaryURL()}
      />
    </div>
  );
};

export default FeedFriendsPost;
