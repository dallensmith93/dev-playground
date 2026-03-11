import type {
  GithubLanguageUsage,
  GithubRepo,
  GithubRepoApiResponse,
  GithubStats,
  GithubUser,
  GithubUserApiResponse,
  GithubUserResult,
} from "../types/github";
import { fetchJson } from "../utils/fetcher";

const GITHUB_API_BASE = "https://api.github.com/users";

function sanitizeUsername(username: string): string {
  return username.trim().replace(/^@+/, "");
}

function mapGithubUser(payload: GithubUserApiResponse): GithubUser {
  return {
    login: payload.login,
    id: payload.id,
    avatarUrl: payload.avatar_url,
    profileUrl: payload.html_url,
    name: payload.name,
    bio: payload.bio,
    company: payload.company,
    location: payload.location,
    website: payload.blog || null,
    twitter: payload.twitter_username,
    publicRepos: payload.public_repos,
    followers: payload.followers,
    following: payload.following,
    createdAt: payload.created_at,
    updatedAt: payload.updated_at,
  };
}

function computeGithubStats(payload: GithubUserApiResponse): GithubStats {
  const now = Date.now();
  const createdAt = new Date(payload.created_at).getTime();
  const ageMs = Number.isFinite(createdAt) ? Math.max(0, now - createdAt) : 0;
  const accountAgeDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
  const followerToFollowingRatio = payload.followers / Math.max(1, payload.following);

  return {
    repoCount: payload.public_repos,
    followers: payload.followers,
    following: payload.following,
    followerToFollowingRatio,
    accountAgeDays,
  };
}

function mapGithubRepo(repo: GithubRepoApiResponse): GithubRepo {
  return {
    id: repo.id,
    name: repo.name,
    url: repo.html_url,
    description: repo.description,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    updatedAt: repo.updated_at,
  };
}

function computeLanguageUsage(repos: GithubRepo[]): GithubLanguageUsage[] {
  const counts: Record<string, number> = {};
  for (const repo of repos) {
    const key = repo.language || "Unknown";
    counts[key] = (counts[key] ?? 0) + 1;
  }

  return Object.entries(counts)
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count);
}

export async function fetchGithubUserStats(
  username: string,
  options: { timeoutMs?: number; signal?: AbortSignal } = {},
): Promise<GithubUserResult> {
  if (typeof window === "undefined") {
    throw new Error("GitHub requests are only available in the browser");
  }

  const cleanUsername = sanitizeUsername(username);
  if (!cleanUsername) {
    throw new Error("GitHub username is required");
  }

  const payload = await fetchJson<GithubUserApiResponse>(
    `${GITHUB_API_BASE}/${encodeURIComponent(cleanUsername)}`,
    {
      headers: {
        accept: "application/vnd.github+json",
      },
      signal: options.signal,
    },
    {
      timeoutMs: options.timeoutMs,
      signal: options.signal,
    },
  );

  const repoPayload = await fetchJson<GithubRepoApiResponse[]>(
    `${GITHUB_API_BASE}/${encodeURIComponent(cleanUsername)}/repos?sort=updated&per_page=20`,
    {
      headers: {
        accept: "application/vnd.github+json",
      },
      signal: options.signal,
    },
    {
      timeoutMs: options.timeoutMs,
      signal: options.signal,
    },
  );

  const mappedRepos = repoPayload.map(mapGithubRepo);
  const recentRepos = mappedRepos.slice(0, 5);

  return {
    user: mapGithubUser(payload),
    stats: computeGithubStats(payload),
    recentRepos,
    languageUsage: computeLanguageUsage(mappedRepos),
    fetchedAt: Date.now(),
    fromCache: false,
  };
}

export { sanitizeUsername };
