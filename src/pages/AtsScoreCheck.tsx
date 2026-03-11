import { useMemo, useState } from "react";
import BackButton from "../components/shared/BackButton";
import CopyButton from "../components/shared/CopyButton";
import ResetButton from "../components/shared/ResetButton";
import ResultCard from "../components/shared/ResultCard";
import ToolHistory from "../components/history/ToolHistory";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import ProgressBar from "../components/ui/ProgressBar";
import Textarea from "../components/ui/Textarea";
import { useToolHistory } from "../hooks/useToolHistory";
import { analyzeAts } from "../logic/atsScore";
import { buildSharePath } from "../logic/shareEncoder";
import type { HistoryEntry } from "../types/history";

export default function AtsScoreCheck() {
  const [resumeText, setResumeText] = useState("");
  const [jobText, setJobText] = useState("");
  const [result, setResult] = useState<ReturnType<typeof analyzeAts> | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const { addEntry } = useToolHistory("ats-score-check");

  const canAnalyze = resumeText.trim().length > 30;

  const copyValue = useMemo(() => {
    if (!result) return "";
    return [
      `ATS Score: ${result.score}`,
      `Keyword Coverage: ${result.keywordCoverage}%`,
      `Strong Signals: ${result.strongSignals.join("; ")}`,
      `Weak Signals: ${result.weakSignals.join("; ")}`,
      `Missing Terms: ${result.missingTerms.join(", ")}`,
      `Suggestions: ${result.suggestions.join("; ")}`,
    ].join("\n");
  }, [result]);

  const shareValue = useMemo(() => {
    if (!result) return "";
    const payload = [
      `ATS Score: ${result.score}`,
      `Keyword Coverage: ${result.keywordCoverage}%`,
      `Strong Signals: ${result.strongSignals.join("; ")}`,
      `Weak Signals: ${result.weakSignals.join("; ")}`,
      `Missing Terms: ${result.missingTerms.join(", ")}`,
      `Suggestions: ${result.suggestions.join("; ")}`,
    ].join("\n");
    return `${window.location.origin}${buildSharePath({ tool: "ats-score-check", result: payload })}`;
  }, [result]);

  const copyShareLink = async () => {
    if (!shareValue) return;
    await navigator.clipboard.writeText(shareValue);
    setShareCopied(true);
    window.setTimeout(() => setShareCopied(false), 1500);
  };

  const runAnalysis = () => {
    const next = analyzeAts(resumeText, jobText);
    setResult(next);
    addEntry(resumeText, `Score ${next.score} | Coverage ${next.keywordCoverage}%`);
  };

  const restoreHistory = (entry: HistoryEntry) => {
    setResumeText(entry.input);
  };

  return (
    <div className="space-y-5">
      <BackButton />
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">ATS Score Check</h1>
        <p className="text-sm text-slate-400">
          Browser-only heuristic helper. This is not a real ATS engine, but it gives practical wording feedback.
        </p>

        <label className="space-y-2 text-sm">
          <span>Resume text</span>
          <Textarea
            value={resumeText}
            onChange={(event) => setResumeText(event.target.value)}
            placeholder="Paste bullets or summary from your resume..."
          />
        </label>

        <label className="space-y-2 text-sm">
          <span>Target job description (optional but recommended)</span>
          <Textarea
            value={jobText}
            onChange={(event) => setJobText(event.target.value)}
            placeholder="Paste a job description for stronger keyword matching..."
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <Button onClick={runAnalysis} disabled={!canAnalyze}>
            Analyze ATS strength
          </Button>
          <ResetButton
            onClick={() => {
              setResumeText("");
              setJobText("");
              setResult(null);
            }}
          />
          <CopyButton value={copyValue} />
          <Button onClick={() => void copyShareLink()} variant="ghost" disabled={!result}>
            {shareCopied ? "Copied" : "Copy Share Link"}
          </Button>
        </div>
      </Card>

      {result ? (
        <ResultCard>
          <p className="text-sm uppercase tracking-wide text-cyan-200">Analysis result</p>
          <div className="mt-2 flex items-center justify-between gap-4">
            <p className="text-3xl font-semibold">{result.score}</p>
            <p className="text-sm text-slate-300">Keyword coverage: {result.keywordCoverage}%</p>
          </div>
          <div className="mt-3">
            <ProgressBar value={result.score} />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-emerald-200">Strong Signals</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                {result.strongSignals.length === 0 ? <li>None detected yet.</li> : result.strongSignals.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-amber-200">Weak Signals</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                {result.weakSignals.length === 0 ? <li>None detected.</li> : result.weakSignals.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-rose-200">Missing Terms</h3>
              <p className="mt-2 text-sm text-slate-300">{result.missingTerms.length === 0 ? "No major gaps found." : result.missingTerms.join(", ")}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-cyan-100">Suggestions</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                {result.suggestions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </ResultCard>
      ) : null}
      <ToolHistory tool="ats-score-check" onRestore={restoreHistory} />
    </div>
  );
}

