import { createRoot, createSignal } from "solid-js";
import { person_me, type PersonMe } from "~/api";

/**
 * A small signal store to keep track
 * of the current user details.
 */
export default createRoot(() => {
  const [get, set] = createSignal<PersonMe>();
  const refetch = () => person_me().then(set);

  return { get, set, refetch };
});
