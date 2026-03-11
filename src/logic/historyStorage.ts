import type { HistoryEntry } from "../types/history";

const STORAGE_KEY = "devplayground-history";
const MAX_ENTRIES = 200;

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.tool === "string" &&
    typeof candidate.input === "string" &&
    typeof candidate.output === "string" &&
    typeof candidate.timestamp === "number"
  );
}

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isHistoryEntry).sort((a, b) => b.timestamp - a.timestamp);
  } catch {
    return [];
  }
}

export function saveHistoryEntry(entry: HistoryEntry): HistoryEntry[] {
  const next = [entry, ...getHistory()].slice(0, MAX_ENTRIES);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}

export function clearHistory(tool?: string): HistoryEntry[] {
  if (tool) {
    const remaining = getHistory().filter((entry) => entry.tool !== tool);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
    }
    return remaining;
  }

  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  return [];
}
