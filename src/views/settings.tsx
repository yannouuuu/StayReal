import { createSignal, type Component } from "solid-js";
import { getAuthDetails } from "@stayreal/api";
import auth from "../stores/auth";
import { useNavigate } from "@solidjs/router";

const Settings: Component = () => {
  const [output, setOutput] = createSignal("");
  const navigate = useNavigate();
  const storeAsJSON = () => JSON.stringify({
    deviceId: auth.store.deviceId,
    accessToken: auth.store.accessToken,
    refreshToken: auth.store.refreshToken
  }, null, 2);

  return (
    <div>
      <div class="flex flex-col gap-2">
        <button onClick={async () => {
          const output = await getAuthDetails();
          setOutput(JSON.stringify(output, null, 2));
        }}>
          read native auth details
        </button>

        <button onClick={async () => {
          auth.refresh();
        }}>
          make a manual refresh
        </button>

        <button onClick={async () => {
          await auth.logout();
          navigate("/");
        }}>
          logout
        </button>
      </div>

      <pre>
currently in the `auth` store:
{storeAsJSON()}
      </pre>

      <pre>
currently stored auth details:

{output() || "click the button above to read the native auth details"}
      </pre>
    </div>
  )
};

export default Settings;
