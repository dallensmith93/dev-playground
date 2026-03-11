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
import Select from "../components/ui/Select";
import Textarea from "../components/ui/Textarea";
import { useApiRequest } from "../hooks/useApiRequest";
import type { ApiMethod } from "../types/api";

function toCurl(method: string, url: string, headers: Record<string, string>, body: unknown): string {
  const headerArgs = Object.entries(headers)
    .map(([key, value]) => `-H "${key}: ${value}"`)
    .join(" ");
  const bodyArg = body === undefined ? "" : `-d '${typeof body === "string" ? body.replace(/'/g, "'\\''") : JSON.stringify(body)}'`;
  return [`curl -X ${method}`, headerArgs, bodyArg, `"${url}"`].filter(Boolean).join(" ");
}

export default function ApiRequestBuilder() {
  const [method, setMethod] = useState<ApiMethod>("GET");
  const [url, setUrl] = useState("https://api.github.com");
  const [headersText, setHeadersText] = useState('{"Accept":"application/json"}');
  const [bodyText, setBodyText] = useState('{"hello":"world"}');
  const [curlCommand, setCurlCommand] = useState("");
  const [inputError, setInputError] = useState("");

  const { result, isLoading, error, run, reset } = useApiRequest({ autoRun: false, enabled: true });

  const request = async () => {
    try {
      setInputError("");
      const headers = JSON.parse(headersText) as Record<string, string>;
      const body = method === "GET" || method === "HEAD" || !bodyText.trim() ? undefined : JSON.parse(bodyText);

      setCurlCommand(toCurl(method, url, headers, body));
      await run({ method, url, headers, body, responseType: "auto" });
    } catch (errorObject) {
      setCurlCommand("");
      setInputError(errorObject instanceof Error ? errorObject.message : "Invalid request input");
    }
  };

  const resetAll = () => {
    setMethod("GET");
    setUrl("https://api.github.com");
    setHeadersText('{"Accept":"application/json"}');
    setBodyText('{"hello":"world"}');
    setCurlCommand("");
    setInputError("");
    reset();
  };

  const statusScore = useMemo(() => {
    if (!result?.response) return 0;
    return result.response.ok ? 100 : Math.max(10, 100 - result.response.status);
  }, [result]);

  const copyValue = useMemo(
    () =>
      [
        `Method: ${method}`,
        `URL: ${url}`,
        `Headers:\n${headersText}`,
        `Body:\n${bodyText}`,
        `Error: ${inputError || error || "None"}`,
        `Curl:\n${curlCommand}`,
        `Response:\n${JSON.stringify(result, null, 2)}`,
      ].join("\n\n"),
    [bodyText, curlCommand, error, headersText, inputError, method, result, url],
  );

  return (
    <div className="space-y-6">
      <BackButton />
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">API Request Builder</h1>
        <p className="text-sm text-slate-400">Build an HTTP request and inspect response output.</p>

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="space-y-2 text-sm">
            <span>Method</span>
            <Select value={method} onChange={(event) => setMethod(event.target.value as ApiMethod)}>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
              <option value="HEAD">HEAD</option>
            </Select>
          </label>

          <label className="space-y-2 text-sm sm:col-span-2">
            <span>URL</span>
            <Input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://api.example.com" />
          </label>
        </div>

        <label className="space-y-2 text-sm">
          <span>Headers (JSON)</span>
          <Textarea value={headersText} onChange={(event) => setHeadersText(event.target.value)} className="min-h-20" />
        </label>

        <label className="space-y-2 text-sm">
          <span>Body (JSON)</span>
          <Textarea value={bodyText} onChange={(event) => setBodyText(event.target.value)} className="min-h-20" />
        </label>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => void request()} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Request"}
          </Button>
          <ResetButton onClick={resetAll} />
          <CopyButton value={copyValue} />
        </div>
      </Card>

      {result || error || inputError || curlCommand ? (
        <ResultCard>
          <div className="space-y-3">
            {curlCommand ? (
              <div>
                <p className="mb-2 text-sm text-slate-300">Curl Command</p>
                <pre className="overflow-x-auto rounded-lg bg-slate-900/70 p-3 text-xs text-slate-200">{curlCommand}</pre>
              </div>
            ) : null}

            {result?.response ? (
              <>
                <p className="text-sm text-slate-200">
                  Status: {result.response.status} {result.response.statusText} | Duration: {result.durationMs.toFixed(1)}ms
                </p>
                <ProgressBar value={statusScore} />
                <pre className="overflow-x-auto rounded-lg bg-slate-900/70 p-3 text-xs text-slate-200">{JSON.stringify(result.response.data, null, 2)}</pre>
              </>
            ) : null}

            {inputError ? <p className="text-sm text-rose-200">Input error: {inputError}</p> : null}
            {error ? <p className="text-sm text-rose-200">Request error: {error}</p> : null}
          </div>
        </ResultCard>
      ) : (
        <EmptyState message="No request sent yet." />
      )}
    </div>
  );
}
