import { createRoot } from "solid-js";
import { createStore } from "solid-js/store";
import { makePersisted } from "@solid-primitives/storage"

export default createRoot(() => {
  const [store, set] = makePersisted(createStore({
    deviceID: "",
    accessToken: "",
    refreshToken: "",
  }), { name: "auth" });

  return { store, set };
});
