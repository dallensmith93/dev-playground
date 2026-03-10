import { useMemo, useState } from "react";
import BackButton from "../components/shared/BackButton";
import CopyButton from "../components/shared/CopyButton";
import ResetButton from "../components/shared/ResetButton";
import ResultCard from "../components/shared/ResultCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { personalityQuestions, resolvePersonality, type PersonalityKey } from "../logic/personality";

export default function DeveloperPersonality() {
  const [answers, setAnswers] = useState<Record<number, PersonalityKey | undefined>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = personalityQuestions.every((question) => answers[question.id]);

  const result = useMemo(() => {
    if (!submitted || !allAnswered) return null;
    const ordered = personalityQuestions.map((question) => answers[question.id] as PersonalityKey);
    return resolvePersonality(ordered);
  }, [allAnswered, answers, submitted]);

  return (
    <div className="space-y-5">
      <BackButton />
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Developer Personality Quiz</h1>
        <p className="text-sm text-slate-400">Answer a few multiple-choice prompts and reveal your dev archetype.</p>

        <div className="space-y-4">
          {personalityQuestions.map((question) => (
            <fieldset key={question.id} className="space-y-2 rounded-xl border border-white/10 p-3">
              <legend className="text-sm font-medium text-slate-200">{question.prompt}</legend>
              {question.options.map((option) => (
                <label key={option.label} className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="radio"
                    name={`q-${question.id}`}
                    value={option.key}
                    checked={answers[question.id] === option.key}
                    onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: option.key }))}
                  />
                  {option.label}
                </label>
              ))}
            </fieldset>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setSubmitted(true)} disabled={!allAnswered}>
            Reveal personality
          </Button>
          <ResetButton
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
            }}
          />
          <CopyButton
            value={
              result
                ? `${result.type}\n${result.summary}\nStrengths: ${result.strengths.join(", ")}\nWatchout: ${result.warning}`
                : ""
            }
          />
        </div>
      </Card>

      {result ? (
        <ResultCard>
          <p className="text-sm uppercase tracking-wide text-cyan-200">Your type</p>
          <h2 className="mt-2 text-xl font-semibold">{result.type}</h2>
          <p className="mt-2 text-slate-200">{result.summary}</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
            {result.strengths.map((strength) => (
              <li key={strength}>{strength}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-amber-200">Watchout: {result.warning}</p>
        </ResultCard>
      ) : null}
    </div>
  );
}

