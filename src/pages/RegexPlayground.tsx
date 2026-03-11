import { useMemo, useState } from "react";
import BackButton from "../components/shared/BackButton";
import CopyButton from "../components/shared/CopyButton";
import EmptyState from "../components/shared/EmptyState";
import ResetButton from "../components/shared/ResetButton";
import ResultCard from "../components/shared/ResultCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import ProgressBar from "../components/ui/ProgressBar";
import Textarea from "../components/ui/Textarea";
import { useRegexTest } from "../hooks/useRegexTest";

export default function RegexPlayground() {
  const [pattern, setPattern] = useState("\\b\\w{4}\\b");
  const [flags, setFlags] = useState("gi");
  const [source, setSource] = useState("Ship fast. Fix later. Test never.");

  const { result, isLoading, error, run, reset } = useRegexTest({
    autoRun: false,
    pattern,
    flags,
    text: source,
    maxMatches: 500,
  });

  const runRegex = async () => {
    await run({ pattern, flags, text: source, maxMatches: 500 });
  };

  const clearAll = () => {
    setPattern("\\b\\w{4}\\b");
    setFlags("gi");
    setSource("Ship fast. Fix later. Test never.");
    reset();
  };

  const coverage = useMemo(() => {
    if (!result || !source.length) return 0;
    const total = result.matches.reduce((sum, match) => sum + match.value.length, 0);
    return Math.min(100, (total / source.length) * 100);
  }, [result, source]);

  const copyValue = useMemo(
    () =>
      [
        `Pattern: /${pattern}/${flags}`,
        `Text:\n${source}`,
        `Error: ${error || "None"}`,
        `Result:\n${JSON.stringify(result, null, 2)}`,
      ].join("\n\n"),
    [error, flags, pattern, result, source],
  );

  return (
    <div className="space-y-6">
      <BackButton />
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Regex Playground</h1>
        <p className="text-sm text-slate-400">Test regex patterns and inspect match details quickly.</p>

        <label className="space-y-2 text-sm">
          <span>Pattern</span>
          <Input value={pattern} onChange={(event) => setPattern(event.target.value)} placeholder="\\b\\w+\\b" />
        </label>

        <label className="space-y-2 text-sm">
          <span>Flags</span>
          <Input value={flags} onChange={(event) => setFlags(event.target.value)} placeholder="gi" />
        </label>

        <label className="space-y-2 text-sm">
          <span>Text</span>
          <Textarea value={source} onChange={(event) => setSource(event.target.value)} />
        </label>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => void runRegex()} disabled={isLoading}>
            {isLoading ? "Running..." : "Run Regex"}
          </Button>
          <ResetButton onClick={clearAll} />
          <CopyButton value={copyValue} />
        </div>
      </Card>

      {result || error ? (
        <ResultCard>
          {error ? <p className="text-sm text-rose-200">Error: {error}</p> : null}
          {result ? (
            <div className="space-y-3 text-sm text-slate-200">
              <p>
                Valid: {result.isValid ? "Yes" : "No"} | Matches: {result.matchCount} | Duration: {result.durationMs.toFixed(2)}ms
              </p>
              <ProgressBar value={coverage} />
              {result.matches.length > 0 ? (
                <pre className="overflow-x-auto rounded-lg bg-slate-900/70 p-3 text-xs text-slate-200">{JSON.stringify(result.matches, null, 2)}</pre>
              ) : (
                <p className="text-slate-400">No matches found.</p>
              )}
            </div>
          ) : null}
        </ResultCard>
      ) : (
        <EmptyState message="No regex run yet." />
      )}
    </div>
  );
}
