import type { SharePayload } from "../types/share";
import { encodeUrlSegment } from "../utils/urlCodec";

export function encodeSharePayload(payload: SharePayload): string {
  return encodeUrlSegment(JSON.stringify(payload));
}

export function buildSharePath(payload: SharePayload): string {
  const encodedResult = encodeUrlSegment(payload.result);
  return `/share/${encodeUrlSegment(payload.tool)}/${encodedResult}`;
}
