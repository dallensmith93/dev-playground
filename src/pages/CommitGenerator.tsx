import { useMemo, useState } from "react";
import BackButton from "../components/shared/BackButton";
import CopyButton from "../components/shared/CopyButton";
import ResetButton from "../components/shared/ResetButton";
import ResultCard from "../components/shared/ResultCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import { generateCommitMessage, type CommitMood } from "../logic/commits";

const moods: CommitMood[] = ["bugfix", "feature", "panic", "friday"];

export default function CommitGenerator() {
  const [mood, setMood] = useState<CommitMood>("feature");
  const [scope, setScope] = useState("");
  const [result, setResult] = useState("");

  const copyValue = useMemo(() => (result ? result : ""), [result]);

  return (
    <div className="space-y-5">
      <BackButton />
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Commit Message Generator</h1>
        <p className="text-sm text-slate-400">Choose your commit mood and generate a message that is equal parts useful and dramatic.</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="text-slate-300">Mood</span>
            <Select value={mood} onChange={(event) => setMood(event.target.value as CommitMood)}>
              {moods.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </Select>
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-slate-300">Scope (optional)</span>
            <Input value={scope} onChange={(event) => setScope(event.target.value)} placeholder="auth, ui, payments" />
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setResult(generateCommitMessage(mood, scope))}>Generate commit</Button>
          <ResetButton
            onClick={() => {
              setMood("feature");
              setScope("");
              setResult("");
            }}
          />
          <CopyButton value={copyValue} />
        </div>
      </Card>
      {result ? (
        <ResultCard>
          <p className="text-sm uppercase tracking-wide text-cyan-200">Generated commit</p>
          <code className="mt-2 block rounded-lg bg-black/20 p-3 text-sm text-cyan-100">{result}</code>
        </ResultCard>
      ) : null}
    </div>
  );
}

