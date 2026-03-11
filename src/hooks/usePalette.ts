import { useCallback, useEffect, useState } from "react";
import { paletteGenerator } from "../logic/paletteGenerator";
import type { PaletteGenerationOptions, PaletteResult } from "../types/palette";
import { stableStringify } from "../utils/queryFormatter";

type UsePaletteOptions = PaletteGenerationOptions & {
  baseHex?: string;
  autoGenerate?: boolean;
  ttlMs?: number;
  skipCache?: boolean;
};

type UsePaletteResult = {
  data: PaletteResult | null;
  result: PaletteResult | null;
  isLoading: boolean;
  loading: boolean;
  error: string | null;
  fromCache: boolean;
  lastUpdated: number | null;
  generate: (baseHex?: string, options?: PaletteGenerationOptions) => Promise<PaletteResult | null>;
  run: (baseHex?: string, options?: PaletteGenerationOptions) => Promise<PaletteResult | null>;
  reset: () => void;
};

type CacheEntry = {
  value: PaletteResult;
  timestamp: number;
};

const paletteCache = new Map<string, CacheEntry>();

export function usePalette(options: UsePaletteOptions = {}): UsePaletteResult {
  const {
    baseHex = "#3b82f6",
    steps,
    clamp = true,
    autoGenerate = true,
    ttlMs = 120_000,
    skipCache = false,
  } = options;

  const [data, setData] = useState<PaletteResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const run = useCallback(
    async (nextBaseHex?: string, nextOptions: PaletteGenerationOptions = {}): Promise<PaletteResult | null> => {
      const inputHex = nextBaseHex ?? baseHex;
      const optionsValue: PaletteGenerationOptions = {
        steps: nextOptions.steps ?? steps,
        clamp: nextOptions.clamp ?? clamp,
      };

      const cacheKey = stableStringify({ baseHex: inputHex, options: optionsValue });

      if (!skipCache) {
        const cached = paletteCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp <= ttlMs) {
          setData(cached.value);
          setError(null);
          setFromCache(true);
          setLastUpdated(cached.timestamp);
          return cached.value;
        }
      }

      setIsLoading(true);
      setError(null);

      try {
        const palette = paletteGenerator(inputHex, optionsValue);
        const timestamp = Date.now();

        paletteCache.set(cacheKey, {
          value: palette,
          timestamp,
        });

        setData(palette);
        setFromCache(false);
        setLastUpdated(timestamp);
        return palette;
      } catch (generationError) {
        const message = generationError instanceof Error ? generationError.message : "Failed to generate palette";
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [baseHex, steps, clamp, skipCache, ttlMs],
  );

  useEffect(() => {
    if (!autoGenerate) return;
    void run(baseHex, { steps, clamp });
  }, [autoGenerate, run, baseHex, steps, clamp]);

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
    generate: (nextBaseHex?: string, nextOptions: PaletteGenerationOptions = {}) => run(nextBaseHex, nextOptions),
    run: (nextBaseHex?: string, nextOptions: PaletteGenerationOptions = {}) => run(nextBaseHex, nextOptions),
    reset,
  };
}
