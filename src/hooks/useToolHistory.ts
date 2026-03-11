import { useCallback, useEffect, useMemo, useState } from "react";
import { clearHistory, getHistory, saveHistoryEntry } from "../logic/historyStorage";
import type { HistoryEntry } from "../types/history";

type UseToolHistoryResult = {
  entries: HistoryEntry[];
  addEntry: (input: string, output: string) => void;
  refresh: () => void;
  clearToolHistory: () => void;
};

const HISTORY_UPDATED_EVENT = "devplayground-history:updated";

export function useToolHistory(tool: string): UseToolHistoryResult {
  const [allEntries, setAllEntries] = useState<HistoryEntry[]>(() => getHistory());

  const refresh = useCallback(() => {
    setAllEntries(getHistory());
  }, []);

  const addEntry = useCallback(
    (input: string, output: string) => {
      const normalizedInput = input.trim();
      const normalizedOutput = output.trim();
      if (!normalizedInput && !normalizedOutput) return;

      const next = saveHistoryEntry({
        tool,
        input: normalizedInput,
        output: normalizedOutput,
        timestamp: Date.now(),
      });

      setAllEntries(next);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(HISTORY_UPDATED_EVENT));
      }
    },
    [tool],
  );

  const clearToolHistory = useCallback(() => {
    const next = clearHistory(tool);
    setAllEntries(next);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(HISTORY_UPDATED_EVENT));
    }
  }, [tool]);

  const entries = useMemo(() => allEntries.filter((entry) => entry.tool === tool), [allEntries, tool]);

  useEffect(() => {
    const onUpdated = () => setAllEntries(getHistory());
    window.addEventListener(HISTORY_UPDATED_EVENT, onUpdated);
    window.addEventListener("storage", onUpdated);

    return () => {
      window.removeEventListener(HISTORY_UPDATED_EVENT, onUpdated);
      window.removeEventListener("storage", onUpdated);
    };
  }, []);

  return {
    entries,
    addEntry,
    refresh,
    clearToolHistory,
  };
}
