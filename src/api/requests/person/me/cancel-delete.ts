import { fetch } from "@tauri-apps/plugin-http";
import { BEREAL_DEFAULT_HEADERS } from "~/api/constants";
import auth from "~/stores/auth";

export const patchPersonMeCancelDelete = async (): Promise<void> => {
  if (auth.isDemo()) {
    const { DEMO_PERSON_ME } = await import("~/api/demo/person/me");
    delete DEMO_PERSON_ME.accountDeleteScheduledAt;
    return;
  }

  const response = await fetch("https://mobile-l7.bereal.com/api/person/me/cancel-delete", {
    method: "PATCH",
    headers: {
      ...BEREAL_DEFAULT_HEADERS(auth.store.deviceId),
      authorization: `Bearer ${auth.store.accessToken}`
    }
  });

  // if token expired, refresh it and retry
  if (response.status === 401) {
    await auth.refresh();
    return patchPersonMeCancelDelete();
  }

  if (response.status !== 200) {
    throw new Error("failed to cancel account deletion");
  }
};
