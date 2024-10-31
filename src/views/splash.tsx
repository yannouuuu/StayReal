import { createEffect, type Component } from "solid-js";
import { useNavigate } from "@solidjs/router";
import auth from "../stores/auth";

const SplashView: Component = () => {
  const navigate = useNavigate();

  createEffect(() => {
    if (auth.store.accessToken && auth.store.refreshToken) {
      navigate("/feed");
    }
    else {
      navigate("/login");
    }
  })

  return (
    <div>
      <h1>StayReal.</h1>
      <p>Loading your data...</p>
    </div>
  )
};

export default SplashView;