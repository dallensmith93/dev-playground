import type { LatencyMeasurement, LatencySummary, LatencyTarget } from "../types/latency";
import { nowMs, roundMs } from "../utils/timing";
import { toErrorMessage } from "../utils/fetcher";

type TestLatencyOptions = {
  timeoutMs?: number;
  signal?: AbortSignal;
};

function mergeSignals(signalA?: AbortSignal, signalB?: AbortSignal): AbortSignal | undefined {
  if (!signalA && !signalB) return undefined;
  if (!signalA) return signalB;
  if (!signalB) return signalA;

  const controller = new AbortController();
  const abortFrom = (signal: AbortSignal) => controller.abort(signal.reason);

  if (signalA.aborted) abortFrom(signalA);
  if (signalB.aborted) abortFrom(signalB);

  signalA.addEventListener("abort", () => abortFrom(signalA), { once: true });
  signalB.addEventListener("abort", () => abortFrom(signalB), { once: true });

  return controller.signal;
}

export async function testLatency(
  target: LatencyTarget,
  options: TestLatencyOptions = {},
): Promise<LatencyMeasurement> {
  const timeoutMs = options.timeoutMs ?? 10000;
  const timeoutController = new AbortController();
  const signal = mergeSignals(timeoutController.signal, options.signal);
  const startedAt = Date.now();
  const start = nowMs();
  const timeoutId = window.setTimeout(() => timeoutController.abort("timeout"), timeoutMs);

  try {
    const response = await fetch(target.url, {
      method: target.method ?? "GET",
      headers: target.headers,
      body: target.body,
      cache: "no-store",
      signal,
    });

    const endedAt = Date.now();
    return {
      targetKey: target.key,
      label: target.label,
      url: target.url,
      durationMs: roundMs(nowMs() - start),
      startedAt,
      endedAt,
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      error: response.ok ? undefined : `Request failed with status ${response.status}`,
    };
  } catch (error) {
    const endedAt = Date.now();
    const message =
      error instanceof DOMException && error.name === "AbortError"
        ? `Request timed out after ${timeoutMs}ms`
        : toErrorMessage(error);

    return {
      targetKey: target.key,
      label: target.label,
      url: target.url,
      durationMs: roundMs(nowMs() - start),
      startedAt,
      endedAt,
      ok: false,
      error: message,
    };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function testLatencyBatch(
  targets: LatencyTarget[],
  options: TestLatencyOptions = {},
): Promise<LatencyMeasurement[]> {
  return Promise.all(targets.map((target) => testLatency(target, options)));
}

export function summarizeLatency(measurements: LatencyMeasurement[]): LatencySummary {
  if (!measurements.length) {
    return {
      averageMs: 0,
      fastestMs: 0,
      slowestMs: 0,
      successRate: 0,
    };
  }

  const durations = measurements.map((item) => item.durationMs);
  const successes = measurements.filter((item) => item.ok).length;
  const averageMs = roundMs(durations.reduce((sum, value) => sum + value, 0) / durations.length);
  const fastestMs = Math.min(...durations);
  const slowestMs = Math.max(...durations);
  const successRate = roundMs((successes / measurements.length) * 100);

  return {
    averageMs,
    fastestMs,
    slowestMs,
    successRate,
  };
}
