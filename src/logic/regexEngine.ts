import type { RegexTestInput, RegexTestResult } from "../types/regex";
import { collectRegexMatches, compileRegex } from "../utils/regexUtils";

export type RegexEngineApi = {
  test: (input: RegexTestInput) => RegexTestResult;
  run: (input: RegexTestInput) => RegexTestResult;
};

function nowMs(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

function runRegexEngine(input: RegexTestInput): RegexTestResult {
  const started = nowMs();
  const compiled = compileRegex(input.pattern, input.flags ?? "");

  if (!compiled.regex) {
    return {
      source: input.pattern,
      flags: compiled.flags,
      isValid: false,
      hasMatch: false,
      matchCount: 0,
      matches: [],
      error: compiled.error,
      durationMs: Math.max(0, nowMs() - started),
    };
  }

  const matches = collectRegexMatches(compiled.regex, input.text, input.maxMatches ?? 500);

  return {
    source: compiled.regex.source,
    flags: compiled.flags,
    isValid: true,
    hasMatch: matches.length > 0,
    matchCount: matches.length,
    matches,
    error: null,
    durationMs: Math.max(0, nowMs() - started),
  };
}

export function regexEngine(): RegexEngineApi;
export function regexEngine(input: RegexTestInput): RegexTestResult;
export function regexEngine(input?: RegexTestInput): RegexEngineApi | RegexTestResult {
  if (!input) {
    return {
      test: runRegexEngine,
      run: runRegexEngine,
    };
  }

  return runRegexEngine(input);
}
