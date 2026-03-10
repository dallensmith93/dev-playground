import { useState } from "react";
import BackButton from "../components/shared/BackButton";
import CopyButton from "../components/shared/CopyButton";
import ResetButton from "../components/shared/ResetButton";
import ResultCard from "../components/shared/ResultCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Textarea from "../components/ui/Textarea";
import { getDuckResponse } from "../logic/duckResponses";

export default function RubberDuckDebugger() {
  const [bug, setBug] = useState("");
  const [response, setResponse] = useState("");

  const run = () => setResponse(getDuckResponse(bug));
  const reset = () => {
    setBug("");
    setResponse("");
  };

  return (
    <div className="space-y-6">
      <BackButton />
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Rubber Duck Debugger</h1>
        <p className="text-sm text-slate-400">Explain your bug. Receive judgment and debugging guidance from a sarcastic duck.</p>
        <Textarea value={bug} onChange={(event) => setBug(event.target.value)} placeholder="What broke? What did you expect?" />
        <div className="flex flex-wrap gap-3">
          <Button onClick={run}>Ask the Duck</Button>
          <ResetButton onClick={reset} />
          <CopyButton value={response} />
        </div>
      </Card>
      {response ? <ResultCard><p className="text-sm leading-relaxed text-slate-100">{response}</p></ResultCard> : null}
    </div>
  );
}
