import { onMount, createSignal, type Component, onCleanup, Show } from "solid-js";
import { Portal } from "solid-js/web";

const Arkose: Component<{
  key: string
  onVerify: (token?: string) => void
}> = (props) => {
  const html = () => `
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0" />
  <style>
    html, body {
      height: 100%;
      width: 100%;
      overflow: hidden;
      position: fixed;
      margin: 0;
      padding: 0;
    }
  </style>
  <script crossorigin="anonymous" data-callback="setupEnforcement" onerror="jsLoadError()" src="https://client-api.arkoselabs.com/v2/api.js" async defer></script>
  <script>
    function jsLoadError () {
      window.top.postMessage(JSON.stringify({ type: "js:error" }), "*");
    }

    function setupEnforcement (arkoseEnforcement) {
      arkoseEnforcement.setConfig({
        selector: '#challenge',
        publicKey: ${JSON.stringify(props.key)},
        mode: 'inline',
        data: { blob: "" },
        language: '',
        isSDK: true,
        accessibilitySettings: {
          lockFocusToModal: true
        },
        noSuppress: false,
        onCompleted (response) {
          window.top.postMessage(JSON.stringify({ type: "completed", response }), "*");
        },
        onHide () {
          window.top.postMessage(JSON.stringify({ type: "hide" }), "*");
        },
        onShow () {
          window.top.postMessage(JSON.stringify({ type: "show" }), "*");
        },
        onError (response) {
          window.top.postMessage(JSON.stringify({ type: "error", response }), "*");
        },
        onFailed (response) {
          window.top.postMessage(JSON.stringify({ type: "failed", response }), "*");
        }
      });
    }
  </script>
</head>
<body id="challenge"></body>
</html>
  `.trim();

  const url = () => "data:text/html;base64," + btoa(html());
  const [show, setShow] = createSignal(true);

  const handleWindowMessage = (e: MessageEvent) => {
    const event = e as MessageEvent;
    const data = JSON.parse(event.data);

    switch (data.type) {
      case "show":
        setShow(true);
        break;
      case "hide":
        setShow(false);
        break;
      case "error":
      case "failed":
      case "js:error":
        alert("Uh oh, something went wrong. Please try again.");
        console.error(data.response);
        break;
      case "completed":
        props.onVerify(data.response.token);
        setShow(false);
        break;
    }
  }

  onMount(() => {
    window.addEventListener("message", handleWindowMessage);
  });

  onCleanup(() => {
    window.removeEventListener("message", handleWindowMessage);
  });

  return (
    <Portal>
      <Show when={show()}>
        <div class="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
          <iframe
            src={url()}
            class="h-[450px] w-[400px]"
          />
        </div>
      </Show>
    </Portal>
  );
};

export default Arkose;
