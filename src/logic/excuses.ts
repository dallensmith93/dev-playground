import { randomItem } from "../utils/random";

const excuses = [
  "CI failed because the build server sensed fear.",
  "I was debugging in production for authenticity.",
  "The merge conflict was emotionally complex.",
  "I fixed one bug and accidentally unlocked three legacy features.",
  "My laptop entered battery saver and also ambition saver mode.",
  "The issue is reproducible only under moonlight and weak Wi-Fi.",
  "I optimized startup time by removing startup.",
];

export function generateCodingExcuse(): string {
  return randomItem(excuses);
}

