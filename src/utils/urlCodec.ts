export function encodeUrlSegment(value: string): string {
  return encodeURIComponent(value);
}

export function decodeUrlSegment(value: string): string {
  return decodeURIComponent(value);
}

export function safeDecodeUrlSegment(value: string): { ok: true; value: string } | { ok: false; error: string } {
  try {
    return { ok: true, value: decodeURIComponent(value) };
  } catch {
    return { ok: false, error: "Invalid encoded URL data." };
  }
}
