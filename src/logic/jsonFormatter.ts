import type { JsonFormatOptions, JsonTransformResult, JsonValidationResult } from "../types/json";
import { formatJson, minifyJson, validateJson } from "../utils/jsonUtils";

export type JsonAction = "format" | "minify" | "validate";

export type JsonFormatterApi = {
  transform: (input: string, action?: JsonAction, options?: JsonFormatOptions) => JsonTransformResult;
  format: (input: string, options?: JsonFormatOptions) => JsonTransformResult;
  minify: (input: string) => JsonTransformResult;
  validate: (input: string) => JsonValidationResult;
};

function runJsonFormatter(input: string, action: JsonAction = "format", options: JsonFormatOptions = {}): JsonTransformResult {
  if (action === "minify") return minifyJson(input);
  if (action === "validate") {
    const validated = validateJson(input);
    return {
      ok: validated.valid,
      value: validated.value,
      output: validated.valid ? input : "",
      error: validated.error,
    };
  }
  return formatJson(input, options);
}

export function jsonFormatter(): JsonFormatterApi;
export function jsonFormatter(input: string, action?: JsonAction, options?: JsonFormatOptions): JsonTransformResult;
export function jsonFormatter(
  input?: string,
  action: JsonAction = "format",
  options: JsonFormatOptions = {},
): JsonFormatterApi | JsonTransformResult {
  if (input === undefined) {
    return {
      transform: runJsonFormatter,
      format: formatJson,
      minify: minifyJson,
      validate: validateJson,
    };
  }

  return runJsonFormatter(input, action, options);
}

export function validateJsonInput(input: string): JsonValidationResult {
  return validateJson(input);
}

export function formatJsonInput(input: string, options: JsonFormatOptions = {}): JsonTransformResult {
  return formatJson(input, options);
}

export function minifyJsonInput(input: string): JsonTransformResult {
  return minifyJson(input);
}
