import { useEffect, useState } from "react";
import BackButton from "../components/shared/BackButton";
import CopyButton from "../components/shared/CopyButton";
import ResetButton from "../components/shared/ResetButton";
import ResultCard from "../components/shared/ResultCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Select from "../components/ui/Select";
import { generateChaosQuestion, type ChaosLevel } from "../logic/interviewQuestions";

export default function InterviewChaos() {
  const [level, setLevel] = useState<ChaosLevel>("spicy");
  const [result, setResult] = useState<ReturnType<typeof generateChaosQuestion> | null>(null);
  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    if (timer <= 0) return;
    const id = window.setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [timer]);

  const generate = () => {
    const next = generateChaosQuestion(level);
    setResult(next);
    setTimer(next.timeLimit);
  };

  return (
    <div className="space-y-5">
      <BackButton />
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Interview Chaos Simulator</h1>
        <p className="text-sm text-slate-400">Generate absurd but useful interview prompts and race a countdown timer.</p>

        <label className="space-y-2 text-sm">
          <span className="text-slate-300">Chaos level</span>
          <Select value={level} onChange={(event) => setLevel(event.target.value as ChaosLevel)}>
            <option value="mild">mild</option>
            <option value="spicy">spicy</option>
            <option value="feral">feral</option>
          </Select>
        </label>

        <div className="flex flex-wrap gap-3">
          <Button onClick={generate}>Generate chaos question</Button>
          <ResetButton
            onClick={() => {
              setLevel("spicy");
              setResult(null);
              setTimer(0);
            }}
          />
          <CopyButton value={result ? `${result.prompt}\nHint: ${result.hint}` : ""} />
        </div>
      </Card>

      {result ? (
        <ResultCard>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm uppercase tracking-wide text-cyan-200">Prompt</p>
            <p className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-300">{timer}s left</p>
          </div>
          <p className="mt-2 text-base">{result.prompt}</p>
          <p className="mt-3 text-sm text-slate-300">Hint: {result.hint}</p>
        </ResultCard>
      ) : null}
    </div>
  );
}

