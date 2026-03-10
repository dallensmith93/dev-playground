import { useState } from "react";
import BackButton from "../components/shared/BackButton";
import CopyButton from "../components/shared/CopyButton";
import ResetButton from "../components/shared/ResetButton";
import ResultCard from "../components/shared/ResultCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { generateCodingExcuse } from "../logic/excuses";

export default function CodingExcuse() {
  const [result, setResult] = useState("");

  return (
    <div className="space-y-5">
      <BackButton />
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Coding Excuse Generator</h1>
        <p className="text-sm text-slate-400">Need a sprint update fast? Generate a believable engineering excuse in one click.</p>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setResult(generateCodingExcuse())}>Generate excuse</Button>
          <ResetButton onClick={() => setResult("")} />
          <CopyButton value={result} />
        </div>
      </Card>

      {result ? (
        <ResultCard>
          <p className="text-sm uppercase tracking-wide text-cyan-200">Official statement</p>
          <p className="mt-2 text-base">{result}</p>
        </ResultCard>
      ) : null}
    </div>
  );
}

