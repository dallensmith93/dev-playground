import { useMemo, useState } from "react";
import BackButton from "../components/shared/BackButton";
import CopyButton from "../components/shared/CopyButton";
import EmptyState from "../components/shared/EmptyState";
import ResetButton from "../components/shared/ResetButton";
import ResultCard from "../components/shared/ResultCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Select from "../components/ui/Select";
import { deviceSimulator } from "../logic/deviceSimulator";
import type { DeviceOrientation, SimulatedDeviceViewport } from "../types/device";

export default function MobileLayoutSimulator() {
  const simulator = deviceSimulator();
  const presets = simulator.getDevicePresets();

  const [presetId, setPresetId] = useState(presets[0]?.id ?? "mobile-base");
  const [orientation, setOrientation] = useState<DeviceOrientation>("portrait");
  const [result, setResult] = useState<SimulatedDeviceViewport | null>(null);

  const run = () => {
    setResult(simulator.simulateDevice(presetId, orientation));
  };

  const reset = () => {
    setPresetId(presets[0]?.id ?? "mobile-base");
    setOrientation("portrait");
    setResult(null);
  };

  const copyValue = useMemo(() => {
    if (!result) return "";
    return [
      `Preset: ${result.preset.name}`,
      `Orientation: ${result.orientation}`,
      `Viewport: ${result.width}x${result.height}`,
      `Category: ${result.category}`,
    ].join("\n");
  }, [result]);

  return (
    <div className="space-y-6">
      <BackButton />
      <Card className="space-y-4">
        <h1 className="text-2xl font-semibold">Mobile Layout Simulator</h1>
        <p className="text-sm text-slate-400">Simulate viewport size using shared device presets.</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span>Device</span>
            <Select value={presetId} onChange={(event) => setPresetId(event.target.value)}>
              {presets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name} ({preset.width}x{preset.height})
                </option>
              ))}
            </Select>
          </label>

          <label className="space-y-2 text-sm">
            <span>Orientation</span>
            <Select value={orientation} onChange={(event) => setOrientation(event.target.value as DeviceOrientation)}>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </Select>
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={run}>Simulate Viewport</Button>
          <ResetButton onClick={reset} />
          <CopyButton value={copyValue} />
        </div>
      </Card>

      {result ? (
        <ResultCard>
          <div className="space-y-4">
            <div className="text-sm text-slate-200">
              <p>Device: {result.preset.name}</p>
              <p>Orientation: {result.orientation}</p>
              <p>Viewport: {result.width} x {result.height}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
              <div
                className="mx-auto rounded-lg border border-cyan-300/40 bg-cyan-400/10"
                style={{
                  width: `${Math.max(80, Math.min(100, (result.width / 1600) * 100))}%`,
                  aspectRatio: `${result.width}/${result.height}`,
                }}
              />
            </div>
          </div>
        </ResultCard>
      ) : (
        <EmptyState message="No simulation yet." />
      )}
    </div>
  );
}
