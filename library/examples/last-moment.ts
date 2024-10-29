import "./_env"; // dotenv configuration
import { createSession, moments_last, person_me } from "../src";

void async function main () {
  const session = createSession(process.env.DEVICE_ID!, {
    access_token: process.env.ACCESS_TOKEN
  });

  const me = await person_me(session);
  const last_moment = await moments_last(session, me.region);
  console.dir(last_moment, { depth: Infinity }); 
}();
