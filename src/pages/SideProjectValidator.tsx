import { useState } from "react";
import BackButton from "../components/shared/BackButton";
import ResetButton from "../components/shared/ResetButton";
import ResultCard from "../components/shared/ResultCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import ProgressBar from "../components/ui/ProgressBar";
import { validateSideProject } from "../logic/sideProjectValidator";

export default function SideProjectValidator() {
  const [idea, setIdea] = useState("");
  const [hours, setHours] = useState("4");
  const [result, setResult] = useState<ReturnType<typeof validateSideProject> | null>(null);

  const run = () => setResult(validateSideProject(idea, Number(hours)));
  const reset = () => {
    setIdea("");
    setHours("4");
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <BackButton />
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Side Project Validator</h1>
        <p className="text-sm text-slate-400">Predict how quickly this side project could become an unfinished tab.</p>
        <Textarea value={idea} onChange={(event) => setIdea(event.target.value)} placeholder="Describe your project idea and target user" />
        <Input type="number" min={0} max={40} value={hours} onChange={(event) => setHours(event.target.value)} placeholder="Weekly hours" />
        <div className="flex flex-wrap gap-3">
          <Button onClick={run}>Validate</Button>
          <ResetButton onClick={reset} />
        </div>
      </Card>
      {result ? (
        <ResultCard>
          <div className="space-y-3 text-sm">
            <p className="text-slate-200">Forecast: <span className="font-semibold">{result.forecast}</span></p>
            <ProgressBar value={result.abandonmentScore} />
            <p className="text-slate-300">Abandonment score: {result.abandonmentScore}/100</p>
            <ul className="list-disc space-y-1 pl-5 text-slate-300">
              {result.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
            <p className="text-slate-200">Recommendation: {result.recommendation}</p>
          </div>
        </ResultCard>
      ) : null}
    </div>
  );
}
