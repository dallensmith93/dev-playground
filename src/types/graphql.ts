export const GRAPHQL_ENDPOINTS = {
  countries: "https://countries.trevorblades.com/",
  spacex: "https://api.spacex.land/graphql/",
} as const;

export type GraphQLEndpointKey = keyof typeof GRAPHQL_ENDPOINTS;
export type GraphQLEndpoint = GraphQLEndpointKey | (string & {});
export type GraphQLVariables = Record<string, unknown>;

export type GraphQLErrorItem = {
  message: string;
  path?: Array<string | number>;
  extensions?: Record<string, unknown>;
};

export type GraphQLRawResponse<TData> = {
  data?: TData;
  errors?: GraphQLErrorItem[];
};

export type GraphQLRequestInput = {
  endpoint: GraphQLEndpoint;
  query: string;
  variables?: GraphQLVariables;
  timeoutMs?: number;
  signal?: AbortSignal;
};

export type GraphQLResult<TData> = {
  data: TData;
  endpoint: string;
  queriedAt: number;
  fromCache: boolean;
};
