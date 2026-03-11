export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

export type ApiBodyMode = "auto" | "json" | "text";

export type ApiHeaders = Record<string, string>;

export type ApiRequestInput = {
  method?: ApiMethod | string;
  url: string;
  headers?: ApiHeaders;
  body?: unknown;
  timeoutMs?: number;
  responseType?: ApiBodyMode;
  signal?: AbortSignal;
};

export type ApiResponseData = {
  ok: boolean;
  status: number;
  statusText: string;
  url: string;
  method: ApiMethod;
  headers: ApiHeaders;
  bodyText: string;
  data: unknown;
  durationMs: number;
  requestedAt: number;
};

export type ApiRequestResult = {
  ok: boolean;
  response: ApiResponseData | null;
  error: string | null;
  durationMs: number;
};
