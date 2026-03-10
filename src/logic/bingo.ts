import { randomInt } from "../utils/random";

const terms = [
  "AI-first", "Circle back", "Move the needle", "Bandwidth", "Deep dive", "Low-hanging fruit", "Synergy", "Action items",
  "Disruptive", "Game changer", "Leverage", "Scalable", "MVP", "Thought leader", "Blockchain", "Paradigm shift",
  "Web3", "Asynchronous", "Single pane of glass", "North star metric", "Vertical integration", "Growth loop", "Customer obsession", "Flywheel",
  "Monetize", "Runway", "Stealth", "Agile", "Data-driven", "Optimize", "Best practices", "Value add", "Granular", "Enterprise-ready",
  "Roadmap", "OKR", "Align stakeholders", "Empower", "Omnichannel", "Pivot", "Boil the ocean", "Quick win", "Scale-up"
];

export type BingoCell = {
  id: number;
  label: string;
  checked: boolean;
  free?: boolean;
};

export function createBingoBoard(size = 5): BingoCell[] {
  const needed = size * size - 1;
  const pool = [...terms];
  const picks: string[] = [];

  while (picks.length < needed && pool.length > 0) {
    const index = randomInt(0, pool.length - 1);
    const [value] = pool.splice(index, 1);
    picks.push(value);
  }

  const cells: BingoCell[] = [];
  let cursor = 0;

  for (let i = 0; i < size * size; i += 1) {
    const center = i === Math.floor((size * size) / 2);
    if (center) {
      cells.push({ id: i, label: "FREE", checked: true, free: true });
      continue;
    }
    cells.push({ id: i, label: picks[cursor] ?? "Buzzword", checked: false });
    cursor += 1;
  }

  return cells;
}

export function hasBingo(cells: BingoCell[], size = 5): boolean {
  const isChecked = (r: number, c: number) => cells[r * size + c]?.checked;

  for (let r = 0; r < size; r += 1) {
    if (Array.from({ length: size }, (_, c) => isChecked(r, c)).every(Boolean)) return true;
  }

  for (let c = 0; c < size; c += 1) {
    if (Array.from({ length: size }, (_, r) => isChecked(r, c)).every(Boolean)) return true;
  }

  const diagonalA = Array.from({ length: size }, (_, i) => isChecked(i, i)).every(Boolean);
  const diagonalB = Array.from({ length: size }, (_, i) => isChecked(i, size - i - 1)).every(Boolean);
  return diagonalA || diagonalB;
}
