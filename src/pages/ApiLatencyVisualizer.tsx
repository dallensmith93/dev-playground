import { useMemo } from "react";
import BackButton from "../components/shared/BackButton";
import CopyButton from "../components/shared/CopyButton";
import EmptyState from "../components/shared/EmptyState";
import ResultCard from "../components/shared/ResultCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import ProgressBar from "../components/ui/ProgressBar";
import { useApiLatency } from "../hooks/useApiLatency";

export default function ApiLatencyVisualizer() {
  const { measurements, summary, isLoading, error, fromCache, lastUpdated, run } = useApiLatency({ autoRun: false });

  const healthScore = Math.max(0, Math.min(100, Math.round(summary.successRate)));

  const copyValue = useMemo(() => {
    if (measurements.length === 0 && !error) return "";
    return [
      `From Cache: ${fromCache}`,
      `Last Updated: ${lastUpdated ? new Date(lastUpdated).toISOString() : "-"}`,
      `Average: ${summary.averageMs.toFixed(1)} ms`,
      `Fastest: ${summary.fastestMs.toFixed(1)} ms`,
      `Slowest: ${summary.slowestMs.toFixed(1)} ms`,
      `Success Rate: ${summary.successRate.toFixed(1)}%`,
      `Error: ${error || "None"}`,
      `Measurements:\n${JSON.stringify(measurements, null, 2)}`,
    ].join("\n\n");
  }, [measurements, summary, error, fromCache, lastUpdated]);

  return (
    <div className="space-y-6">
      <BackButton />
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">API Latency Visualizer</h1>
        <p className="text-sm text-slate-400">Run latency checks against default API targets and compare performance.</p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => void run()} disabled={isLoading}>
            {isLoading ? "Testing..." : "Run Latency Checks"}
          </Button>
          <CopyButton value={copyValue} />
        </div>
      </Card>

      {measurements.length > 0 || error ? (
        <ResultCard>
          <div className="space-y-4">
            <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">Average</p>
                <p className="mt-1 text-xl font-semibold">{summary.averageMs.toFixed(1)} ms</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">Fastest</p>
                <p className="mt-1 text-xl font-semibold">{summary.fastestMs.toFixed(1)} ms</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">Slowest</p>
                <p className="mt-1 text-xl font-semibold">{summary.slowestMs.toFixed(1)} ms</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">Success</p>
                <p className="mt-1 text-xl font-semibold">{summary.successRate.toFixed(1)}%</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm text-slate-300">Request health</p>
              <ProgressBar value={healthScore} />
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <p>From cache: {fromCache ? "Yes" : "No"}</p>
              <p>Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : "-"}</p>
            </div>

            {error ? <p className="text-sm text-rose-200">Error: {error}</p> : null}

            <div className="space-y-2">
              {measurements.map((measurement) => (
                <div key={`${measurement.targetKey}-${measurement.startedAt}`} className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-sm">
                  <p className="font-medium text-slate-100">{measurement.label}</p>
                  <p className="text-slate-400">{measurement.url}</p>
                  <p className="mt-1 text-slate-200">{measurement.ok ? `${measurement.durationMs.toFixed(1)} ms` : measurement.error || "Request failed"}</p>
                  <p className="text-xs text-slate-400">
                    Status: {measurement.status ?? "-"} | Started: {new Date(measurement.startedAt).toLocaleTimeString()} | Ended:{" "}
                    {new Date(measurement.endedAt).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ResultCard>
      ) : (
        <EmptyState message="No latency run yet." />
      )}
    </div>
  );
}
