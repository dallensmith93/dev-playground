export type JwtHeader = {
  alg?: string;
  typ?: string;
  kid?: string;
  [key: string]: unknown;
};

export type JwtPayload = {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [key: string]: unknown;
};

export type JwtDecoded = {
  token: string;
  header: JwtHeader;
  payload: JwtPayload;
  signature: string;
};

export type JwtExpStatus = {
  now: number;
  exp: number | null;
  expiresAtMs: number | null;
  secondsUntilExpiration: number | null;
  isExpired: boolean;
  isNotBeforeValid: boolean;
};

export type JwtDecodeResult = {
  valid: boolean;
  decoded: JwtDecoded | null;
  expiration: JwtExpStatus;
  error: string | null;
};
