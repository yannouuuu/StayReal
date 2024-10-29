import "./_env"; // dotenv configuration
import { createSession, moments_last, person_me } from "../src";

void async function main () {
  const session = createSession(process.env.DEVICE_ID!, {
    access_token: process.env.ACCESS_TOKEN
  });

  let region: string;
  try { // get the region from the user, if possible
    const me = await person_me(session);
    region = me.region;
  }
  catch { // default to europe-west because why not
    region = "europe-west";
  }

  const last_moment = await moments_last(session, region);
  console.dir(last_moment, { depth: Infinity }); 
}();
