export type DeviceCategory = "mobile" | "tablet" | "desktop";

export type DeviceOrientation = "portrait" | "landscape";

export type Dimension = {
  width: number;
  height: number;
};

export type DevicePreset = {
  id: string;
  name: string;
  category: DeviceCategory;
  width: number;
  height: number;
  deviceScaleFactor: number;
  touch: boolean;
};

export type SimulatedDeviceViewport = {
  preset: DevicePreset;
  orientation: DeviceOrientation;
  width: number;
  height: number;
  category: DeviceCategory;
};

export type DimensionComparison = {
  widthDiff: number;
  heightDiff: number;
  totalDiff: number;
  widthMatch: boolean;
  heightMatch: boolean;
  matches: boolean;
};
