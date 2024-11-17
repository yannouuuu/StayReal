import { utf8ToBytes, concatBytes } from '@noble/hashes/utils';
import { sha256 } from '@noble/hashes/sha2';
import { hmac } from '@noble/hashes/hmac';
import { base64 } from '@scure/base';

import { BEREAL_HMAC_KEY, BEREAL_TIMEZONE } from "../constants";

export const createBeRealSignature = (deviceID: string): string => {
  const timestamp = `${Math.floor(Date.now() / 1000)}`;
  
  const data = utf8ToBytes(`${deviceID}${BEREAL_TIMEZONE}${timestamp}`);
  const hash = hmac(sha256, BEREAL_HMAC_KEY, base64.encode(data));
  const prefix = utf8ToBytes(`1:${timestamp}:`);
  const bytes = concatBytes(prefix, hash);

  return base64.encode(bytes);
};
