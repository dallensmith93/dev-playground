import type { DeviceOrientation, DevicePreset, SimulatedDeviceViewport } from "../types/device";
import { DEVICE_PRESETS, getDeviceFrameById } from "../utils/deviceFrames";

const FALLBACK_PRESET = DEVICE_PRESETS[0];

function rotateDimensions(
  preset: DevicePreset,
  orientation: DeviceOrientation,
): { width: number; height: number } {
  if (orientation === "landscape") {
    return { width: preset.height, height: preset.width };
  }

  return { width: preset.width, height: preset.height };
}

export function getDevicePresets(): DevicePreset[] {
  return [...DEVICE_PRESETS];
}

export function getPreset(id: string): DevicePreset | undefined {
  return getDeviceFrameById(id);
}

export function simulateDevice(
  presetOrId: DevicePreset | string,
  orientation: DeviceOrientation = "portrait",
): SimulatedDeviceViewport {
  const preset =
    typeof presetOrId === "string" ? getDeviceFrameById(presetOrId) ?? FALLBACK_PRESET : presetOrId;

  const dims = rotateDimensions(preset, orientation);

  return {
    preset,
    orientation,
    width: dims.width,
    height: dims.height,
    category: preset.category,
  };
}

export function deviceSimulator() {
  return {
    getDevicePresets,
    getPreset,
    simulateDevice,
  };
}
