import { useMemo, useState } from "react";
import BackButton from "../components/shared/BackButton";
import ResetButton from "../components/shared/ResetButton";
import ResultCard from "../components/shared/ResultCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { createBingoBoard, hasBingo, type BingoCell } from "../logic/bingo";

export default function BuzzwordBingo() {
  const [board, setBoard] = useState<BingoCell[]>(() => createBingoBoard());

  const bingo = useMemo(() => hasBingo(board), [board]);

  const toggle = (id: number) => {
    setBoard((current) =>
      current.map((cell) => (cell.id === id && !cell.free ? { ...cell, checked: !cell.checked } : cell)),
    );
  };

  const regenerate = () => setBoard(createBingoBoard());
  const resetChecks = () => {
    setBoard((current) => current.map((cell) => (cell.free ? cell : { ...cell, checked: false })));
  };

  return (
    <div className="space-y-6">
      <BackButton />
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Tech Buzzword Bingo</h1>
        <p className="text-sm text-slate-400">Click terms during meetings. Hit a row, column, or diagonal to call bingo.</p>
        <div className="-mx-1 overflow-x-auto px-1">
          <div className="grid min-w-[20rem] grid-cols-5 gap-2">
            {board.map((cell) => (
              <button
                key={cell.id}
                type="button"
                onClick={() => toggle(cell.id)}
                className={`min-h-20 rounded-lg border p-1.5 text-[11px] leading-snug transition sm:p-2 sm:text-xs ${
                  cell.checked
                    ? "border-emerald-300/60 bg-emerald-400/20 text-emerald-100"
                    : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.07]"
                }`}
              >
                {cell.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={regenerate}>New Board</Button>
          <ResetButton onClick={resetChecks} />
        </div>
      </Card>
      <ResultCard>
        <p className="text-sm text-slate-100">{bingo ? "BINGO achieved. Corporate jargon defeated." : "No bingo yet. Stay in the meeting and keep tapping."}</p>
      </ResultCard>
    </div>
  );
}
