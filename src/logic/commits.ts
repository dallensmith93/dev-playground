import { randomItem } from "../utils/random";

export type CommitMood = "bugfix" | "feature" | "panic" | "friday";

const moodLines: Record<CommitMood, string[]> = {
  bugfix: [
    "fix: patch null check before it invents new dimensions",
    "fix: stop button from gaslighting users",
    "fix: race condition now races less",
  ],
  feature: [
    "feat: add shiny thing product asked for at 4:58 PM",
    "feat: launch feature flag and pray",
    "feat: ship v1 with confidence and TODO comments",
  ],
  panic: [
    "hotfix: rollback optimism and restore production",
    "chore: sacrifice logs to the incident gods",
    "fix: if this works, nobody ask why",
  ],
  friday: [
    "chore: tiny refactor before weekend definitely safe",
    "feat: merge now, reflect Monday",
    "fix: shipping this and logging off immediately",
  ],
};

const suffixes = [
  " (#ship-it)",
  " (please pass CI)",
  " (do not reopen)",
  " (works on my machine)",
  " (vibes tested)",
];

export function generateCommitMessage(mood: CommitMood, scope: string): string {
  const base = randomItem(moodLines[mood]);
  const cleanScope = scope.trim();
  const scoped = cleanScope ? `${base} [${cleanScope}]` : base;
  return `${scoped}${randomItem(suffixes)}`;
}

