export type LatencyTarget = {
  key: string;
  label: string;
  url: string;
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  body?: string;
};

export type LatencyMeasurement = {
  targetKey: string;
  label: string;
  url: string;
  durationMs: number;
  startedAt: number;
  endedAt: number;
  ok: boolean;
  status?: number;
  statusText?: string;
  error?: string;
};

export type LatencySummary = {
  averageMs: number;
  fastestMs: number;
  slowestMs: number;
  successRate: number;
};

export const DEFAULT_LATENCY_TARGETS: LatencyTarget[] = [
  {
    key: "countries",
    label: "Countries GraphQL",
    url: "https://countries.trevorblades.com/",
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query: "{ __typename }" }),
  },
  {
    key: "spacex",
    label: "SpaceX GraphQL",
    url: "https://api.spacex.land/graphql/",
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query: "{ company { name } }" }),
  },
  {
    key: "github",
    label: "GitHub Users",
    url: "https://api.github.com/users/octocat",
    method: "GET",
    headers: { accept: "application/vnd.github+json" },
  },
];
