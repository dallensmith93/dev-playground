export type CssLayoutMode = "flex-center" | "flex-between" | "grid-auto-fit" | "grid-12";

export type CssGeneratorInput = {
  mode: CssLayoutMode;
  gap?: number;
  columns?: number;
  minItemWidth?: number;
};

export type CssGeneratorResult = {
  mode: CssLayoutMode;
  description: string;
  css: string;
  html: string;
};

export type CssGeneratorApi = {
  generate: (input: CssGeneratorInput) => CssGeneratorResult;
  run: (input: CssGeneratorInput) => CssGeneratorResult;
};

function px(value: number): string {
  return `${Math.max(0, Math.round(value))}px`;
}

function flexCenter(gap: number): CssGeneratorResult {
  return {
    mode: "flex-center",
    description: "Centered row/column flex layout",
    css: `.container {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: ${px(gap)};\n}`,
    html: `<div class=\"container\">\n  <div class=\"item\">A</div>\n  <div class=\"item\">B</div>\n</div>`,
  };
}

function flexBetween(gap: number): CssGeneratorResult {
  return {
    mode: "flex-between",
    description: "Space-between layout for toolbars and headers",
    css: `.container {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: ${px(gap)};\n}`,
    html: `<div class=\"container\">\n  <div>Left</div>\n  <div>Right</div>\n</div>`,
  };
}

function gridAutoFit(gap: number, minItemWidth: number): CssGeneratorResult {
  return {
    mode: "grid-auto-fit",
    description: "Responsive grid with auto-fit columns",
    css: `.container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(${px(minItemWidth)}, 1fr));\n  gap: ${px(gap)};\n}`,
    html: `<div class=\"container\">\n  <article>Card 1</article>\n  <article>Card 2</article>\n  <article>Card 3</article>\n</div>`,
  };
}

function grid12(gap: number, columns: number): CssGeneratorResult {
  const safeColumns = Math.max(1, Math.min(12, Math.round(columns)));
  return {
    mode: "grid-12",
    description: "Fixed-column grid",
    css: `.container {\n  display: grid;\n  grid-template-columns: repeat(${safeColumns}, minmax(0, 1fr));\n  gap: ${px(gap)};\n}`,
    html: `<div class=\"container\">\n  <div>1</div>\n  <div>2</div>\n  <div>3</div>\n</div>`,
  };
}

function runCssGenerator(input: CssGeneratorInput): CssGeneratorResult {
  const gap = input.gap ?? 16;

  switch (input.mode) {
    case "flex-center":
      return flexCenter(gap);
    case "flex-between":
      return flexBetween(gap);
    case "grid-auto-fit":
      return gridAutoFit(gap, input.minItemWidth ?? 220);
    case "grid-12":
      return grid12(gap, input.columns ?? 12);
    default:
      return flexCenter(gap);
  }
}

export function cssGenerator(): CssGeneratorApi;
export function cssGenerator(input: CssGeneratorInput): CssGeneratorResult;
export function cssGenerator(input?: CssGeneratorInput): CssGeneratorApi | CssGeneratorResult {
  if (!input) {
    return {
      generate: runCssGenerator,
      run: runCssGenerator,
    };
  }

  return runCssGenerator(input);
}
