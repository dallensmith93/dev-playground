export type GithubUserApiResponse = {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string;
  twitter_username: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
};

export type GithubRepoApiResponse = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
};

export type GithubUser = {
  login: string;
  id: number;
  avatarUrl: string;
  profileUrl: string;
  name: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  website: string | null;
  twitter: string | null;
  publicRepos: number;
  followers: number;
  following: number;
  createdAt: string;
  updatedAt: string;
};

export type GithubRepo = {
  id: number;
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
};

export type GithubStats = {
  repoCount: number;
  followers: number;
  following: number;
  followerToFollowingRatio: number;
  accountAgeDays: number;
};

export type GithubLanguageUsage = {
  language: string;
  count: number;
};

export type GithubUserResult = {
  user: GithubUser;
  stats: GithubStats;
  recentRepos: GithubRepo[];
  languageUsage: GithubLanguageUsage[];
  fetchedAt: number;
  fromCache: boolean;
};
