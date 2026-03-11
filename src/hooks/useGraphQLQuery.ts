import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { requestGraphQL, resolveGraphQLEndpoint } from "../logic/graphqlClient";
import type { GraphQLEndpoint, GraphQLVariables } from "../types/graphql";
import { buildGraphQLCacheKey, stableStringify } from "../utils/queryFormatter";
import { toErrorMessage } from "../utils/fetcher";

type QueryParams = {
  endpoint: GraphQLEndpoint;
  query: string;
  variables?: GraphQLVariables;
};

type UseGraphQLQueryOptions<TData> = Partial<QueryParams> & {
  enabled?: boolean;
  ttlMs?: number;
  timeoutMs?: number;
  skipCache?: boolean;
  initialData?: TData;
};

type UseGraphQLQueryResult<TData> = {
  data: TData | null;
  result: TData | null;
  isLoading: boolean;
  loading: boolean;
  error: string | null;
  fromCache: boolean;
  lastUpdated: number | null;
  refetch: () => Promise<TData | null>;
  run: (params?: QueryParams) => Promise<TData | null>;
  execute: (params?: QueryParams) => Promise<TData | null>;
  reset: () => void;
};

type CacheEntry<TData> = {
  data: TData;
  timestamp: number;
};

const queryCache = new Map<string, CacheEntry<unknown>>();

export function useGraphQLQuery<TData = Record<string, unknown>>(
  options: UseGraphQLQueryOptions<TData> = {},
): UseGraphQLQueryResult<TData> {
  const {
    endpoint = "countries",
    query = "",
    variables,
    enabled = true,
    ttlMs = 60_000,
    timeoutMs = 12_000,
    skipCache = false,
    initialData,
  } = options;

  const [data, setData] = useState<TData | null>(initialData ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const requestIdRef = useRef(0);
  const optionsVarsKey = useMemo(() => stableStringify(variables ?? {}), [variables]);

  const run = useCallback(
    async (params?: QueryParams, force = false): Promise<TData | null> => {
      const endpointValue = params?.endpoint ?? endpoint;
      const queryValue = (params?.query ?? query).trim();
      const varsValue = params?.variables ?? variables;

      if (!enabled) return null;
      if (!queryValue) {
        setError("GraphQL query is required");
        return null;
      }

      const endpointUrl = resolveGraphQLEndpoint(endpointValue);
      const cacheKey = buildGraphQLCacheKey(endpointUrl, queryValue, varsValue);

      if (!force && !skipCache) {
        const cached = queryCache.get(cacheKey) as CacheEntry<TData> | undefined;
        if (cached && Date.now() - cached.timestamp <= ttlMs) {
          setData(cached.data);
          setError(null);
          setIsLoading(false);
          setFromCache(true);
          setLastUpdated(cached.timestamp);
          return cached.data;
        }
      }

      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      setIsLoading(true);
      setError(null);

      try {
        const response = await requestGraphQL<TData>({
          endpoint: endpointValue,
          query: queryValue,
          variables: varsValue,
          timeoutMs,
        });

        if (requestId !== requestIdRef.current) return null;

        queryCache.set(cacheKey, { data: response.data, timestamp: response.queriedAt });
        setData(response.data);
        setFromCache(false);
        setLastUpdated(response.queriedAt);
        return response.data;
      } catch (requestError) {
        if (requestId !== requestIdRef.current) return null;
        setError(toErrorMessage(requestError));
        return null;
      } finally {
        if (requestId === requestIdRef.current) setIsLoading(false);
      }
    },
    [enabled, endpoint, query, skipCache, timeoutMs, ttlMs, variables],
  );

  useEffect(() => {
    if (!query.trim()) return;
    void run(undefined, false);
  }, [run, query, optionsVarsKey]);

  const reset = useCallback(() => {
    requestIdRef.current += 1;
    setData(initialData ?? null);
    setIsLoading(false);
    setError(null);
    setFromCache(false);
    setLastUpdated(null);
  }, [initialData]);

  return {
    data,
    result: data,
    isLoading,
    loading: isLoading,
    error,
    fromCache,
    lastUpdated,
    refetch: () => run(undefined, true),
    run: (params?: QueryParams) => run(params, true),
    execute: (params?: QueryParams) => run(params, true),
    reset,
  };
}
