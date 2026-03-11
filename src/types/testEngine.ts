export type TestCaseInput = {
  name: string;
  args?: unknown[];
  expected?: unknown;
  assertion?: string;
};

export type TestCaseResult = {
  name: string;
  pass: boolean;
  actual?: unknown;
  expected?: unknown;
  error?: string;
};

export type TestEngineOptions = {
  timeoutMs?: number;
};

export type TestEngineResult = {
  passCount: number;
  failCount: number;
  results: TestCaseResult[];
  compileError?: string;
};
