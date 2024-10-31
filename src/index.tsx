/* @refresh reload */
import "virtual:uno.css";
import "@unocss/reset/tailwind.css";
import { render } from "solid-js/web";
import LoginView from "./views/login";

render(() => <LoginView />, document.getElementById("root") as HTMLElement);
