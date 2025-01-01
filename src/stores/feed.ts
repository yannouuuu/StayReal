import { createRoot, createSignal } from "solid-js";
import { feeds_friends, type FeedsFriends } from "~/api/requests/feeds/friends";

export default createRoot(() => {
  const STORAGE_KEY = "feeds_friends";
  const INITIAL_DATA = localStorage.getItem(STORAGE_KEY);

  const [get, _set] = createSignal<FeedsFriends>(INITIAL_DATA && JSON.parse(INITIAL_DATA));
  const refetch = () => feeds_friends().then(set);

  const set = (value: FeedsFriends): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    _set(value);
  }

  return { get, set, refetch };
});
