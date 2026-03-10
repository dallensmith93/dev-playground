import { clampScore } from "../utils/scoring";
import { randomInt } from "../utils/random";

const riskWords = ["ai", "blockchain", "nft", "crypto", "social", "marketplace", "clone", "todo", "platform", "dashboard"];
const commitmentWords = ["offline", "local first", "paying users", "b2b", "automation", "workflow", "niche", "pain point", "analytics"];

export type SideProjectResult = {
  abandonmentScore: number;
  forecast: string;
  reasons: string[];
  recommendation: string;
};

export function validateSideProject(idea: string, weeklyHours: number): SideProjectResult {
  const text = idea.trim().toLowerCase();
  let score = 45;
  const reasons: string[] = [];

  if (!text) {
    return {
      abandonmentScore: 0,
      forecast: "No idea entered",
      reasons: ["No project description yet."],
      recommendation: "Write one clear sentence: user + pain + outcome.",
    };
  }

  const riskHits = riskWords.filter((word) => text.includes(word));
  const commitmentHits = commitmentWords.filter((word) => text.includes(word));

  score += riskHits.length * 8;
  score -= commitmentHits.length * 6;

  if (text.length < 30) {
    score += 10;
    reasons.push("Concept is vague, high chance of scope explosion.");
  } else {
    reasons.push("You provided enough context to avoid pure vibe-building.");
  }

  if (weeklyHours < 2) {
    score += 20;
    reasons.push("Weekly time is near zero. Momentum risk is high.");
  } else if (weeklyHours <= 6) {
    score += 6;
    reasons.push("Limited time means slow validation loop.");
  } else {
    score -= 8;
    reasons.push("Consistent weekly hours improve shipping odds.");
  }

  if (riskHits.length > 0) {
    reasons.push(`Risk terms detected: ${riskHits.join(", ")}.`);
  }

  if (commitmentHits.length > 0) {
    reasons.push(`Strong terms detected: ${commitmentHits.join(", ")}.`);
  }

  const abandonmentScore = clampScore(score + randomInt(-7, 7));

  const forecast =
    abandonmentScore >= 75
      ? "Archive in 3 weekends"
      : abandonmentScore >= 50
        ? "Survives until first redesign"
        : "Unexpectedly durable side quest";

  const recommendation =
    abandonmentScore >= 75
      ? "Cut scope to one painful workflow and ship in 7 days."
      : abandonmentScore >= 50
        ? "Define one measurable success metric before adding features."
        : "You have a decent foundation. Validate with 3 users this week.";

  return { abandonmentScore, forecast, reasons, recommendation };
}
