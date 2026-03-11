import { useCallback, useEffect, useMemo, useState } from "react";
import { regexEngine } from "../logic/regexEngine";
import type { RegexTestInput, RegexTestResult } from "../types/regex";
import { stableStringify } from "../utils/queryFormatter";

type UseRegexTestOptions = Partial<RegexTestInput> & {
  autoRun?: boolean;
  ttlMs?: number;
  skipCache?: boolean;
};

type UseRegexTestResult = {
  data: RegexTestResult | null;
  result: RegexTestResult | null;
  isLoading: boolean;
  loading: boolean;
  error: string | null;
  fromCache: boolean;
  lastUpdated: number | null;
  run: (params?: Partial<RegexTestInput>) => Promise<RegexTestResult | null>;
  execute: (params?: Partial<RegexTestInput>) => Promise<RegexTestResult | null>;
  test: (params?: Partial<RegexTestInput>) => Promise<RegexTestResult | null>;
  reset: () => void;
};

type CacheEntry = {
  value: RegexTestResult;
  timestamp: number;
};

const regexCache = new Map<string, CacheEntry>();

export function useRegexTest(options: UseRegexTestOptions = {}): UseRegexTestResult {
  const {
    pattern = "",
    flags = "",
    text = "",
    maxMatches = 500,
    autoRun = true,
    ttlMs = 60_000,
    skipCache = false,
  } = options;

  const [data, setData] = useState<RegexTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const defaultInput = useMemo<RegexTestInput>(
    () => ({ pattern, flags, text, maxMatches }),
    [pattern, flags, text, maxMatches],
  );

  const run = useCallback(
    async (params?: Partial<RegexTestInput>, force = false): Promise<RegexTestResult | null> => {
      const input: RegexTestInput = {
        pattern: params?.pattern ?? defaultInput.pattern,
        flags: params?.flags ?? defaultInput.flags,
        text: params?.text ?? defaultInput.text,
        maxMatches: params?.maxMatches ?? defaultInput.maxMatches,
      };

      const cacheKey = stableStringify(input);

      if (!force && !skipCache) {
        const cached = regexCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp <= ttlMs) {
          setData(cached.value);
          setError(null);
          setIsLoading(false);
          setFromCache(true);
          setLastUpdated(cached.timestamp);
          return cached.value;
        }
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = regexEngine(input);
        const timestamp = Date.now();
        regexCache.set(cacheKey, { value: result, timestamp });

        setData(result);
        setFromCache(false);
        setLastUpdated(timestamp);

        if (!result.isValid && result.error) {
          setError(result.error);
        }

        return result;
      } finally {
        setIsLoading(false);
      }
    },
    [defaultInput, skipCache, ttlMs],
  );

  useEffect(() => {
    if (!autoRun) return;
    void run(undefined, false);
  }, [autoRun, run]);

  const reset = useCallback(() => {
    setData(null);
    setIsLoading(false);
    setError(null);
    setFromCache(false);
    setLastUpdated(null);
  }, []);

  return {
    data,
    result: data,
    isLoading,
    loading: isLoading,
    error,
    fromCache,
    lastUpdated,
    run: (params?: Partial<RegexTestInput>) => run(params, true),
    execute: (params?: Partial<RegexTestInput>) => run(params, true),
    test: (params?: Partial<RegexTestInput>) => run(params, true),
    reset,
  };
}
