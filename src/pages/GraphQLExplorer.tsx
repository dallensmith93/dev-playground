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
import { useGraphQLQuery } from "../hooks/useGraphQLQuery";
import type { GraphQLVariables } from "../types/graphql";

export default function GraphQLExplorer() {
  const [endpoint, setEndpoint] = useState("https://countries.trevorblades.com/");
  const [query, setQuery] = useState("{ countries { code name emoji } }");
  const [variablesText, setVariablesText] = useState("{}");
  const [hasRun, setHasRun] = useState(false);

  const variablesError = useMemo(() => {
    if (!variablesText.trim()) return "";
    try {
      JSON.parse(variablesText);
      return "";
    } catch {
      return "Variables must be valid JSON.";
    }
  }, [variablesText]);

  const variables = useMemo(() => {
    if (!variablesText.trim() || variablesError) return undefined;
    return JSON.parse(variablesText) as GraphQLVariables;
  }, [variablesError, variablesText]);

  const canRun = endpoint.trim().length > 0 && query.trim().length > 0 && !variablesError;

  const { data, isLoading, error, fromCache, lastUpdated, refetch } = useGraphQLQuery<Record<string, unknown>>({
    endpoint,
    query,
    variables,
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
    setEndpoint("https://countries.trevorblades.com/");
    setQuery("{ countries { code name emoji } }");
    setVariablesText("{}");
    setHasRun(false);
  };

  const copyValue = useMemo(() => {
    if (!hasRun || (!data && !error)) return "";
    return [
      `Endpoint: ${endpoint}`,
      `Query:\n${query}`,
      `Variables:\n${variablesText}`,
      `From Cache: ${fromCache}`,
      `Last Updated: ${lastUpdated ? new Date(lastUpdated).toISOString() : "-"}`,
      `Error: ${error || "None"}`,
      `Response:\n${JSON.stringify(data, null, 2)}`,
    ].join("\n\n");
  }, [endpoint, query, variablesText, hasRun, data, error, fromCache, lastUpdated]);

  return (
    <div className="space-y-6">
      <BackButton />
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">GraphQL Explorer</h1>
        <p className="text-sm text-slate-400">Run GraphQL queries and inspect response payloads quickly.</p>

        <label className="space-y-2 text-sm">
          <span>Endpoint</span>
          <Select value={endpoint} onChange={(event) => setEndpoint(event.target.value)}>
            <option value="https://countries.trevorblades.com/">Countries GraphQL API</option>
            <option value="https://api.spacex.land/graphql/">SpaceX GraphQL API</option>
          </Select>
        </label>

        <label className="space-y-2 text-sm">
          <span>Query</span>
          <Textarea value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>

        <label className="space-y-2 text-sm">
          <span>Variables (JSON)</span>
          <Textarea value={variablesText} onChange={(event) => setVariablesText(event.target.value)} className="min-h-20" />
          {variablesError ? <p className="text-xs text-rose-300">{variablesError}</p> : null}
        </label>

        <div className="flex flex-wrap gap-3">
          <Button onClick={run} disabled={!canRun || isLoading}>
            {isLoading ? "Running..." : "Run Query"}
          </Button>
          <ResetButton onClick={reset} />
          <CopyButton value={copyValue} />
        </div>
      </Card>

      {hasRun && (data || error) ? (
        <ResultCard>
          <div className="space-y-2 text-xs text-slate-300">
            <p>From cache: {fromCache ? "Yes" : "No"}</p>
            <p>Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : "-"}</p>
          </div>
          {error ? <p className="mt-2 text-sm text-rose-200">Error: {error}</p> : null}
          {data ? <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900/70 p-3 text-xs text-slate-200">{JSON.stringify(data, null, 2)}</pre> : null}
        </ResultCard>
      ) : (
        <EmptyState message="No response yet. Run a query to see output." />
      )}
    </div>
  );
}
