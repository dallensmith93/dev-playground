export const REGEX_FLAG_ORDER = ["g", "i", "m", "s", "u", "y"] as const;
export type RegexFlag = (typeof REGEX_FLAG_ORDER)[number];

export type RegexTestInput = {
  pattern: string;
  flags?: string;
  text: string;
  maxMatches?: number;
};

export type RegexGroupMatch = {
  index: number;
  value: string;
};

export type RegexMatch = {
  value: string;
  index: number;
  groups: RegexGroupMatch[];
  namedGroups: Record<string, string>;
};

export type RegexCompileResult = {
  regex: RegExp | null;
  flags: string;
  error: string | null;
};

export type RegexTestResult = {
  source: string;
  flags: string;
  isValid: boolean;
  hasMatch: boolean;
  matchCount: number;
  matches: RegexMatch[];
  error: string | null;
  durationMs: number;
};
