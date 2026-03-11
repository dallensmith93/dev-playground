import type { JwtDecodeResult, JwtDecoded, JwtExpStatus, JwtHeader, JwtPayload } from "../types/jwt";

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Invalid JWT";
}

function base64UrlToBase64(segment: string): string {
  const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (normalized.length % 4)) % 4;
  return normalized + "=".repeat(padLength);
}

function decodeBase64Url(segment: string): string {
  const base64 = base64UrlToBase64(segment);
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function parseJwtSection<TData extends Record<string, unknown>>(segment: string): TData {
  const decoded = decodeBase64Url(segment);
  return JSON.parse(decoded) as TData;
}

export function getJwtExpirationStatus(payload: JwtPayload, nowSeconds = Math.floor(Date.now() / 1000)): JwtExpStatus {
  const exp = typeof payload.exp === "number" ? payload.exp : null;
  const nbf = typeof payload.nbf === "number" ? payload.nbf : null;

  return {
    now: nowSeconds,
    exp,
    expiresAtMs: exp === null ? null : exp * 1000,
    secondsUntilExpiration: exp === null ? null : exp - nowSeconds,
    isExpired: exp === null ? false : nowSeconds >= exp,
    isNotBeforeValid: nbf === null ? true : nowSeconds >= nbf,
  };
}

export function decodeJwt(token: string): JwtDecodeResult {
  const trimmed = token.trim();

  if (!trimmed) {
    return {
      valid: false,
      decoded: null,
      expiration: getJwtExpirationStatus({}),
      error: "JWT token is required",
    };
  }

  const parts = trimmed.split(".");
  if (parts.length !== 3 || parts.some((part) => part.length === 0)) {
    return {
      valid: false,
      decoded: null,
      expiration: getJwtExpirationStatus({}),
      error: "JWT must contain header, payload, and signature",
    };
  }

  try {
    const header = parseJwtSection<JwtHeader>(parts[0]);
    const payload = parseJwtSection<JwtPayload>(parts[1]);
    const decoded: JwtDecoded = {
      token: trimmed,
      header,
      payload,
      signature: parts[2],
    };

    return {
      valid: true,
      decoded,
      expiration: getJwtExpirationStatus(payload),
      error: null,
    };
  } catch (error) {
    return {
      valid: false,
      decoded: null,
      expiration: getJwtExpirationStatus({}),
      error: toErrorMessage(error),
    };
  }
}

export function isJwtExpired(token: string): boolean {
  const result = decodeJwt(token);
  return result.valid && result.expiration.isExpired;
}
