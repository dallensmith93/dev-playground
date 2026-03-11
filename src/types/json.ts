export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

export type JsonObject = {
  [key: string]: JsonValue;
};

export type JsonValidationResult = {
  valid: boolean;
  value: JsonValue | null;
  error: string | null;
};

export type JsonFormatOptions = {
  indent?: number;
  sortKeys?: boolean;
};

export type JsonTransformResult = {
  ok: boolean;
  value: JsonValue | null;
  output: string;
  error: string | null;
};
