import { useState } from "react";
import BackButton from "../components/shared/BackButton";
import CopyButton from "../components/shared/CopyButton";
import ResetButton from "../components/shared/ResetButton";
import ResultCard from "../components/shared/ResultCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { generateCssInsult } from "../logic/cssInsults";

export default function CssInsultGenerator() {
  const [insult, setInsult] = useState("");

  const run = () => setInsult(generateCssInsult());
  const reset = () => setInsult("");

  return (
    <div className="space-y-6">
      <BackButton />
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">CSS Insult Generator</h1>
        <p className="text-sm text-slate-400">Generate short, sharp feedback for aggressively cursed CSS.</p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={run}>Generate Insult</Button>
          <ResetButton onClick={reset} />
          <CopyButton value={insult} />
        </div>
      </Card>
      {insult ? <ResultCard><p className="text-lg text-slate-100">{insult}</p></ResultCard> : null}
    </div>
  );
}
