import { randomItem } from "../utils/random";

const snark = [
  "Have you tried reading the error message?",
  "Interesting question. Wrong, but interesting.",
  "This has been asked 47 times since 2012.",
  "Minimal reproducible example or it didn't happen.",
  "Your code works on my machine and my machine is emotionally stable."
];

const actualHelp = [
  "Start by isolating the failing function and add input/output logs.",
  "Check null guards around external data and async race conditions.",
  "Write one failing test first, then fix the smallest root cause.",
  "Reduce the problem to a tiny sample and verify assumptions one by one."
];

export function generateStackOverflowAnswer(question: string, includeHelpfulTip: boolean): string {
  const clean = question.trim();
  if (!clean) return "Ask a coding question first. The internet requires tribute.";

  const intro = randomItem(snark);
  const body = `Question detected: "${clean.slice(0, 140)}${clean.length > 140 ? "..." : ""}"`;

  if (!includeHelpfulTip) return `${intro}\n\n${body}`;

  return `${intro}\n\n${body}\n\nActual advice: ${randomItem(actualHelp)}`;
}
