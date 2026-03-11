import { useMemo, useState } from "react";
import BackButton from "../components/shared/BackButton";
import CopyButton from "../components/shared/CopyButton";
import EmptyState from "../components/shared/EmptyState";
import ResetButton from "../components/shared/ResetButton";
import ResultCard from "../components/shared/ResultCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Select from "../components/ui/Select";
import Textarea from "../components/ui/Textarea";
import { jsonFormatter } from "../logic/jsonFormatter";

export default function JsonFormatter() {
  const [input, setInput] = useState('{"name":"worker-ui","tools":["regex","json"]}');
  const [indent, setIndent] = useState("2");
  const [sortKeys, setSortKeys] = useState("no");
  const [formatted, setFormatted] = useState("");
  const [minified, setMinified] = useState("");
  const [error, setError] = useState("");

  const run = () => {
    const formatResult = jsonFormatter(input, "format", {
      indent: Number(indent),
      sortKeys: sortKeys === "yes",
    });
    const minifyResult = jsonFormatter(input, "minify");

    if (!formatResult.ok || !minifyResult.ok) {
      setFormatted("");
      setMinified("");
      setError(formatResult.error || minifyResult.error || "Invalid JSON");
      return;
    }

    setFormatted(formatResult.output);
    setMinified(minifyResult.output);
    setError("");
  };

  const reset = () => {
    setInput('{"name":"worker-ui","tools":["regex","json"]}');
    setIndent("2");
    setSortKeys("no");
    setFormatted("");
    setMinified("");
    setError("");
  };

  const copyValue = useMemo(
    () =>
      [
        `Input:\n${input}`,
        `Error: ${error || "None"}`,
        `Formatted:\n${formatted}`,
        `Minified:\n${minified}`,
      ].join("\n\n"),
    [error, formatted, input, minified],
  );

  return (
    <div className="space-y-6">
      <BackButton />
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">JSON Formatter</h1>
        <p className="text-sm text-slate-400">Format, validate, and minify JSON payloads.</p>

        <label className="space-y-2 text-sm">
          <span>JSON Input</span>
          <Textarea value={input} onChange={(event) => setInput(event.target.value)} />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span>Indent</span>
            <Select value={indent} onChange={(event) => setIndent(event.target.value)}>
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="0">0 spaces</option>
            </Select>
          </label>

          <label className="space-y-2 text-sm">
            <span>Sort keys</span>
            <Select value={sortKeys} onChange={(event) => setSortKeys(event.target.value)}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </Select>
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={run}>Format JSON</Button>
          <ResetButton onClick={reset} />
          <CopyButton value={copyValue} />
        </div>
      </Card>

      {formatted || minified || error ? (
        <ResultCard>
          {error ? <p className="text-sm text-rose-200">Error: {error}</p> : null}
          {formatted ? (
            <div className="space-y-3">
              <div>
                <p className="mb-2 text-sm text-slate-300">Formatted</p>
                <pre className="overflow-x-auto rounded-lg bg-slate-900/70 p-3 text-xs text-slate-200">{formatted}</pre>
              </div>
              <div>
                <p className="mb-2 text-sm text-slate-300">Minified</p>
                <pre className="overflow-x-auto rounded-lg bg-slate-900/70 p-3 text-xs text-slate-200">{minified}</pre>
              </div>
            </div>
          ) : null}
        </ResultCard>
      ) : (
        <EmptyState message="No formatted JSON yet." />
      )}
    </div>
  );
}
