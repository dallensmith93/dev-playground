import BackButton from "../components/shared/BackButton";
import CopyButton from "../components/shared/CopyButton";
import EmptyState from "../components/shared/EmptyState";
import ResultCard from "../components/shared/ResultCard";
import Card from "../components/ui/Card";
import { useShareResult } from "../hooks/useShareResult";

function prettyResult(value: string): string {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

function toolTitle(tool: string): string {
  if (tool === "ats-score-check") return "ATS Score Result";
  if (tool === "regex-playground") return "Regex Playground Result";
  if (tool === "json-formatter") return "JSON Formatter Result";
  return "Shared Tool Result";
}

export default function ShareToolResult() {
  const decoded = useShareResult();

  return (
    <div className="space-y-6">
      <BackButton />
      <Card className="space-y-3">
        <h1 className="text-2xl font-semibold">Shared Tool Result</h1>
        <p className="text-sm text-slate-400">Open shared outputs from Dev Playground tools.</p>
      </Card>

      {!decoded.ok || !decoded.payload ? (
        <EmptyState message={decoded.error || "Unable to decode this share link."} />
      ) : (
        <ResultCard>
          <div className="space-y-3">
            <p className="text-sm text-slate-300">Tool: <span className="font-medium text-slate-100">{decoded.payload.tool}</span></p>
            <p className="text-sm text-cyan-200">{toolTitle(decoded.payload.tool)}</p>
            <CopyButton value={decoded.payload.result} />
            <pre className="overflow-x-auto rounded-lg bg-slate-900/70 p-3 text-xs text-slate-200">
{prettyResult(decoded.payload.result)}
            </pre>
          </div>
        </ResultCard>
      )}
    </div>
  );
}
