import { useCallback, useEffect, useMemo, useState } from "react";
import { summarizeLatency, testLatency, testLatencyBatch } from "../logic/latencyTester";
import type { LatencyMeasurement, LatencySummary, LatencyTarget } from "../types/latency";
import { DEFAULT_LATENCY_TARGETS } from "../types/latency";
import { stableStringify } from "../utils/queryFormatter";
import { toErrorMessage } from "../utils/fetcher";

type RunLatencyParams = {
  url: string;
  attempts?: number;
  method?: string;
};

type UseApiLatencyOptions = {
  targets?: LatencyTarget[];
  enabled?: boolean;
  autoRun?: boolean;
  ttlMs?: number;
  timeoutMs?: number;
  skipCache?: boolean;
};

type LatencyResultPayload = LatencySummary & {
  average: number;
  avg: number;
  attempts: number;
  measurements: LatencyMeasurement[];
};

type UseApiLatencyResult = {
  measurements: LatencyMeasurement[];
  summary: LatencySummary;
  data: LatencyResultPayload | null;
  result: LatencyResultPayload | null;
  isLoading: boolean;
  loading: boolean;
  error: string | null;
  fromCache: boolean;
  lastUpdated: number | null;
  run: (params?: RunLatencyParams) => Promise<LatencyResultPayload | null>;
  test: (params?: RunLatencyParams) => Promise<LatencyResultPayload | null>;
  execute: (params?: RunLatencyParams) => Promise<LatencyResultPayload | null>;
  reset: () => void;
};

type CacheEntry = {
  payload: LatencyResultPayload;
  timestamp: number;
};

const defaultSummary: LatencySummary = {
  averageMs: 0,
  fastestMs: 0,
  slowestMs: 0,
  successRate: 0,
};

const latencyCache = new Map<string, CacheEntry>();

function toPayload(measurements: LatencyMeasurement[], summary: LatencySummary): LatencyResultPayload {
  return {
    ...summary,
    average: summary.averageMs,
    avg: summary.averageMs,
    attempts: measurements.length,
    measurements,
  };
}

export function useApiLatency(options: UseApiLatencyOptions = {}): UseApiLatencyResult {
  const {
    targets = DEFAULT_LATENCY_TARGETS,
    enabled = true,
    autoRun = true,
    ttlMs = 30_000,
    timeoutMs = 10_000,
    skipCache = false,
  } = options;

  const [measurements, setMeasurements] = useState<LatencyMeasurement[]>([]);
  const [summary, setSummary] = useState<LatencySummary>(defaultSummary);
  const [data, setData] = useState<LatencyResultPayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const defaultCacheKey = useMemo(
    () => stableStringify(targets.map((target) => ({ key: target.key, url: target.url, method: target.method }))),
    [targets],
  );

  const run = useCallback(
    async (params?: RunLatencyParams, force = false): Promise<LatencyResultPayload | null> => {
      if (!enabled) return null;

      const isCustomRun = Boolean(params?.url);
      const attempts = Math.max(1, Math.min(20, params?.attempts ?? 1));
      const method = (params?.method ?? "GET").toUpperCase();
      const customTarget: LatencyTarget | null = params?.url
        ? {
            key: "custom",
            label: "Custom Endpoint",
            url: params.url,
            method: method === "POST" || method === "GET" ? method : "GET",
          }
        : null;

      const cacheKey = isCustomRun
        ? stableStringify({ url: params?.url, method, attempts })
        : defaultCacheKey;

      if (!force && !skipCache) {
        const cached = latencyCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp <= ttlMs) {
          setMeasurements(cached.payload.measurements);
          setSummary(cached.payload);
          setData(cached.payload);
          setFromCache(true);
          setError(null);
          setIsLoading(false);
          setLastUpdated(cached.timestamp);
          return cached.payload;
        }
      }

      setIsLoading(true);
      setError(null);

      try {
        const nextMeasurements = customTarget
          ? await Promise.all(Array.from({ length: attempts }, () => testLatency(customTarget, { timeoutMs })))
          : await testLatencyBatch(targets, { timeoutMs });

        const nextSummary = summarizeLatency(nextMeasurements);
        const payload = toPayload(nextMeasurements, nextSummary);
        const timestamp = Date.now();

        latencyCache.set(cacheKey, {
          payload,
          timestamp,
        });

        setMeasurements(nextMeasurements);
        setSummary(nextSummary);
        setData(payload);
        setFromCache(false);
        setLastUpdated(timestamp);

        return payload;
      } catch (requestError) {
        setError(toErrorMessage(requestError));
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [defaultCacheKey, enabled, skipCache, targets, timeoutMs, ttlMs],
  );

  useEffect(() => {
    if (!autoRun) return;
    void run(undefined, false);
  }, [autoRun, run]);

  const reset = useCallback(() => {
    setMeasurements([]);
    setSummary(defaultSummary);
    setData(null);
    setIsLoading(false);
    setError(null);
    setFromCache(false);
    setLastUpdated(null);
  }, []);

  return {
    measurements,
    summary,
    data,
    result: data,
    isLoading,
    loading: isLoading,
    error,
    fromCache,
    lastUpdated,
    run: (params?: RunLatencyParams) => run(params, true),
    test: (params?: RunLatencyParams) => run(params, true),
    execute: (params?: RunLatencyParams) => run(params, true),
    reset,
  };
}
