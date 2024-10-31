import { Show, type Component } from "solid-js";
import { createStore } from "solid-js/store";
import Arkose from "../components/arkose";
import { BEREAL_ARKOSE_PUBLIC_KEY, vonage_request_code, vonage_verify_otp, VonageRequestCodeTokenIdentifier } from "../api";
import { v4 as uuidv4 } from "uuid";

const LoginView: Component = () => {
  let arkose: any;

  const [state, setState] = createStore({
    step: "phone" as ("phone" | "otp"),
    deviceID: uuidv4(),
    loading: false,

    phoneNumber: "",
    arkoseToken: "",
    otp: "",
  })

  const runAuthentication = async (): Promise<void> => {
    if (!state.phoneNumber) return;
    
    if (!state.arkoseToken) {
      arkose.run();
      return;
    }

    try {
      setState("loading", true);

      if (state.step === "phone") {
        await vonage_request_code({
          deviceID: state.deviceID,
          phoneNumber: state.phoneNumber.trim(),
          tokens: [{
            identifier: VonageRequestCodeTokenIdentifier.ARKOSE,
            token: state.arkoseToken
          }]
        });

        setState("step", "otp");
      }
      else if (state.step === "otp") {
        const tokens = await vonage_verify_otp({
          deviceID: state.deviceID,
          phoneNumberUsed: state.phoneNumber.trim(),
          otp: state.otp.trim()
        });

        console.log(tokens)
      }
    }
    catch (e) {
      // TODO: show error in UI
      console.error(e);
    }
    finally {
      setState("loading", false);
    }
  }
  
  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={(event) => {
        event.preventDefault();
        runAuthentication();
      }}>
        <Arkose
          key={BEREAL_ARKOSE_PUBLIC_KEY}
          onLoad={(enforcement) => (arkose = enforcement)}
          onVerify={(token) => {
            if (token) {
              setState("arkoseToken", token);
              runAuthentication();
            }
          }}
        />

        <p>your device id: {state.deviceID}</p>
        <Show when={state.loading}>
          <p>we're loading...</p>
        </Show>

        <Show when={state.step === "phone"}>
          <label>
            Phone Number:
            <input
              type="text"
              value={state.phoneNumber}
              onInput={e => setState("phoneNumber", e.currentTarget.value)}
            />
          </label>

          <button type="submit" disabled={state.loading}>
            Send OTP
          </button>
        </Show>
        <Show when={state.step === "otp"}>
          <label>
            OTP:
            <input
              type="text"
              value={state.otp}
              onInput={e => setState("otp", e.currentTarget.value)}
            />
          </label>

          <button type="submit" disabled={state.loading}>
            Verify OTP
          </button>
        </Show>
      </form>
    </div>
  );
};

export default LoginView;
