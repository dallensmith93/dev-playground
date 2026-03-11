import { REGEX_FLAG_ORDER, type RegexCompileResult, type RegexMatch } from "../types/regex";

const REGEX_FLAG_SET = new Set<string>(REGEX_FLAG_ORDER);

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Invalid regular expression";
}

export function normalizeRegexFlags(flags = ""): string {
  const seen = new Set<string>();

  for (const flag of flags.trim()) {
    if (!REGEX_FLAG_SET.has(flag)) {
      throw new Error(`Unsupported regex flag: ${flag}`);
    }
    seen.add(flag);
  }

  return REGEX_FLAG_ORDER.filter((flag) => seen.has(flag)).join("");
}

export function compileRegex(pattern: string, flags = ""): RegexCompileResult {
  try {
    const normalizedFlags = normalizeRegexFlags(flags);
    return {
      regex: new RegExp(pattern, normalizedFlags),
      flags: normalizedFlags,
      error: null,
    };
  } catch (error) {
    return {
      regex: null,
      flags: "",
      error: toErrorMessage(error),
    };
  }
}

function readGroups(match: RegExpExecArray): RegexMatch["groups"] {
  return match.slice(1).map((value, index) => ({
    index: index + 1,
    value: value ?? "",
  }));
}

function readNamedGroups(match: RegExpExecArray): Record<string, string> {
  const named = match.groups ?? {};
  return Object.fromEntries(Object.entries(named).map(([key, value]) => [key, value ?? ""]));
}

export function collectRegexMatches(regex: RegExp, text: string, maxMatches = 500): RegexMatch[] {
  if (maxMatches <= 0) return [];

  const matches: RegexMatch[] = [];

  if (!regex.global) {
    const single = regex.exec(text);
    if (!single) return [];

    return [
      {
        value: single[0] ?? "",
        index: single.index,
        groups: readGroups(single),
        namedGroups: readNamedGroups(single),
      },
    ];
  }

  regex.lastIndex = 0;

  while (matches.length < maxMatches) {
    const result = regex.exec(text);
    if (!result) break;

    matches.push({
      value: result[0] ?? "",
      index: result.index,
      groups: readGroups(result),
      namedGroups: readNamedGroups(result),
    });

    if (result[0] === "") {
      regex.lastIndex += 1;
      if (regex.lastIndex > text.length) break;
    }
  }

  return matches;
}
