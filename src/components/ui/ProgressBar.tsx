import { clampScore } from "../../utils/scoring";

export default function ProgressBar({ value = 0 }: { value?: number }) {
  const safe = clampScore(value);
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
      <div className="h-2 rounded-full bg-gradient-to-r from-cyan-300 via-indigo-300 to-emerald-300 transition-all duration-500" style={{ width: `${safe}%` }} />
    </div>
  );
}
