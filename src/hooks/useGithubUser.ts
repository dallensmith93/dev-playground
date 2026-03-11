import { useCallback, useEffect, useRef, useState } from "react";
import { fetchGithubUserStats, sanitizeUsername } from "../logic/githubStats";
import type { GithubLanguageUsage, GithubRepo, GithubStats, GithubUser, GithubUserResult } from "../types/github";
import { toErrorMessage } from "../utils/fetcher";

type UseGithubUserOptions = {
  username?: string;
  enabled?: boolean;
  ttlMs?: number;
  timeoutMs?: number;
  skipCache?: boolean;
};

type UseGithubUserResultState = {
  user: GithubUser | null;
  data: GithubUser | null;
  stats: GithubStats | null;
  recentRepos: GithubRepo[];
  languageUsage: GithubLanguageUsage[];
  isLoading: boolean;
  loading: boolean;
  error: string | null;
  fromCache: boolean;
  lastUpdated: number | null;
  refetch: () => Promise<GithubUser | null>;
  run: (username?: string) => Promise<GithubUser | null>;
  fetchUser: (username?: string) => Promise<GithubUser | null>;
  execute: (username?: string) => Promise<GithubUser | null>;
  reset: () => void;
};

type CacheEntry = {
  value: GithubUserResult;
  timestamp: number;
};

const githubCache = new Map<string, CacheEntry>();

export function useGithubUser(options: UseGithubUserOptions = {}): UseGithubUserResultState {
  const { username = "", enabled = true, ttlMs = 120_000, timeoutMs = 12_000, skipCache = false } = options;

  const [user, setUser] = useState<GithubUser | null>(null);
  const [stats, setStats] = useState<GithubStats | null>(null);
  const [recentRepos, setRecentRepos] = useState<GithubRepo[]>([]);
  const [languageUsage, setLanguageUsage] = useState<GithubLanguageUsage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const requestIdRef = useRef(0);

  const run = useCallback(
    async (nextUsername?: string, force = false): Promise<GithubUser | null> => {
      if (!enabled) return null;

      const cleanUsername = sanitizeUsername(nextUsername ?? username);
      if (!cleanUsername) {
        setError("GitHub username is required");
        return null;
      }

      const cacheKey = cleanUsername.toLowerCase();

      if (!force && !skipCache) {
        const cached = githubCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp <= ttlMs) {
          setUser(cached.value.user);
          setStats(cached.value.stats);
          setRecentRepos(cached.value.recentRepos);
          setLanguageUsage(cached.value.languageUsage);
          setError(null);
          setIsLoading(false);
          setFromCache(true);
          setLastUpdated(cached.timestamp);
          return cached.value.user;
        }
      }

      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchGithubUserStats(cleanUsername, { timeoutMs });
        if (requestId !== requestIdRef.current) return null;

        githubCache.set(cacheKey, {
          value: { ...result, fromCache: false },
          timestamp: result.fetchedAt,
        });

        setUser(result.user);
        setStats(result.stats);
        setRecentRepos(result.recentRepos);
        setLanguageUsage(result.languageUsage);
        setFromCache(false);
        setLastUpdated(result.fetchedAt);
        return result.user;
      } catch (requestError) {
        if (requestId !== requestIdRef.current) return null;
        setError(toErrorMessage(requestError));
        return null;
      } finally {
        if (requestId === requestIdRef.current) setIsLoading(false);
      }
    },
    [enabled, skipCache, timeoutMs, ttlMs, username],
  );

  useEffect(() => {
    if (!sanitizeUsername(username)) return;
    void run(undefined, false);
  }, [run, username]);

  const reset = useCallback(() => {
    requestIdRef.current += 1;
    setUser(null);
    setStats(null);
    setRecentRepos([]);
    setLanguageUsage([]);
    setIsLoading(false);
    setError(null);
    setFromCache(false);
    setLastUpdated(null);
  }, []);

  return {
    user,
    data: user,
    stats,
    recentRepos,
    languageUsage,
    isLoading,
    loading: isLoading,
    error,
    fromCache,
    lastUpdated,
    refetch: () => run(undefined, true),
    run: (nextUsername?: string) => run(nextUsername, true),
    fetchUser: (nextUsername?: string) => run(nextUsername, true),
    execute: (nextUsername?: string) => run(nextUsername, true),
    reset,
  };
}
