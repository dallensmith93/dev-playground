import { useState } from "react";
import BackButton from "../components/shared/BackButton";
import CopyButton from "../components/shared/CopyButton";
import ResetButton from "../components/shared/ResetButton";
import ResultCard from "../components/shared/ResultCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import { generateStackOverflowAnswer } from "../logic/stackoverflow";

export default function StackOverflowGenerator() {
  const [question, setQuestion] = useState("");
  const [helpful, setHelpful] = useState(true);
  const [answer, setAnswer] = useState("");

  const run = () => setAnswer(generateStackOverflowAnswer(question, helpful));
  const reset = () => {
    setQuestion("");
    setHelpful(true);
    setAnswer("");
  };

  return (
    <div className="space-y-6">
      <BackButton />
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">StackOverflow Answer Generator</h1>
        <p className="text-sm text-slate-400">Generate the classic forum reply: slightly rude, occasionally useful.</p>
        <Input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Why is my React state stale in setInterval?" />
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={helpful} onChange={(event) => setHelpful(event.target.checked)} />
          Include one actually helpful line
        </label>
        <div className="flex flex-wrap gap-3">
          <Button onClick={run}>Generate Answer</Button>
          <ResetButton onClick={reset} />
          <CopyButton value={answer} />
        </div>
      </Card>
      {answer ? <ResultCard><pre className="whitespace-pre-wrap text-sm text-slate-100">{answer}</pre></ResultCard> : null}
    </div>
  );
}
