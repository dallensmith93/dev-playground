import { randomItem } from "../utils/random";

const dictionary: Record<string, string[]> = {
  synergy: ["Nobody owns this task yet.", "Three teams in one Slack thread."],
  disruptive: ["Mostly a clone, but with gradient backgrounds.", "Same product, louder landing page."],
  ai: ["A prompt glued to a form.", "Autocomplete with investor funding."],
  scalable: ["Works for six users and one demo laptop.", "Infrastructure will be future-us's problem."],
  pivot: ["Original plan failed, now we call it strategy.", "New deck, same chaos."],
  growth: ["Spend money first, explain metrics later.", "More ads, fewer answers."],
  stealth: ["No users yet.", "Still naming the company."]
};

const fillers = [
  "Translation complete:",
  "Decoded startup dialect:",
  "Plain-English render:",
  "Investor-to-human translation:"
];

export function translateBuzzwords(input: string): string {
  const clean = input.trim();
  if (!clean) return "Type some buzzwords and I will translate the chaos.";

  const lower = clean.toLowerCase();
  const lines: string[] = [];

  Object.entries(dictionary).forEach(([keyword, options]) => {
    if (lower.includes(keyword)) {
      lines.push(`- ${keyword}: ${randomItem(options)}`);
    }
  });

  if (lines.length === 0) {
    const fragments = clean
      .split(/[,.]/)
      .map((chunk) => chunk.trim())
      .filter(Boolean)
      .slice(0, 4);

    fragments.forEach((fragment) => {
      lines.push(`- ${fragment}: "We are figuring this out live."`);
    });
  }

  return `${randomItem(fillers)}\n${lines.join("\n")}`;
}
