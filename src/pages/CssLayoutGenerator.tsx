import { useMemo, useState } from "react";
import BackButton from "../components/shared/BackButton";
import CopyButton from "../components/shared/CopyButton";
import EmptyState from "../components/shared/EmptyState";
import ResetButton from "../components/shared/ResetButton";
import ResultCard from "../components/shared/ResultCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Textarea from "../components/ui/Textarea";
import { cssGenerator, type CssLayoutMode } from "../logic/cssGenerator";

const modeOptions: Array<{ label: string; value: CssLayoutMode }> = [
  { label: "Flex Center", value: "flex-center" },
  { label: "Flex Between", value: "flex-between" },
  { label: "Grid Auto Fit", value: "grid-auto-fit" },
  { label: "Grid 12", value: "grid-12" },
];

export default function CssLayoutGenerator() {
  const [mode, setMode] = useState<CssLayoutMode>("grid-auto-fit");
  const [gap, setGap] = useState("16");
  const [columns, setColumns] = useState("3");
  const [minItemWidth, setMinItemWidth] = useState("220");
  const [hasRun, setHasRun] = useState(false);

  const result = useMemo(() => {
    if (!hasRun) return null;
    return cssGenerator({
      mode,
      gap: Number(gap),
      columns: Number(columns),
      minItemWidth: Number(minItemWidth),
    });
  }, [columns, gap, hasRun, minItemWidth, mode]);

  const reset = () => {
    setMode("grid-auto-fit");
    setGap("16");
    setColumns("3");
    setMinItemWidth("220");
    setHasRun(false);
  };

  const copyValue = useMemo(() => {
    if (!result) return "";
    return [`Mode: ${result.mode}`, `Description: ${result.description}`, `CSS:\n${result.css}`, `HTML:\n${result.html}`].join("\n\n");
  }, [result]);

  return (
    <div className="space-y-6">
      <BackButton />
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">CSS Layout Generator</h1>
        <p className="text-sm text-slate-400">Generate common flex/grid layout snippets quickly.</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span>Layout Mode</span>
            <Select value={mode} onChange={(event) => setMode(event.target.value as CssLayoutMode)}>
              {modeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </label>

          <label className="space-y-2 text-sm">
            <span>Gap (px)</span>
            <Input type="number" min={0} value={gap} onChange={(event) => setGap(event.target.value)} />
          </label>

          <label className="space-y-2 text-sm">
            <span>Columns</span>
            <Input type="number" min={1} max={12} value={columns} onChange={(event) => setColumns(event.target.value)} />
          </label>

          <label className="space-y-2 text-sm">
            <span>Min Item Width (px)</span>
            <Input type="number" min={40} value={minItemWidth} onChange={(event) => setMinItemWidth(event.target.value)} />
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setHasRun(true)}>Generate Layout</Button>
          <ResetButton onClick={reset} />
          <CopyButton value={copyValue} />
        </div>
      </Card>

      {result ? (
        <ResultCard>
          <div className="space-y-3">
            <p className="text-sm text-slate-300">{result.description}</p>
            <div>
              <p className="mb-2 text-sm text-slate-300">CSS</p>
              <Textarea value={result.css} readOnly className="min-h-36" />
            </div>
            <div>
              <p className="mb-2 text-sm text-slate-300">HTML</p>
              <Textarea value={result.html} readOnly className="min-h-24" />
            </div>
          </div>
        </ResultCard>
      ) : (
        <EmptyState message="No layout generated yet." />
      )}
    </div>
  );
}
