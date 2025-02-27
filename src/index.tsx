/* @refresh reload */
import "@unocss/reset/tailwind.css";
import '@fontsource-variable/inter';
import "virtual:uno.css";

import { lazy } from "solid-js";
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";

import SplashView from "~/views/splash";

const routes = [
  {
    path: "/",
    component: SplashView
  },
  {
    path: "/feed",
    component: lazy(() => import("~/views/feed"))
  },
  {
    path: "/login",
    component: lazy(() => import("~/views/login"))
  },
  {
    path: "/create-profile",
    component: lazy(() => import("~/views/create-profile"))
  },
  {
    path: "/profile",
    component: lazy(() => import("~/views/profile"))
  },
  {
    path: "/upload",
    component: lazy(() => import("~/views/upload"))
  },
  {
    path: "/friends",
    component: lazy(() => import("~/layouts/friends")),
    children: [
      {
        path: "/connections",
        component: lazy(() => import("~/views/friends/connections"))
      },
      {
        path: "/requests",
        component: lazy(() => import("~/views/friends/requests"))
      },
    ]
  },
  {
    path: "/settings",
    component: lazy(() => import("~/views/settings"))
  }
]

render(() => (
  <Router>
    {routes}
  </Router>
), document.getElementById("root") as HTMLDivElement);
