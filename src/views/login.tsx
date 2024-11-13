import { Show, type Component } from "solid-js";
import { createStore } from "solid-js/store";
import Arkose from "../components/arkose";
import { BEREAL_ARKOSE_PUBLIC_KEY, vonage_request_code, vonage_verify_otp, VonageRequestCodeTokenIdentifier } from "../api";
import { v4 as uuidv4 } from "uuid";
import auth from "../stores/auth";
import { useNavigate } from "@solidjs/router";

const LoginView: Component = () => {
  let arkose: any;
  const navigate = useNavigate();

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

      // make sure there's no whitespace in the phone number
      const phoneNumber = state.phoneNumber.split(" ").join("").trim();

      if (state.step === "phone") {
        await vonage_request_code({
          deviceID: state.deviceID,
          phoneNumber,
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
          phoneNumberUsed: phoneNumber,
          otp: state.otp.trim()
        });

        auth.set({
          deviceID: state.deviceID,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token
        });

        navigate("/feed");
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
    <main class="h-100dvh flex flex-col px-4 py-6">
      <header class="flex items-center relative w-full h-8 mt-[env(safe-area-inset-top)]">
        <Show when={state.step === "otp"}>
          <button type="button"
            onClick={() => {
              setState({
                arkoseToken: "",
                step: "phone",
                otp: "",
              });
            }}
          >
            {"<"}
          </button>
        </Show>

        <div class="absolute inset-x-0 w-fit mx-auto text-2xl text-center text-white font-700" role="banner">
          StayReal.
        </div>
      </header>

      <h1 class="my-10 w-fit mx-auto text-center font-600">
        {state.step === "phone" ? "What's your phone number?" : "Check your number"}
      </h1>

      <form
        class="flex flex-col gap-4 h-full mb-[env(safe-area-inset-bottom)]"
        onSubmit={(event) => {
          event.preventDefault();
          runAuthentication();
        }}
      >
        <Show when={state.step === "phone"}>
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

          <input 
            class="w-full max-w-280px mx-auto rounded-2xl py-3 px-4 text-white bg-white/5 text-2xl font-600 tracking-wide outline-none placeholder:text-white/40 focus:(outline outline-white outline-offset-2)"
            type="text"
            inputMode="tel"
            value={state.phoneNumber}
            onInput={e => setState("phoneNumber", e.currentTarget.value)}
            placeholder="+33 6 12 34 56 78"
          />

          <p class="mt-8 text-sm text-center px-4 text-white/75">
            By continuing, you agree that StayReal is not affiliated with BeReal and that you are using this service at your own risk.
          </p>

          <button type="submit" disabled={state.loading || !state.phoneNumber}
            class="text-black bg-white rounded-2xl w-full py-3 mt-auto focus:(outline outline-white outline-offset-2) disabled:opacity-30"
          >
            Send Verification Text
          </button>
        </Show>
        <Show when={state.step === "otp"}>
          <input 
            class="w-full max-w-160px mx-auto rounded-2xl py-3 px-4 text-white text-center bg-transparent text-2xl font-600 outline-none placeholder:text-white/40 tracking-widest focus:(outline outline-white outline-offset-2)"
            type="text"
            maxLength={6}
            inputMode="numeric"
            value={state.otp}
            onInput={e => setState("otp", e.currentTarget.value)}
            placeholder="••••••"
          />

          <p class="mt-8 text-sm text-center px-4 text-white/75">
            Verification code sent to {state.phoneNumber}
          </p>

          <button type="submit" disabled={state.loading || state.otp.length !== 6}
            class="text-black bg-white rounded-2xl w-full py-3 mt-auto focus:(outline outline-white outline-offset-2) disabled:opacity-30"
          >
            Check Verification Code
          </button>
        </Show>
        <p class="text-white/40 text-xs text-center" aria-hidden="true">device-id: {state.deviceID}</p>
      </form>
    </main>
  );
};

export default LoginView;
