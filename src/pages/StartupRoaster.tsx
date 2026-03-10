import { useMemo, useState } from "react";
import BackButton from "../components/shared/BackButton";
import CopyButton from "../components/shared/CopyButton";
import ResetButton from "../components/shared/ResetButton";
import ResultCard from "../components/shared/ResultCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Textarea from "../components/ui/Textarea";
import { generateStartupRoast } from "../logic/roasts";

export default function StartupRoaster() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState("");

  const canGenerate = idea.trim().length > 0;
  const copyValue = useMemo(() => (result ? `Startup Idea: ${idea}\nRoast: ${result}` : ""), [idea, result]);

  return (
    <div className="space-y-5">
      <BackButton />
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Startup Idea Roaster</h1>
        <p className="text-sm text-slate-400">Type your next billion-dollar idea and receive immediate founder reality feedback.</p>
        <Textarea value={idea} onChange={(event) => setIdea(event.target.value)} placeholder="Example: AI-powered emotional support for merge conflicts" />
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setResult(generateStartupRoast(idea))} disabled={!canGenerate}>
            Roast my idea
          </Button>
          <ResetButton
            onClick={() => {
              setIdea("");
              setResult("");
            }}
          />
          <CopyButton value={copyValue} />
        </div>
      </Card>
      {result ? (
        <ResultCard>
          <p className="text-sm uppercase tracking-wide text-cyan-200">Roast result</p>
          <p className="mt-2 text-base leading-relaxed">{result}</p>
        </ResultCard>
      ) : null}
    </div>
  );
}

