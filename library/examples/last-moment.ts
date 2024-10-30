import "./_env"; // dotenv configuration
import { moments_last, person_me } from "../src";

void async function main () {
  const deviceID = process.env.DEVICE_ID!;

  let region: string;
  try { // get the region from the user, if possible
    const accessToken = process.env.ACCESS_TOKEN!;

    const me = await person_me({
      deviceID,
      accessToken
    });

    region = me.region;
  }
  catch { // default to europe-west because why not
    region = "europe-west";
  }

  // NOTE: you don't have to be authenticated to make this request !
  const last_moment = await moments_last({ deviceID, region });
  console.dir(last_moment, { depth: Infinity }); 
}();
