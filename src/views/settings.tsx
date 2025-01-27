import { JSXElement, type Component } from "solid-js";
import auth from "../stores/auth";
import { useNavigate } from "@solidjs/router";
import MdiChevronLeft from '~icons/mdi/chevron-left'
import MdiLogout from '~icons/mdi/logout'
import MdiGithub from '~icons/mdi/github'
import { open } from "@tauri-apps/plugin-shell";

const Settings: Component = () => {
  const navigate = useNavigate();

  const Entry: Component<{ title: string, icon: JSXElement, onClick: () => void }> = (props) => (
    <button
      type="button"
      onClick={props.onClick}
      class="flex items-center justify-between w-full px-4 py-2 bg-white/10 rounded-lg"
    >
      <div class="flex items-center gap-4">
        {props.icon}
        <p>{props.title}</p>
      </div>
    </button>
  );

  return (
    <>
      <header class="pt-[env(safe-area-inset-top)]">
        <nav class="flex items-center justify-between px-4 pb-2 pt-4">
          <a href="/profile">
            <MdiChevronLeft class="text-xl" />
          </a>
        </nav>
      </header>

      <div class="p-4">
        <div class="flex flex-col gap-2">
          <Entry title="Logout" icon={<MdiLogout />} onClick={async () => {
            await auth.logout();
            navigate("/");
          }} />
          <Entry title="Report an issue on GitHub" icon={<MdiGithub />} onClick={() => {
            open("https://github.com/Vexcited/StayReal/issues");
          }} />
        </div>
      </div>
    </>
  )
};

export default Settings;
