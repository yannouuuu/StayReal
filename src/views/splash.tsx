import { createEffect, type Component } from "solid-js";
import { useNavigate } from "@solidjs/router";
import auth from "../stores/auth";

const SplashView: Component = () => {
  const navigate = useNavigate();

  createEffect(() => {
    // let's just wait for the auth store to finish loading...
    if (auth.store.loading) return;

    // redirect to the appropriate page based on the final auth state.
    if (auth.store.accessToken && auth.store.refreshToken)
      navigate("/feed");
    else
      navigate("/login");
  })

  return (
    <div class="h-100dvh flex items-center justify-center">
      <h1 class="text-2xl">
        StayReal.
      </h1>
      <p class="pt-2">
        Let's get real.
      </p>
    </div>
  )
};

export default SplashView;