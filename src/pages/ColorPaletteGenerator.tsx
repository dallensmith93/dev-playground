import { useMemo, useState } from "react";
import BackButton from "../components/shared/BackButton";
import CopyButton from "../components/shared/CopyButton";
import EmptyState from "../components/shared/EmptyState";
import ResetButton from "../components/shared/ResetButton";
import ResultCard from "../components/shared/ResultCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import ProgressBar from "../components/ui/ProgressBar";
import { usePalette } from "../hooks/usePalette";

export default function ColorPaletteGenerator() {
  const [seed, setSeed] = useState("#2563eb");
  const [stepsText, setStepsText] = useState("50,100,200,300,400,500,600,700,800,900");

  const { result, isLoading, error, run, reset } = usePalette({ autoGenerate: false });

  const steps = useMemo(
    () =>
      stepsText
        .split(",")
        .map((entry) => Number(entry.trim()))
        .filter((entry) => Number.isFinite(entry) && entry > 0),
    [stepsText],
  );

  const generate = async () => {
    await run(seed, { steps });
  };

  const resetAll = () => {
    setSeed("#2563eb");
    setStepsText("50,100,200,300,400,500,600,700,800,900");
    reset();
  };

  const diversityScore = useMemo(() => {
    if (!result) return 0;
    return Math.min(100, result.shades.length * 10);
  }, [result]);

  const copyValue = useMemo(() => {
    if (!result) return "";
    return [
      `Base: ${result.base}`,
      `Complementary: ${result.complementary}`,
      `Text: ${result.textOnBase}`,
      `Shades:\n${JSON.stringify(result.shades, null, 2)}`,
      `CSS Variables:\n${result.cssVariables}`,
    ].join("\n\n");
  }, [result]);

  return (
    <div className="space-y-6">
      <BackButton />
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Color Palette Generator</h1>
        <p className="text-sm text-slate-400">Generate shade scales and CSS variables from a base hex color.</p>

        <label className="space-y-2 text-sm">
          <span>Base Hex</span>
          <Input value={seed} onChange={(event) => setSeed(event.target.value)} placeholder="#2563eb" />
        </label>

        <label className="space-y-2 text-sm">
          <span>Steps (comma separated)</span>
          <Input value={stepsText} onChange={(event) => setStepsText(event.target.value)} placeholder="50,100,200,..." />
        </label>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => void generate()} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Palette"}
          </Button>
          <ResetButton onClick={resetAll} />
          <CopyButton value={copyValue} />
        </div>
      </Card>

      {result || error ? (
        <ResultCard>
          <div className="space-y-3">
            {error ? <p className="text-sm text-rose-200">Error: {error}</p> : null}
            {result ? (
              <>
                <ProgressBar value={diversityScore} />
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {result.shades.map((shade) => (
                    <div key={shade.step} className="rounded-lg border border-white/10 p-3">
                      <div className="h-12 rounded-md border border-white/20" style={{ backgroundColor: shade.hex }} />
                      <p className="mt-2 text-xs text-slate-200">
                        {shade.step}: {shade.hex}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </ResultCard>
      ) : (
        <EmptyState message="No palette generated yet." />
      )}
    </div>
  );
}
