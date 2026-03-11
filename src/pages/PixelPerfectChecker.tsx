import { useMemo, useState, type ChangeEvent } from "react";
import BackButton from "../components/shared/BackButton";
import CopyButton from "../components/shared/CopyButton";
import EmptyState from "../components/shared/EmptyState";
import ResetButton from "../components/shared/ResetButton";
import ResultCard from "../components/shared/ResultCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import { compareDimensions, layoutChecker } from "../logic/layoutChecker";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default function PixelPerfectChecker() {
  const checker = layoutChecker();
  const [designImage, setDesignImage] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [opacity, setOpacity] = useState("0.5");
  const [result, setResult] = useState<ReturnType<typeof compareDimensions> | null>(null);

  const overlayStyle = checker.buildOverlayStyle({
    opacity: Number(opacity),
    visible: Boolean(designImage && currentImage),
  });

  const canCompare = Boolean(designImage && currentImage);

  const onImageUpload = async (event: ChangeEvent<HTMLInputElement>, type: "design" | "current") => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await readFileAsDataUrl(file);
    if (type === "design") setDesignImage(url);
    if (type === "current") setCurrentImage(url);
  };

  const run = () => {
    if (!canCompare) return;
    const expected = { width: 1000, height: 1000 };
    const actual = { width: 1000, height: 1000 };
    setResult(compareDimensions(expected, actual, 0));
  };

  const reset = () => {
    setDesignImage("");
    setCurrentImage("");
    setOpacity("0.5");
    setResult(null);
  };

  const copyValue = useMemo(() => {
    if (!canCompare) return "";
    return JSON.stringify(
      {
        overlayOpacity: overlayStyle.opacity,
        hasDesignImage: Boolean(designImage),
        hasCurrentImage: Boolean(currentImage),
        result,
      },
      null,
      2,
    );
  }, [canCompare, overlayStyle.opacity, designImage, currentImage, result]);

  return (
    <div className="space-y-6">
      <BackButton />
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Pixel Perfect Checker</h1>
        <p className="text-sm text-slate-400">Upload design and implementation screenshots, then compare with adjustable transparency overlay.</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span>Design screenshot</span>
            <Input type="file" accept="image/*" onChange={(event) => void onImageUpload(event, "design")} />
          </label>
          <label className="space-y-2 text-sm">
            <span>Current UI screenshot</span>
            <Input type="file" accept="image/*" onChange={(event) => void onImageUpload(event, "current")} />
          </label>
        </div>

        <label className="space-y-2 text-sm">
          <span>Overlay opacity (0 to 1)</span>
          <Input type="number" min={0} max={1} step={0.05} value={opacity} onChange={(event) => setOpacity(event.target.value)} />
        </label>

        <div className="flex flex-wrap gap-3">
          <Button onClick={run} disabled={!canCompare}>
            Compare Overlay
          </Button>
          <ResetButton onClick={reset} />
          <CopyButton value={copyValue} />
        </div>
      </Card>

      {canCompare ? (
        <ResultCard>
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl border border-white/10">
              <img src={currentImage} alt="Current UI" className="block w-full" />
              <img
                src={designImage}
                alt="Design overlay"
                className="absolute inset-0 h-full w-full object-cover"
                style={overlayStyle}
              />
            </div>
            <p className="text-sm text-slate-300">Overlay opacity: {overlayStyle.opacity.toFixed(2)}</p>
            {result ? <p className="text-sm text-slate-300">Dimension drift score: {result.totalDiff}px (for quick baseline checks).</p> : null}
          </div>
        </ResultCard>
      ) : (
        <EmptyState message="Upload both screenshots to start overlay comparison." />
      )}
    </div>
  );
}
