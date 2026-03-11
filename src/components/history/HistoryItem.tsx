import type { HistoryEntry } from "../../types/history";

type HistoryItemProps = {
  entry: HistoryEntry;
  onRestore: (entry: HistoryEntry) => void;
};

export default function HistoryItem({ entry, onRestore }: HistoryItemProps) {
  const time = new Date(entry.timestamp).toLocaleString();

  return (
    <button
      type="button"
      onClick={() => onRestore(entry)}
      className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-left transition hover:border-cyan-300/30 hover:bg-white/[0.06]"
    >
      <p className="truncate text-sm text-slate-200">
        {entry.input}
        {" -> "}
        {entry.output}
      </p>
      <p className="mt-1 text-xs text-slate-500">{time}</p>
    </button>
  );
}
