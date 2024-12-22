import { createEffect, createSignal, Show, type Component } from "solid-js";
import { reverseGeocoding, type ReverseGeocoding } from "~/api/requests/geocoding/reverse";

const Location: Component<{
  latitude: number
  longitude: number
  class: string
}> = (props) => {
  const [geocoding, setGeocoding] = createSignal<ReverseGeocoding | null>(null);
  
  createEffect(async () => {
    const geocoding = await reverseGeocoding(props.latitude, props.longitude);
    setGeocoding(geocoding);
  })

  return (
    <Show when={geocoding()} fallback={
      <p class={props.class}>Finding location...</p>
    }>
      {geocoding => (
        <p class={props.class}>
          {geocoding().address.village || geocoding().address.city || geocoding().address.municipality}, {geocoding().address.country}
        </p>
      )}
    </Show>
  )
};

export default Location;
