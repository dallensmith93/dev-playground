export type HexColor = `#${string}`;

export type RgbColor = {
  r: number;
  g: number;
  b: number;
};

export type PaletteShade = {
  step: number;
  hex: HexColor;
  rgb: RgbColor;
};

export type PaletteGenerationOptions = {
  steps?: number[];
  clamp?: boolean;
};

export type PaletteResult = {
  base: HexColor;
  shades: PaletteShade[];
  complementary: HexColor;
  textOnBase: "#000000" | "#ffffff";
  cssVariables: string;
};
