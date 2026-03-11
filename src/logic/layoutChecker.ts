import type { Dimension, DimensionComparison } from "../types/device";

export type OverlayConfig = {
  opacity: number;
  visible: boolean;
  zIndex?: number;
};

export type OverlayStyle = {
  opacity: number;
  visibility: "visible" | "hidden";
  pointerEvents: "none";
  zIndex: number;
};

const DEFAULT_OVERLAY_Z_INDEX = 5;

export function clampOpacity(opacity: number): number {
  if (!Number.isFinite(opacity)) {
    return 0;
  }

  if (opacity < 0) {
    return 0;
  }

  if (opacity > 1) {
    return 1;
  }

  return opacity;
}

export function buildOverlayStyle(config: OverlayConfig): OverlayStyle {
  return {
    opacity: clampOpacity(config.opacity),
    visibility: config.visible ? "visible" : "hidden",
    pointerEvents: "none",
    zIndex: config.zIndex ?? DEFAULT_OVERLAY_Z_INDEX,
  };
}

export function compareDimensions(
  expected: Dimension,
  actual: Dimension,
  tolerancePx = 0,
): DimensionComparison {
  const widthDiff = Math.abs(expected.width - actual.width);
  const heightDiff = Math.abs(expected.height - actual.height);
  const widthMatch = widthDiff <= tolerancePx;
  const heightMatch = heightDiff <= tolerancePx;

  return {
    widthDiff,
    heightDiff,
    totalDiff: widthDiff + heightDiff,
    widthMatch,
    heightMatch,
    matches: widthMatch && heightMatch,
  };
}

export function layoutChecker() {
  return {
    clampOpacity,
    buildOverlayStyle,
    compareDimensions,
  };
}
