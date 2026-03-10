import { randomItem } from "../utils/random";

const openers = [
  "Quack. Let's debug this properly.",
  "Duck verdict incoming.",
  "I heard your stack trace from across the pond.",
  "Interesting. Continue your confession."
];

const bugPatterns: Array<{ test: RegExp; advice: string[] }> = [
  {
    test: /undefined|null|cannot read/i,
    advice: [
      "Check where the value is created and guard early.",
      "Log the object shape right before the crash path.",
      "Add a fallback instead of trusting optional data."
    ]
  },
  {
    test: /async|await|promise|race|timing/i,
    advice: [
      "Your timing is non-deterministic. Reproduce with fixed order logging.",
      "Await every branch that mutates shared state.",
      "Handle loading, success, and error states explicitly."
    ]
  },
  {
    test: /css|layout|overflow|z-index/i,
    advice: [
      "Open devtools layers panel. Your stacking context is lying to you.",
      "Inspect computed styles before blaming Tailwind.",
      "Create a minimal repro with three elements and rebuild from there."
    ]
  }
];

const defaultAdvice = [
  "Write down expected behavior in one sentence.",
  "Narrow the failing path to the smallest reproducible case.",
  "Verify assumptions with logs before editing code.",
  "Revert the last clever change and test again."
];

export function getDuckResponse(problem: string): string {
  const text = problem.trim();
  if (!text) {
    return "Quack. Tell me what broke, what you expected, and what actually happened.";
  }

  const pattern = bugPatterns.find((item) => item.test.test(text));
  const tip = pattern ? randomItem(pattern.advice) : randomItem(defaultAdvice);
  const severity = text.length > 180 ? "You are overexplaining. This is good." : "Short report. Acceptable.";

  return `${randomItem(openers)} ${severity} ${tip}`;
}
