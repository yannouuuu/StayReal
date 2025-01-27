import { createRoot, createSignal } from "solid-js";
import { person_me, type PersonMe } from "~/api/requests/person/me";

/**
 * A small signal store to keep track
 * of the current user details.
 */
export default createRoot(() => {
  const STORAGE_KEY = "person_me";
  const INITIAL_DATA = localStorage.getItem(STORAGE_KEY);

  const [get, _set] = createSignal(INITIAL_DATA ? <PersonMe>JSON.parse(INITIAL_DATA) : null);
  const refetch = () => person_me().then(set);

  const set = (value: PersonMe): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    _set(value);
  };

  const clear = (): void => {
    localStorage.removeItem(STORAGE_KEY);
    _set(null);
  };

  return { get, set, clear, refetch };
});
