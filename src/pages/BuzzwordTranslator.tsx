import { useState } from "react";
import BackButton from "../components/shared/BackButton";
import CopyButton from "../components/shared/CopyButton";
import ResetButton from "../components/shared/ResetButton";
import ResultCard from "../components/shared/ResultCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Textarea from "../components/ui/Textarea";
import { translateBuzzwords } from "../logic/buzzwordTranslator";

export default function BuzzwordTranslator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const run = () => setResult(translateBuzzwords(input));
  const reset = () => {
    setInput("");
    setResult("");
  };

  return (
    <div className="space-y-6">
      <BackButton />
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Startup Buzzword Translator</h1>
        <p className="text-sm text-slate-400">Paste investor-friendly startup language. Get sarcastic plain-English translation.</p>
        <Textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Example: AI-powered disruptive synergy platform for scalable growth" />
        <div className="flex flex-wrap gap-3">
          <Button onClick={run}>Translate</Button>
          <ResetButton onClick={reset} />
          <CopyButton value={result} />
        </div>
      </Card>
      {result ? (
        <ResultCard>
          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-slate-100">{result}</pre>
        </ResultCard>
      ) : null}
    </div>
  );
}
