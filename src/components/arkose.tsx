import { createScriptLoader } from "@solid-primitives/script-loader";
import { onMount, type Component } from "solid-js";

const ARKOSE_DATA_CALLBACK = "__arkose__callback__";

const Arkose: Component<{
  key: string
  onLoad: (arkose: any) => void
  onVerify: (token?: string) => void
}> = (props) => {
  createScriptLoader({
    src: `https://client-api.arkoselabs.com/v2/${props.key}/api.js`,
    async: true,
    defer: true,
    "data-callback": ARKOSE_DATA_CALLBACK,
  });

  onMount(() => {
    // @ts-expect-error
    window[ARKOSE_DATA_CALLBACK] = (enforcement: any) => {
      enforcement.setConfig({
        onReady: () => {
          props.onLoad(enforcement);
        },
        onCompleted: (response: any) => {
          props.onVerify(response.token);
        },
        onError: () => {
          alert("you did a mistake...");
        }
      })
    };
  })
  
  return <></>
};

export default Arkose;
