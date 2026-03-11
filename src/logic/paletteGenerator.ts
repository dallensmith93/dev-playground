import type { HexColor, PaletteGenerationOptions, PaletteResult, PaletteShade } from "../types/palette";
import { complementaryHex, getReadableTextColor, hexToRgb, normalizeHexColor, shiftLightness } from "../utils/colorUtils";

const DEFAULT_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const DEFAULT_LIGHTNESS_SHIFT = [0.4, 0.3, 0.22, 0.15, 0.08, 0, -0.08, -0.16, -0.24, -0.32];

export type PaletteGeneratorApi = {
  generate: (baseHex: string, options?: PaletteGenerationOptions) => PaletteResult;
  run: (baseHex: string, options?: PaletteGenerationOptions) => PaletteResult;
};

function toCssVariables(shades: PaletteShade[]): string {
  return shades.map((shade) => `--color-${shade.step}: ${shade.hex};`).join("\n");
}

function runPaletteGenerator(baseHex: string, options: PaletteGenerationOptions = {}): PaletteResult {
  const normalized = normalizeHexColor(baseHex);
  if (!normalized) {
    throw new Error("Base color must be a valid 3- or 6-digit hex value");
  }

  const steps = options.steps && options.steps.length > 0 ? options.steps : DEFAULT_STEPS;

  const shades: PaletteShade[] = steps.map((step, index) => {
    const delta = DEFAULT_LIGHTNESS_SHIFT[index] ?? 0;
    const shifted = shiftLightness(normalized, delta) ?? normalized;
    const rgb = hexToRgb(shifted) ?? { r: 0, g: 0, b: 0 };

    return {
      step,
      hex: shifted as HexColor,
      rgb,
    };
  });

  const complementary = complementaryHex(normalized) ?? normalized;

  return {
    base: normalized,
    shades,
    complementary,
    textOnBase: getReadableTextColor(normalized),
    cssVariables: toCssVariables(shades),
  };
}

export function paletteGenerator(): PaletteGeneratorApi;
export function paletteGenerator(baseHex: string, options?: PaletteGenerationOptions): PaletteResult;
export function paletteGenerator(baseHex?: string, options: PaletteGenerationOptions = {}): PaletteGeneratorApi | PaletteResult {
  if (baseHex === undefined) {
    return {
      generate: runPaletteGenerator,
      run: runPaletteGenerator,
    };
  }

  return runPaletteGenerator(baseHex, options);
}
