import type { DecodedShareResult, SharePayload } from "../types/share";
import { safeDecodeUrlSegment } from "../utils/urlCodec";

export function decodeShareParams(toolParam: string, dataParam: string): DecodedShareResult {
  const decodedTool = safeDecodeUrlSegment(toolParam);
  const decodedData = safeDecodeUrlSegment(dataParam);

  if (!decodedTool.ok || !decodedData.ok) {
    return { ok: false, error: "Share link is invalid or corrupted." };
  }

  const payload: SharePayload = {
    tool: decodedTool.value,
    result: decodedData.value,
  };

  return { ok: true, payload };
}
