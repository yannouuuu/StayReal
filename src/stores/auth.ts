import { createRoot } from "solid-js";
import { createStore } from "solid-js/store";
import { makePersisted } from "@solid-primitives/storage"
import { auth_refresh } from "../api";

export default createRoot(() => {
  const [store, set] = makePersisted(createStore({
    deviceID: "",
    accessToken: "",
    refreshToken: "",
  }), { name: "auth" });

  const refresh = async () => {
    const tokens = await auth_refresh();

    set({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    });
  };

  return { store, set, refresh };
});
