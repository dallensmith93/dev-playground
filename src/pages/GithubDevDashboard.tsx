import { useMemo, useState } from "react";
import BackButton from "../components/shared/BackButton";
import CopyButton from "../components/shared/CopyButton";
import EmptyState from "../components/shared/EmptyState";
import ResetButton from "../components/shared/ResetButton";
import ResultCard from "../components/shared/ResultCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import { useGithubUser } from "../hooks/useGithubUser";

export default function GithubDevDashboard() {
  const [username, setUsername] = useState("octocat");
  const [hasRun, setHasRun] = useState(false);

  const cleanUsername = username.trim();
  const canRun = cleanUsername.length > 0;

  const { user, stats, recentRepos, languageUsage, isLoading, error, fromCache, lastUpdated, refetch } = useGithubUser({
    username: cleanUsername,
    enabled: hasRun && canRun,
  });

  const run = async () => {
    if (!canRun) return;
    if (!hasRun) {
      setHasRun(true);
      return;
    }
    await refetch();
  };

  const reset = () => {
    setUsername("octocat");
    setHasRun(false);
  };

  const copyValue = useMemo(() => {
    if (!hasRun || (!user && !error)) return "";
    return [
      `Username: ${cleanUsername}`,
      `From Cache: ${fromCache}`,
      `Last Updated: ${lastUpdated ? new Date(lastUpdated).toISOString() : "-"}`,
      `Error: ${error || "None"}`,
      `User:\n${JSON.stringify(user, null, 2)}`,
      `Stats:\n${JSON.stringify(stats, null, 2)}`,
      `Language Usage:\n${JSON.stringify(languageUsage, null, 2)}`,
      `Recent Repos:\n${JSON.stringify(recentRepos, null, 2)}`,
    ].join("\n\n");
  }, [hasRun, cleanUsername, fromCache, lastUpdated, error, user, stats, languageUsage, recentRepos]);

  return (
    <div className="space-y-6">
      <BackButton />
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">GitHub Dev Dashboard</h1>
        <p className="text-sm text-slate-400">Fetch GitHub profile data and headline developer metrics.</p>

        <label className="space-y-2 text-sm">
          <span>Username</span>
          <Input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="octocat" />
        </label>

        <div className="flex flex-wrap gap-3">
          <Button onClick={run} disabled={!canRun || isLoading}>
            {isLoading ? "Loading..." : "Load Dashboard"}
          </Button>
          <ResetButton onClick={reset} />
          <CopyButton value={copyValue} />
        </div>
      </Card>

      {hasRun && (user || error) ? (
        <ResultCard>
          <div className="space-y-2 text-xs text-slate-300">
            <p>From cache: {fromCache ? "Yes" : "No"}</p>
            <p>Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : "-"}</p>
          </div>

          {error ? <p className="mt-2 text-sm text-rose-200">Error: {error}</p> : null}

          {user && stats ? (
            <div className="mt-3 space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">{user.name || user.login}</h2>
                <p className="text-sm text-slate-400">@{user.login}</p>
              </div>

              <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Repos</p>
                  <p className="mt-1 text-xl font-semibold">{stats.repoCount}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Followers</p>
                  <p className="mt-1 text-xl font-semibold">{stats.followers}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Following</p>
                  <p className="mt-1 text-xl font-semibold">{stats.following}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Follow Ratio</p>
                  <p className="mt-1 text-xl font-semibold">{stats.followerToFollowingRatio.toFixed(2)}</p>
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Language Usage</p>
                  <div className="mt-2 space-y-1 text-sm text-slate-200">
                    {languageUsage.length ? (
                      languageUsage.slice(0, 6).map((item) => (
                        <p key={item.language}>
                          {item.language}: {item.count} repo{item.count === 1 ? "" : "s"}
                        </p>
                      ))
                    ) : (
                      <p className="text-slate-400">No repository language data.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Recent Repositories</p>
                  <div className="mt-2 space-y-2 text-sm">
                    {recentRepos.length ? (
                      recentRepos.map((repo) => (
                        <div key={repo.id}>
                          <a href={repo.url} target="_blank" rel="noreferrer" className="font-medium text-cyan-200 hover:text-cyan-100">
                            {repo.name}
                          </a>
                          <p className="text-slate-400">{repo.language || "Unknown"} | Stars {repo.stars}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400">No recent repositories found.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </ResultCard>
      ) : (
        <EmptyState message="No profile loaded yet." />
      )}
    </div>
  );
}
