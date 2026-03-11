import type { JsonFormatOptions, JsonObject, JsonTransformResult, JsonValidationResult, JsonValue } from "../types/json";

const DEFAULT_INDENT = 2;
const MAX_INDENT = 8;

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Invalid JSON";
}

function sortJsonValue(value: JsonValue): JsonValue {
  if (Array.isArray(value)) {
    return value.map(sortJsonValue);
  }

  if (value !== null && typeof value === "object") {
    const sorted: JsonObject = {};
    for (const key of Object.keys(value).sort((a, b) => a.localeCompare(b))) {
      sorted[key] = sortJsonValue((value as JsonObject)[key]);
    }
    return sorted;
  }

  return value;
}

export function parseJson(text: string): JsonValidationResult {
  try {
    const value = JSON.parse(text) as JsonValue;
    return { valid: true, value, error: null };
  } catch (error) {
    return { valid: false, value: null, error: toErrorMessage(error) };
  }
}

export function validateJson(text: string): JsonValidationResult {
  return parseJson(text);
}

export function formatJson(text: string, options: JsonFormatOptions = {}): JsonTransformResult {
  const parsed = parseJson(text);
  if (!parsed.valid || parsed.value === null) {
    return {
      ok: false,
      value: null,
      output: "",
      error: parsed.error,
    };
  }

  const indent = Math.min(MAX_INDENT, Math.max(0, options.indent ?? DEFAULT_INDENT));
  const value = options.sortKeys ? sortJsonValue(parsed.value) : parsed.value;

  return {
    ok: true,
    value,
    output: JSON.stringify(value, null, indent),
    error: null,
  };
}

export function minifyJson(text: string): JsonTransformResult {
  const parsed = parseJson(text);
  if (!parsed.valid || parsed.value === null) {
    return {
      ok: false,
      value: null,
      output: "",
      error: parsed.error,
    };
  }

  return {
    ok: true,
    value: parsed.value,
    output: JSON.stringify(parsed.value),
    error: null,
  };
}
