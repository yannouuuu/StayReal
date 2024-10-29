import "./_env"; // dotenv configuration

import {
  // helper
  createSession,
  // api requests
  vonage_request_code,
  vonage_verify_otp,
  // enum/types
  VonageRequestCodeTokenIdentifier
} from "../src";

void async function main () {
  const phoneNumber = process.env.PHONE_NUMBER!;
  const session = createSession(process.env.DEVICE_ID!);
  
  await vonage_request_code(session, phoneNumber, [
    {
      identifier: VonageRequestCodeTokenIdentifier.ARKOSE,
      token: process.env.ARKOSE_TOKEN!
    }
  ]);

  // NOTE: only works with bun
  const otp = prompt("OTP from SMS:");
  if (!otp) throw new Error("no otp provided");

  const tokens = await vonage_verify_otp(session, otp, phoneNumber);
  console.dir(tokens, { depth: Infinity });
}();
