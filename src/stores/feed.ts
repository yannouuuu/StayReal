import { createRoot, createSignal } from "solid-js";
import { feeds_friends, type FeedsFriends } from "~/api/requests/feeds/friends";
import auth from "~/stores/auth";

let interval: ReturnType<typeof setInterval> | undefined;
export default createRoot(() => {
  const [get, set] = createSignal<FeedsFriends>();
  const refetch = () => feeds_friends().then(set);

  if (interval) clearInterval(interval);
  interval = setInterval(() => {
    console.info("[store/feed]: refetching feed");
    if (!auth.store.deviceId) return;

    refetch();
  }, 10_000);
  

  return { get, set, refetch };
});
