export class HttpError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly url: string;
  public readonly details?: unknown;

  constructor(message: string, status: number, statusText: string, url: string, details?: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.statusText = statusText;
    this.url = url;
    this.details = details;
  }
}

type FetchJsonOptions = {
  timeoutMs?: number;
  signal?: AbortSignal;
};

export function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unexpected error";
}

function joinSignals(signalA?: AbortSignal, signalB?: AbortSignal): AbortSignal | undefined {
  if (!signalA && !signalB) return undefined;
  if (!signalA) return signalB;
  if (!signalB) return signalA;

  const controller = new AbortController();
  const abortFrom = (source: AbortSignal) => controller.abort(source.reason);

  if (signalA.aborted) abortFrom(signalA);
  if (signalB.aborted) abortFrom(signalB);

  signalA.addEventListener("abort", () => abortFrom(signalA), { once: true });
  signalB.addEventListener("abort", () => abortFrom(signalB), { once: true });

  return controller.signal;
}

export async function fetchJson<TData>(
  url: string,
  init: RequestInit = {},
  options: FetchJsonOptions = {},
): Promise<TData> {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? 12000;

  const signal = joinSignals(controller.signal, options.signal ?? init.signal ?? undefined);
  const timeoutId = window.setTimeout(() => controller.abort("timeout"), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal,
      headers: {
        Accept: "application/json",
        ...init.headers,
      },
    });

    const text = await response.text();
    const payload = text ? (JSON.parse(text) as unknown) : null;

    if (!response.ok) {
      const message =
        (payload as { message?: string } | null)?.message ||
        `Request failed with status ${response.status}`;
      throw new HttpError(message, response.status, response.statusText, url, payload);
    }

    return payload as TData;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw new Error(toErrorMessage(error));
  } finally {
    window.clearTimeout(timeoutId);
  }
}
