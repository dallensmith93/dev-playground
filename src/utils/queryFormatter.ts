import type { GraphQLVariables } from "../types/graphql";

export function formatGraphQLQuery(query: string): string {
  return query
    .trim()
    .replace(/[\t\n\r]+/g, " ")
    .replace(/\s{2,}/g, " ");
}

export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  const entries = Object.entries(value as Record<string, unknown>)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, entryValue]) => `${JSON.stringify(key)}:${stableStringify(entryValue)}`);

  return `{${entries.join(",")}}`;
}

export function buildGraphQLCacheKey(endpoint: string, query: string, variables?: GraphQLVariables): string {
  const normalizedQuery = formatGraphQLQuery(query);
  const normalizedVariables = variables ? stableStringify(variables) : "{}";
  return `${endpoint}::${normalizedQuery}::${normalizedVariables}`;
}
