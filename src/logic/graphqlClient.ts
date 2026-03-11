import type {
  GraphQLEndpoint,
  GraphQLErrorItem,
  GraphQLRawResponse,
  GraphQLRequestInput,
  GraphQLResult,
} from "../types/graphql";
import { GRAPHQL_ENDPOINTS } from "../types/graphql";
import { fetchJson } from "../utils/fetcher";
import { formatGraphQLQuery } from "../utils/queryFormatter";

function resolveGraphQLEndpoint(endpoint: GraphQLEndpoint): string {
  if (endpoint in GRAPHQL_ENDPOINTS) {
    return GRAPHQL_ENDPOINTS[endpoint as keyof typeof GRAPHQL_ENDPOINTS];
  }
  return endpoint;
}

function formatGraphQLErrors(errors: GraphQLErrorItem[]): string {
  return errors.map((item) => item.message).join("; ");
}

export async function requestGraphQL<TData>(input: GraphQLRequestInput): Promise<GraphQLResult<TData>> {
  if (typeof window === "undefined") {
    throw new Error("GraphQL requests are only available in the browser");
  }

  const endpoint = resolveGraphQLEndpoint(input.endpoint);
  const query = formatGraphQLQuery(input.query);

  if (!query) {
    throw new Error("GraphQL query is required");
  }

  const payload = await fetchJson<GraphQLRawResponse<TData>>(
    endpoint,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: input.variables ?? {},
      }),
      signal: input.signal,
    },
    {
      timeoutMs: input.timeoutMs,
      signal: input.signal,
    },
  );

  if (payload.errors?.length) {
    throw new Error(formatGraphQLErrors(payload.errors));
  }

  if (payload.data === undefined) {
    throw new Error("GraphQL response did not include data");
  }

  return {
    data: payload.data,
    endpoint,
    queriedAt: Date.now(),
    fromCache: false,
  };
}

export { resolveGraphQLEndpoint };
