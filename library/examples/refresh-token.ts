import "./_env"; // dotenv configuration
import { auth_refresh } from "../src";

void async function main () {
  const deviceID = process.env.DEVICE_ID!;
  const refreshToken = process.env.REFRESH_TOKEN!;

  const tokens = await auth_refresh({ deviceID, refreshToken });
  console.dir(tokens, { depth: Infinity });

  // now you can update your .env file with the new tokens !
}();