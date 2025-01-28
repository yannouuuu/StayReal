import { type Component, createSignal, Show } from "solid-js";
import type { ApiMedia } from "~/api/types/media";

const ProfilePicture: Component<{
  media: ApiMedia | null | undefined
  fullName: string | undefined
  username: string
  size: number
}> = (props) => {
  const [isUnavailable, setUnavailable] = createSignal(false);
  const name = () => props.fullName || props.username;

  const style = () => ({
    width: `${props.size}px`,
    height: `${props.size}px`
  });

  return (
    <Show
      when={!isUnavailable() && props.media}
      fallback={
        <div
          class="rounded-full bg-white/20 flex items-center justify-center"
          style={style()}
        >
          <span class="text-[24px] font-500 uppercase leading-[0] translate-y-[2px]">
            {name()[0]}
          </span>
        </div>
      }
    >
      {(media) => (
        <img
          class="rounded-full"
          src={media().url}
          alt={name()}
          onError={() => setUnavailable(true)}
          style={style()}
        />
      )}
    </Show>
  )
};

export default ProfilePicture;
