import "./_env"; // dotenv configuration
import { vonage_request_code, vonage_verify_otp, VonageRequestCodeTokenIdentifier } from "~/index";

void async function main () {
  const phoneNumber = process.env.PHONE_NUMBER!;
  const deviceID = process.env.DEVICE_ID!;
  
  await vonage_request_code([
    {
      identifier: VonageRequestCodeTokenIdentifier.ARKOSE,
      token: process.env.ARKOSE_TOKEN!
    }
  ], phoneNumber, deviceID);

  // NOTE: only works with bun
  const otp = prompt("OTP from SMS:");
  if (!otp) throw new Error("no otp provided");

  const tokens = await vonage_verify_otp(otp, phoneNumber, deviceID);
  console.dir(tokens, { depth: Infinity });
}();
