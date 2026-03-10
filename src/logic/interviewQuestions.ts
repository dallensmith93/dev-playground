import { randomInt, randomItem } from "../utils/random";

export type ChaosLevel = "mild" | "spicy" | "feral";

const prompts: Record<ChaosLevel, string[]> = {
  mild: [
    "Explain React reconciliation using only coffee shop metaphors.",
    "Design a debounce hook while your interviewer continuously interrupts.",
    "Refactor a TODO app to be testable without changing UI behavior.",
  ],
  spicy: [
    "Whiteboard a distributed cache invalidation strategy for a meme app with 20M users.",
    "Implement a rate limiter while narrating your thought process in pirate voice.",
    "Debug a production-only bug where all timestamps shift by exactly 13 minutes.",
  ],
  feral: [
    "Build a compiler for emojis that outputs CSS and convince us it is maintainable.",
    "Optimize a recursive algorithm while solving a behavioral question simultaneously.",
    "Design pagination for infinite data where users also demand finite certainty.",
  ],
};

const hints = [
  "Start with assumptions. Interviewers love constraints.",
  "Clarify tradeoffs before coding. It buys you credibility and oxygen.",
  "Narrate your decision path, not just the final answer.",
  "Use a simple baseline first, then optimize.",
];

export type ChaosQuestion = {
  prompt: string;
  timeLimit: number;
  hint: string;
};

export function generateChaosQuestion(level: ChaosLevel): ChaosQuestion {
  return {
    prompt: randomItem(prompts[level]),
    timeLimit: randomInt(20, 90),
    hint: randomItem(hints),
  };
}

