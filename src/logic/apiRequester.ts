import type { ApiBodyMode, ApiHeaders, ApiMethod, ApiRequestInput, ApiRequestResult, ApiResponseData } from "../types/api";

const KNOWN_METHODS: ApiMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

export type ApiRequesterApi = {
  request: (input: ApiRequestInput) => Promise<ApiRequestResult>;
  run: (input: ApiRequestInput) => Promise<ApiRequestResult>;
};

function nowMs(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

function joinSignals(signalA?: AbortSignal, signalB?: AbortSignal): AbortSignal | undefined {
  if (!signalA && !signalB) return undefined;
  if (!signalA) return signalB;
  if (!signalB) return signalA;

  const controller = new AbortController();
  const abortFrom = (source: AbortSignal) => controller.abort(source.reason);

  if (signalA.aborted) abortFrom(signalA);
  if (signalB.aborted) abortFrom(signalB);

  signalA.addEventListener("abort", () => abortFrom(signalA), { once: true });
  signalB.addEventListener("abort", () => abortFrom(signalB), { once: true });

  return controller.signal;
}

function normalizeMethod(method?: string): ApiMethod {
  const upper = (method ?? "GET").toUpperCase();
  return KNOWN_METHODS.includes(upper as ApiMethod) ? (upper as ApiMethod) : "GET";
}

function normalizeHeaders(headers?: ApiHeaders): ApiHeaders {
  const normalized: ApiHeaders = {};
  if (!headers) return normalized;

  for (const [key, value] of Object.entries(headers)) {
    const cleanKey = key.trim();
    if (!cleanKey) continue;
    normalized[cleanKey] = value;
  }

  return normalized;
}

function hasJsonContentType(headers: ApiHeaders): boolean {
  return Object.entries(headers).some(([key, value]) => key.toLowerCase() === "content-type" && value.includes("json"));
}

function prepareBody(body: unknown, method: ApiMethod, headers: ApiHeaders): BodyInit | undefined {
  if (method === "GET" || method === "HEAD" || body === undefined || body === null) return undefined;

  if (typeof body === "string") return body;
  if (body instanceof Blob || body instanceof FormData || body instanceof URLSearchParams) return body;

  if (!hasJsonContentType(headers)) {
    headers["content-type"] = "application/json";
  }

  return JSON.stringify(body);
}

function readResponseHeaders(response: Response): ApiHeaders {
  const headers: ApiHeaders = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });
  return headers;
}

function parseBody(bodyText: string, responseType: ApiBodyMode, headers: ApiHeaders): unknown {
  if (!bodyText) return null;

  const isJsonResponse = Object.entries(headers).some(
    ([key, value]) => key.toLowerCase() === "content-type" && value.toLowerCase().includes("json"),
  );

  if (responseType === "text" || (responseType === "auto" && !isJsonResponse)) {
    return bodyText;
  }

  try {
    return JSON.parse(bodyText) as unknown;
  } catch {
    return bodyText;
  }
}

function buildResponseData(
  response: Response,
  method: ApiMethod,
  headers: ApiHeaders,
  bodyText: string,
  data: unknown,
  startedAt: number,
): ApiResponseData {
  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    url: response.url,
    method,
    headers,
    bodyText,
    data,
    durationMs: Math.max(0, nowMs() - startedAt),
    requestedAt: Date.now(),
  };
}

async function runApiRequest(input: ApiRequestInput): Promise<ApiRequestResult> {
  if (typeof window === "undefined") {
    return {
      ok: false,
      response: null,
      error: "API requester is only available in the browser",
      durationMs: 0,
    };
  }

  const method = normalizeMethod(input.method);
  const headers = normalizeHeaders(input.headers);
  const timeoutMs = input.timeoutMs ?? 12_000;
  const responseType = input.responseType ?? "auto";
  const controller = new AbortController();
  const signal = joinSignals(controller.signal, input.signal);
  const startedAt = nowMs();
  const timeoutId = window.setTimeout(() => controller.abort("timeout"), timeoutMs);

  try {
    const response = await fetch(input.url, {
      method,
      headers,
      body: prepareBody(input.body, method, headers),
      signal,
    });

    const responseHeaders = readResponseHeaders(response);
    const bodyText = await response.text();
    const data = parseBody(bodyText, responseType, responseHeaders);
    const responseData = buildResponseData(response, method, responseHeaders, bodyText, data, startedAt);

    return {
      ok: response.ok,
      response: responseData,
      error: response.ok ? null : `Request failed with status ${response.status}`,
      durationMs: responseData.durationMs,
    };
  } catch (error) {
    const message = error instanceof DOMException && error.name === "AbortError"
      ? `Request timed out after ${timeoutMs}ms`
      : error instanceof Error
        ? error.message
        : "Request failed";

    return {
      ok: false,
      response: null,
      error: message,
      durationMs: Math.max(0, nowMs() - startedAt),
    };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export function apiRequester(): ApiRequesterApi;
export function apiRequester(input: ApiRequestInput): Promise<ApiRequestResult>;
export function apiRequester(input?: ApiRequestInput): ApiRequesterApi | Promise<ApiRequestResult> {
  if (!input) {
    return {
      request: runApiRequest,
      run: runApiRequest,
    };
  }

  return runApiRequest(input);
}
