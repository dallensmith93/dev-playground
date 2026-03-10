import { useState } from "react";
import BackButton from "../components/shared/BackButton";
import CopyButton from "../components/shared/CopyButton";
import ResetButton from "../components/shared/ResetButton";
import ResultCard from "../components/shared/ResultCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import ProgressBar from "../components/ui/ProgressBar";
import Textarea from "../components/ui/Textarea";
import { analyzeJobDescription } from "../logic/jobDescriptionChecker";

export default function JobDescriptionChecker() {
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<ReturnType<typeof analyzeJobDescription> | null>(null);

  const run = () => setResult(analyzeJobDescription(description));
  const reset = () => {
    setDescription("");
    setResult(null);
  };

  const copyPayload = result
    ? [
        `Scam Risk Score: ${result.scamRiskScore}/100`,
        `Verdict: ${result.verdict}`,
        `Recommendation: ${result.recommendation}`,
        `Red Flags: ${result.redFlags.join("; ")}`,
        `Good Signs: ${result.goodSigns.join("; ")}`,
      ].join("\n")
    : "";

  return (
    <div className="space-y-6">
      <BackButton />
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Job Description Checker</h1>
        <p className="text-sm text-slate-400">Browser-only heuristic scan for scam patterns and quality signals. Not a definitive fraud detector.</p>
        <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Paste the full job description here" />
        <div className="flex flex-wrap gap-3">
          <Button onClick={run}>Check Posting</Button>
          <ResetButton onClick={reset} />
          <CopyButton value={copyPayload} />
        </div>
      </Card>
      {result ? (
        <ResultCard>
          <div className="space-y-3 text-sm">
            <p className="text-slate-200">Verdict: <span className="font-semibold">{result.verdict}</span></p>
            <ProgressBar value={result.scamRiskScore} />
            <p className="text-slate-300">Scam Risk Score: {result.scamRiskScore}/100</p>
            <div>
              <h2 className="font-medium text-rose-200">Red Flags Found</h2>
              <ul className="list-disc space-y-1 pl-5 text-slate-300">
                {result.redFlags.map((flag) => (
                  <li key={flag}>{flag}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-medium text-emerald-200">Good Signs Found</h2>
              <ul className="list-disc space-y-1 pl-5 text-slate-300">
                {result.goodSigns.map((good) => (
                  <li key={good}>{good}</li>
                ))}
              </ul>
            </div>
            <p className="text-slate-200">Recommendation: {result.recommendation}</p>
          </div>
        </ResultCard>
      ) : null}
    </div>
  );
}
