import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiRequester } from "../logic/apiRequester";
import type { ApiHeaders, ApiRequestInput, ApiRequestResult } from "../types/api";
import { stableStringify } from "../utils/queryFormatter";

type RequestParams = Partial<ApiRequestInput>;

type UseApiRequestOptions = RequestParams & {
  enabled?: boolean;
  autoRun?: boolean;
  ttlMs?: number;
  skipCache?: boolean;
};

type UseApiRequestResult = {
  data: ApiRequestResult | null;
  result: ApiRequestResult | null;
  response: ApiRequestResult["response"];
  isLoading: boolean;
  loading: boolean;
  error: string | null;
  fromCache: boolean;
  lastUpdated: number | null;
  run: (params?: RequestParams) => Promise<ApiRequestResult | null>;
  execute: (params?: RequestParams) => Promise<ApiRequestResult | null>;
  refetch: () => Promise<ApiRequestResult | null>;
  reset: () => void;
};

type CacheEntry = {
  value: ApiRequestResult;
  timestamp: number;
};

const apiCache = new Map<string, CacheEntry>();

function normalizeHeaders(headers?: ApiHeaders): ApiHeaders {
  if (!headers) return {};
  const out: ApiHeaders = {};
  for (const [key, value] of Object.entries(headers)) out[key] = value;
  return out;
}

export function useApiRequest(options: UseApiRequestOptions = {}): UseApiRequestResult {
  const {
    method = "GET",
    url = "",
    headers,
    body,
    timeoutMs = 12_000,
    responseType = "auto",
    enabled = true,
    autoRun = false,
    ttlMs = 30_000,
    skipCache = false,
  } = options;

  const [data, setData] = useState<ApiRequestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const requestIdRef = useRef(0);

  const defaultRequest = useMemo<ApiRequestInput>(
    () => ({ method, url, headers: normalizeHeaders(headers), body, timeoutMs, responseType }),
    [method, url, headers, body, timeoutMs, responseType],
  );

  const run = useCallback(
    async (params?: RequestParams, force = false): Promise<ApiRequestResult | null> => {
      if (!enabled) return null;

      const request: ApiRequestInput = {
        ...defaultRequest,
        ...params,
        headers: normalizeHeaders(params?.headers ?? defaultRequest.headers),
      };

      if (!request.url.trim()) {
        setError("Request URL is required");
        return null;
      }

      const cacheKey = stableStringify({
        method: request.method,
        url: request.url,
        headers: request.headers,
        body: request.body,
        responseType: request.responseType,
      });

      if (!force && !skipCache) {
        const cached = apiCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp <= ttlMs) {
          setData(cached.value);
          setError(cached.value.error);
          setFromCache(true);
          setIsLoading(false);
          setLastUpdated(cached.timestamp);
          return cached.value;
        }
      }

      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiRequester(request);
        if (requestId !== requestIdRef.current) return null;

        const timestamp = Date.now();
        apiCache.set(cacheKey, { value: result, timestamp });

        setData(result);
        setError(result.error);
        setFromCache(false);
        setLastUpdated(timestamp);
        return result;
      } catch (requestError) {
        if (requestId !== requestIdRef.current) return null;
        const message = requestError instanceof Error ? requestError.message : "Request failed";
        setError(message);
        return null;
      } finally {
        if (requestId === requestIdRef.current) setIsLoading(false);
      }
    },
    [defaultRequest, enabled, skipCache, ttlMs],
  );

  useEffect(() => {
    if (!autoRun || !url.trim()) return;
    void run(undefined, false);
  }, [autoRun, run, url]);

  const reset = useCallback(() => {
    requestIdRef.current += 1;
    setData(null);
    setIsLoading(false);
    setError(null);
    setFromCache(false);
    setLastUpdated(null);
  }, []);

  return {
    data,
    result: data,
    response: data?.response ?? null,
    isLoading,
    loading: isLoading,
    error,
    fromCache,
    lastUpdated,
    run: (params?: RequestParams) => run(params, true),
    execute: (params?: RequestParams) => run(params, true),
    refetch: () => run(undefined, true),
    reset,
  };
}
