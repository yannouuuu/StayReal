import { createRoot, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { refreshToken, getAuthDetails, type AuthDetails, setAuthDetails, clearAuthDetails } from "tauri-plugin-bereal-api";

export default createRoot(() => {
  const [store, setStore] = createStore<{ loading: boolean } & AuthDetails>({
    loading: true,
    deviceId: "",
    accessToken: "",
    refreshToken: "",
  });

  const refresh = async () => {
    await refreshToken(); // refresh it natively
    const mutation = await getAuthDetails();
    setStore({ ...mutation });
  };

  const save = async (mutation: AuthDetails) => {
    await setAuthDetails(mutation);
    setStore(mutation);
  };

  const logout = async () => {
    await clearAuthDetails();
    setStore({
      loading: false,
      deviceId: "",
      accessToken: "",
      refreshToken: "",
    });
  }

  onMount(async () => {
    try {
      const tokens = await getAuthDetails();
      setStore({
        loading: false,
        ...tokens
      });
    }
    catch { // probably never authenticated before
      setStore({ loading: false });
    }
  });

  return { store, save, refresh, logout };
});
