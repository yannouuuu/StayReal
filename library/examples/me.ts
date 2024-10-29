import "./_env"; // dotenv configuration
import { createSession, person_me } from "../src";

void async function main () {
  const session = createSession(process.env.DEVICE_ID!, {
    access_token: process.env.ACCESS_TOKEN
  });

  const me = await person_me(session);
  console.dir(me, { depth: Infinity }); 
}();
