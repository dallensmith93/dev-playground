import type { HistoryEntry } from "../../types/history";
import { useToolHistory } from "../../hooks/useToolHistory";
import Button from "../ui/Button";
import Card from "../ui/Card";
import EmptyState from "../shared/EmptyState";
import HistoryItem from "./HistoryItem";

type ToolHistoryProps = {
  tool: string;
  onRestore: (entry: HistoryEntry) => void;
  limit?: number;
};

export default function ToolHistory({ tool, onRestore, limit = 8 }: ToolHistoryProps) {
  const { entries, clearToolHistory } = useToolHistory(tool);
  const visible = entries.slice(0, limit);

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-100">Recent Runs</h2>
        <Button type="button" variant="ghost" onClick={clearToolHistory} disabled={entries.length === 0}>
          Clear
        </Button>
      </div>

      {visible.length === 0 ? (
        <EmptyState message="No history yet for this tool." />
      ) : (
        <div className="space-y-2">
          {visible.map((entry) => (
            <HistoryItem key={`${entry.tool}-${entry.timestamp}-${entry.input}`} entry={entry} onRestore={onRestore} />
          ))}
        </div>
      )}
    </Card>
  );
}
