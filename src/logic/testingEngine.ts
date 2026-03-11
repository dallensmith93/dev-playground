import type {
  TestCaseInput,
  TestCaseResult,
  TestEngineOptions,
  TestEngineResult,
} from "../types/testEngine";

const DEFAULT_TIMEOUT_MS = 250;

function safeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function deepEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) {
    return true;
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.length !== right.length) {
      return false;
    }

    for (let i = 0; i < left.length; i += 1) {
      if (!deepEqual(left[i], right[i])) {
        return false;
      }
    }

    return true;
  }

  if (!isObject(left) || !isObject(right)) {
    return false;
  }

  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  for (const key of leftKeys) {
    if (!(key in right) || !deepEqual(left[key], right[key])) {
      return false;
    }
  }

  return true;
}

function compileUserFunction(source: string): ((...args: unknown[]) => unknown) | null {
  const wrapped = `"use strict"; return (${source});`;
  const factory = new Function(wrapped) as () => unknown;
  const candidate = factory();

  if (typeof candidate !== "function") {
    return null;
  }

  return candidate as (...args: unknown[]) => unknown;
}

async function runWithTimeout<T>(work: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Execution timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([work, timeoutPromise]);
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  }
}

const invokeInRestrictedContext = new Function(
  "fn",
  "args",
  `
  "use strict";
  const window = undefined;
  const document = undefined;
  const globalThis = undefined;
  const self = undefined;
  const Function = undefined;
  return fn.apply(undefined, args);
`,
) as (fn: (...args: unknown[]) => unknown, args: unknown[]) => unknown;

function assertFromCase(testCase: TestCaseInput, actual: unknown): { pass: boolean; error?: string } {
  if (typeof testCase.assertion === "string" && testCase.assertion.trim()) {
    try {
      const predicate = new Function(
        "actual",
        "expected",
        "args",
        `"use strict"; return Boolean(${testCase.assertion});`,
      ) as (actual: unknown, expected: unknown, args: unknown[]) => boolean;

      const pass = predicate(actual, testCase.expected, testCase.args ?? []);
      return pass ? { pass: true } : { pass: false, error: "Assertion returned false" };
    } catch (error) {
      return { pass: false, error: `Assertion error: ${safeErrorMessage(error)}` };
    }
  }

  if ("expected" in testCase) {
    const pass = deepEqual(actual, testCase.expected);
    return pass ? { pass: true } : { pass: false, error: "Expected value mismatch" };
  }

  return { pass: true };
}

async function runSingleTest(
  userFn: (...args: unknown[]) => unknown,
  testCase: TestCaseInput,
  timeoutMs: number,
): Promise<TestCaseResult> {
  const args = Array.isArray(testCase.args) ? testCase.args : [];

  try {
    const execution = Promise.resolve(invokeInRestrictedContext(userFn, args));
    const actual = await runWithTimeout(execution, timeoutMs);
    const assertion = assertFromCase(testCase, actual);

    return {
      name: testCase.name,
      pass: assertion.pass,
      actual,
      expected: testCase.expected,
      error: assertion.error,
    };
  } catch (error) {
    return {
      name: testCase.name,
      pass: false,
      expected: testCase.expected,
      error: safeErrorMessage(error),
    };
  }
}

export async function runUserTests(
  userFunctionSource: string,
  testCases: TestCaseInput[],
  options: TestEngineOptions = {},
): Promise<TestEngineResult> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  let userFn: ((...args: unknown[]) => unknown) | null = null;
  try {
    userFn = compileUserFunction(userFunctionSource);
  } catch (error) {
    return {
      passCount: 0,
      failCount: testCases.length,
      results: [],
      compileError: safeErrorMessage(error),
    };
  }

  if (userFn === null) {
    return {
      passCount: 0,
      failCount: testCases.length,
      results: [],
      compileError: "Provided source did not evaluate to a function",
    };
  }

  const results: TestCaseResult[] = [];
  for (const testCase of testCases) {
    results.push(await runSingleTest(userFn, testCase, timeoutMs));
  }

  const passCount = results.filter((result) => result.pass).length;
  const failCount = results.length - passCount;

  return {
    passCount,
    failCount,
    results,
  };
}

export function testingEngine() {
  return {
    runUserTests,
  };
}
