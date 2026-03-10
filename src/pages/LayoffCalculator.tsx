import { useState } from "react";
import BackButton from "../components/shared/BackButton";
import CopyButton from "../components/shared/CopyButton";
import ResetButton from "../components/shared/ResetButton";
import ResultCard from "../components/shared/ResultCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import ProgressBar from "../components/ui/ProgressBar";
import { calculateLayoffRisk, type LayoffInputs } from "../logic/layoff";

const initial: LayoffInputs = {
  runwayMonths: 12,
  reorgCount: 1,
  ceoHypeLevel: 5,
  bugBacklogSize: 40,
};

export default function LayoffCalculator() {
  const [form, setForm] = useState<LayoffInputs>(initial);
  const [result, setResult] = useState<ReturnType<typeof calculateLayoffRisk> | null>(null);

  return (
    <div className="space-y-5">
      <BackButton />
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Layoff Probability Calculator</h1>
        <p className="text-sm text-slate-400">A satirical risk model using local rules. Not financial advice. Mostly emotional preparedness.</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span>Runway (months)</span>
            <Input type="number" min={0} value={form.runwayMonths} onChange={(e) => setForm((p) => ({ ...p, runwayMonths: Number(e.target.value) }))} />
          </label>
          <label className="space-y-1 text-sm">
            <span>Reorg count this year</span>
            <Input type="number" min={0} value={form.reorgCount} onChange={(e) => setForm((p) => ({ ...p, reorgCount: Number(e.target.value) }))} />
          </label>
          <label className="space-y-1 text-sm">
            <span>CEO hype level (0-10)</span>
            <Input type="number" min={0} max={10} value={form.ceoHypeLevel} onChange={(e) => setForm((p) => ({ ...p, ceoHypeLevel: Number(e.target.value) }))} />
          </label>
          <label className="space-y-1 text-sm">
            <span>Bug backlog size</span>
            <Input type="number" min={0} value={form.bugBacklogSize} onChange={(e) => setForm((p) => ({ ...p, bugBacklogSize: Number(e.target.value) }))} />
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setResult(calculateLayoffRisk(form))}>Calculate risk</Button>
          <ResetButton
            onClick={() => {
              setForm(initial);
              setResult(null);
            }}
          />
          <CopyButton
            value={
              result
                ? `Risk: ${result.score}\nVerdict: ${result.verdict}\nRecommendation: ${result.recommendation}\nReasons: ${result.reasons.join(" | ")}`
                : ""
            }
          />
        </div>
      </Card>

      {result ? (
        <ResultCard>
          <p className="text-sm uppercase tracking-wide text-cyan-200">Risk score</p>
          <div className="mt-2 flex items-center gap-3">
            <p className="text-3xl font-semibold">{result.score}</p>
            <p className="text-sm text-slate-300">{result.verdict}</p>
          </div>
          <div className="mt-3">
            <ProgressBar value={result.score} />
          </div>
          <p className="mt-3 text-sm text-slate-200">{result.recommendation}</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
            {result.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </ResultCard>
      ) : null}
    </div>
  );
}

