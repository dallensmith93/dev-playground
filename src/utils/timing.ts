export function nowMs(): number {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }
  return Date.now();
}

export function roundMs(value: number, digits = 2): number {
  const precision = 10 ** digits;
  return Math.round(value * precision) / precision;
}

export async function measureAsync<T>(task: () => Promise<T>): Promise<{ result: T; durationMs: number }> {
  const start = nowMs();
  const result = await task();
  const durationMs = roundMs(nowMs() - start);
  return { result, durationMs };
}
