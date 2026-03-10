import { randomItem } from "../utils/random";

const openers = [
  "Bold move",
  "Investor update",
  "Reality check",
  "Breaking news",
  "Pitch deck note",
];

const roastTemplates = [
  "{opener}: '{idea}' is basically {twist} with extra caffeine and a logo gradient.",
  "'{idea}' sounds like {twist}, but with 4x more meetings and zero paying users.",
  "We love '{idea}', especially the part where {twist} does all the work.",
  "'{idea}' is giving 'seed round first, product later' energy. Also: {twist}.",
  "Congrats, '{idea}' turns {twist} into a subscription no one asked for.",
];

const keywordTwists: Array<{ words: string[]; line: string }> = [
  { words: ["ai", "llm", "gpt", "agent"], line: "a chatbot pretending to be your cofounder" },
  { words: ["blockchain", "crypto", "web3"], line: "a spreadsheet wearing a token hoodie" },
  { words: ["saas", "b2b", "workflow"], line: "another dashboard no one opens after onboarding" },
  { words: ["marketplace", "platform"], line: "middleman economics with extra landing pages" },
  { words: ["social", "creator", "community"], line: "a group chat with venture funding" },
];

const defaultTwists = [
  "Uber for things that never needed Uber",
  "Notion template fatigue as a business model",
  "calendar invites disguised as innovation",
  "Figma mockups searching for product-market fit",
];

export function generateStartupRoast(rawIdea: string): string {
  const idea = rawIdea.trim();
  if (!idea) {
    return "You forgot the startup idea. Even your burn rate showed up before the product.";
  }

  const lowered = idea.toLowerCase();
  const keywordTwist = keywordTwists.find((entry) => entry.words.some((word) => lowered.includes(word)));
  const twist = keywordTwist?.line ?? randomItem(defaultTwists);

  const template = randomItem(roastTemplates);
  return template
    .replace("{opener}", randomItem(openers))
    .replace("{idea}", idea)
    .replace("{twist}", twist);
}

