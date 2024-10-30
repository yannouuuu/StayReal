import "./_env"; // dotenv configuration
import { person_me } from "../src";

void async function main () {
  const me = await person_me({
    deviceID: process.env.DEVICE_ID!,
    accessToken: process.env.ACCESS_TOKEN!
  });
  
  console.dir(me, { depth: Infinity }); 
}();
