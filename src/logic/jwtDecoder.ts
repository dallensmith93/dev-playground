import type { JwtDecodeResult } from "../types/jwt";
import { decodeJwt } from "../utils/jwtUtils";

export type JwtDecodeSummary = {
  valid: boolean;
  expired: boolean;
  active: boolean;
  secondsUntilExpiration: number | null;
  error: string | null;
};

export type JwtDecoderApi = {
  decode: (token: string) => JwtDecodeResult;
  summarize: (token: string) => JwtDecodeSummary;
};

function summarizeJwtToken(token: string): JwtDecodeSummary {
  const result = decodeJwt(token);

  return {
    valid: result.valid,
    expired: result.expiration.isExpired,
    active: result.expiration.isNotBeforeValid,
    secondsUntilExpiration: result.expiration.secondsUntilExpiration,
    error: result.error,
  };
}

export function jwtDecoder(): JwtDecoderApi;
export function jwtDecoder(token: string): JwtDecodeResult;
export function jwtDecoder(token?: string): JwtDecoderApi | JwtDecodeResult {
  if (token === undefined) {
    return {
      decode: decodeJwt,
      summarize: summarizeJwtToken,
    };
  }

  return decodeJwt(token);
}

export function summarizeJwt(token: string): JwtDecodeSummary {
  return summarizeJwtToken(token);
}
