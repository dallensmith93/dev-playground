import { randomItem } from "../utils/random";

const subjects = ["layout", "button", "navbar", "modal", "grid", "animation", "hero section"];
const crimes = ["ignores flexbox laws", "uses 12 nested divs", "is absolutely positioned out of spite", "has no mobile strategy", "declares war on spacing", "has negative margins for emotional reasons"];
const closers = [
  "Respectfully cursed.",
  "Please refactor before sunrise.",
  "This is why design reviews exist.",
  "A bold choice with consequences.",
  "Your future self will file a complaint."
];

export function generateCssInsult(): string {
  return `Your ${randomItem(subjects)} ${randomItem(crimes)}. ${randomItem(closers)}`;
}
