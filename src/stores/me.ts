import { createRoot, createSignal } from "solid-js";
import { person_me, type PersonMe } from "~/api";

/**
 * A small signal store to keep track
 * of the current user details.
 */
export default createRoot(() => {
  const STORAGE_KEY = "person_me";
  const INITIAL_DATA = localStorage.getItem(STORAGE_KEY);
  
  const [get, _set] = createSignal<PersonMe>(INITIAL_DATA && JSON.parse(INITIAL_DATA));
  const refetch = () => person_me().then(set);

  const set = (value: PersonMe): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    _set(value);
  }

  return { get, set, refetch };
});
