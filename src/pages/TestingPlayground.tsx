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
import { testingEngine } from "../logic/testingEngine";
import type { TestCaseInput, TestEngineResult } from "../types/testEngine";

const defaultTestCases = JSON.stringify(
  [
    { name: "adds positives", args: [2, 3], expected: 5 },
    { name: "adds negatives", args: [-2, -3], expected: -5 },
  ],
  null,
  2,
);

export default function TestingPlayground() {
  const engine = testingEngine();

  const [functionSource, setFunctionSource] = useState("(a, b) => a + b");
  const [testCasesJson, setTestCasesJson] = useState(defaultTestCases);
  const [timeoutMs, setTimeoutMs] = useState("250");
  const [result, setResult] = useState<TestEngineResult | null>(null);
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const run = async () => {
    setIsRunning(true);
    setError("");
    try {
      const parsed = JSON.parse(testCasesJson) as TestCaseInput[];
      const timeout = Number(timeoutMs);
      const next = await engine.runUserTests(functionSource, parsed, {
        timeoutMs: Number.isFinite(timeout) ? timeout : 250,
      });
      setResult(next);
    } catch (errorObject) {
      setError(errorObject instanceof Error ? errorObject.message : "Could not run tests.");
      setResult(null);
    } finally {
      setIsRunning(false);
    }
  };

  const reset = () => {
    setFunctionSource("(a, b) => a + b");
    setTestCasesJson(defaultTestCases);
    setTimeoutMs("250");
    setResult(null);
    setError("");
  };

  const passRate = result && result.results.length > 0 ? (result.passCount / result.results.length) * 100 : 0;

  const copyValue = useMemo(() => {
    if (!result && !error) return "";
    return [
      `Function:\n${functionSource}`,
      `Test Cases:\n${testCasesJson}`,
      `Timeout: ${timeoutMs}ms`,
      `Error: ${error || "None"}`,
      `Result:\n${JSON.stringify(result, null, 2)}`,
    ].join("\n\n");
  }, [functionSource, testCasesJson, timeoutMs, error, result]);

  return (
    <div className="space-y-6">
      <BackButton />
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Testing Playground</h1>
        <p className="text-sm text-slate-400">Run lightweight browser-side test cases against a function snippet.</p>

        <label className="space-y-2 text-sm">
          <span>Function Source</span>
          <Textarea value={functionSource} onChange={(event) => setFunctionSource(event.target.value)} className="min-h-20" />
        </label>

        <label className="space-y-2 text-sm">
          <span>Test Cases (JSON)</span>
          <Textarea value={testCasesJson} onChange={(event) => setTestCasesJson(event.target.value)} />
        </label>

        <label className="space-y-2 text-sm">
          <span>Timeout (ms)</span>
          <Input type="number" min={50} value={timeoutMs} onChange={(event) => setTimeoutMs(event.target.value)} />
        </label>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => void run()} disabled={isRunning}>
            {isRunning ? "Running..." : "Run Tests"}
          </Button>
          <ResetButton onClick={reset} />
          <CopyButton value={copyValue} />
        </div>
      </Card>

      {result || error ? (
        <ResultCard>
          {error ? <p className="text-sm text-rose-200">Error: {error}</p> : null}
          {result ? (
            <div className="space-y-3 text-sm text-slate-200">
              {result.compileError ? <p className="text-rose-200">Compile error: {result.compileError}</p> : null}
              <p>Passed: {result.passCount} | Failed: {result.failCount}</p>
              <ProgressBar value={passRate} />
              <div className="space-y-2">
                {result.results.map((entry) => (
                  <div key={entry.name} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                    <p className="font-medium text-slate-100">{entry.name}</p>
                    <p className={entry.pass ? "text-emerald-200" : "text-rose-200"}>{entry.pass ? "Pass" : `Fail: ${entry.error || "Assertion failed"}`}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </ResultCard>
      ) : (
        <EmptyState message="No test run yet." />
      )}
    </div>
  );
}
