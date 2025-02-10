import { type Component, createMemo, Show } from "solid-js";
import { Post } from "~/api/requests/feeds/friends";

const PostSmallComments: Component<{ post: Post }> = (props) => {
  // We fix the amount of comments to 9, to prevent the UI from breaking...
  const amount = createMemo(() => {
    let amount = props.post.comments.length;
    return amount <= 9 ? amount : 9;
  });

  return (
    <Show when={amount() > 0}>
      <div class="relative scale-80">
        <div class="absolute inset-x-0 top-.5">
          <p class="text-center text-black font-600 text-sm">{amount()}</p>
        </div>

        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.6665 22.0001V21.0001H8.6665H3.33317C2.89114 21.0001 2.46722 20.8245 2.15466 20.5119C1.8421 20.1994 1.6665 19.7754 1.6665 19.3334V3.33341C1.6665 2.89139 1.8421 2.46746 2.15466 2.1549C2.46722 1.84234 2.89114 1.66675 3.33317 1.66675H24.6665C25.1085 1.66675 25.5325 1.84234 25.845 2.1549C26.1576 2.46746 26.3332 2.89139 26.3332 3.33341V19.3334C26.3332 19.7754 26.1576 20.1994 25.845 20.5119C25.5325 20.8245 25.1085 21.0001 24.6665 21.0001H16.5332H16.1182L15.8251 21.2939L10.9038 26.2286C10.8153 26.3095 10.7281 26.3334 10.6665 26.3334H9.99984C9.91143 26.3334 9.82665 26.2983 9.76414 26.2358C9.70162 26.1733 9.6665 26.0885 9.6665 26.0001V22.0001Z" fill="white" stroke="black" stroke-width="2"/>
        </svg>
      </div>
    </Show>
  );
};

export default PostSmallComments;
