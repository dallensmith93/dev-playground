import type { DevicePreset } from "../types/device";

export const DEVICE_PRESETS: DevicePreset[] = [
  {
    id: "mobile-base",
    name: "Mobile",
    category: "mobile",
    width: 375,
    height: 812,
    deviceScaleFactor: 3,
    touch: true,
  },
  {
    id: "tablet-base",
    name: "Tablet",
    category: "tablet",
    width: 768,
    height: 1024,
    deviceScaleFactor: 2,
    touch: true,
  },
  {
    id: "desktop-base",
    name: "Desktop",
    category: "desktop",
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    touch: false,
  },
  {
    id: "iphone-14-pro",
    name: "iPhone 14 Pro",
    category: "mobile",
    width: 393,
    height: 852,
    deviceScaleFactor: 3,
    touch: true,
  },
  {
    id: "iphone-se",
    name: "iPhone SE",
    category: "mobile",
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    touch: true,
  },
  {
    id: "pixel-7",
    name: "Pixel 7",
    category: "mobile",
    width: 412,
    height: 915,
    deviceScaleFactor: 2.625,
    touch: true,
  },
  {
    id: "ipad-air",
    name: "iPad Air",
    category: "tablet",
    width: 820,
    height: 1180,
    deviceScaleFactor: 2,
    touch: true,
  },
  {
    id: "galaxy-tab-s7",
    name: "Galaxy Tab S7",
    category: "tablet",
    width: 800,
    height: 1280,
    deviceScaleFactor: 2,
    touch: true,
  },
  {
    id: "macbook-air-13",
    name: "MacBook Air 13",
    category: "desktop",
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    touch: false,
  },
  {
    id: "surface-laptop-4",
    name: "Surface Laptop 4",
    category: "desktop",
    width: 1536,
    height: 1024,
    deviceScaleFactor: 1.5,
    touch: false,
  },
];

export function deviceFrames(): DevicePreset[] {
  return [...DEVICE_PRESETS];
}

export function getDeviceFrameById(id: string): DevicePreset | undefined {
  return DEVICE_PRESETS.find((preset) => preset.id === id);
}
