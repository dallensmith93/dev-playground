import { clampScore } from "../utils/scoring";

export type LayoffInputs = {
  runwayMonths: number;
  reorgCount: number;
  ceoHypeLevel: number;
  bugBacklogSize: number;
};

export type LayoffResult = {
  score: number;
  verdict: string;
  recommendation: string;
  reasons: string[];
};

export function calculateLayoffRisk(input: LayoffInputs): LayoffResult {
  const reasons: string[] = [];
  let score = 20;

  if (input.runwayMonths < 6) {
    score += 30;
    reasons.push("Runway is under 6 months and finance is sweating.");
  } else if (input.runwayMonths < 12) {
    score += 15;
    reasons.push("Runway is moderate; leadership might \"focus\" the org chart.");
  } else {
    reasons.push("Runway looks stable enough for now.");
  }

  if (input.reorgCount >= 3) {
    score += 20;
    reasons.push("Frequent reorganizations detected. Titles are not safe.");
  }

  if (input.ceoHypeLevel >= 8) {
    score += 18;
    reasons.push("CEO hype level is very high. Slides may outnumber strategy.");
  }

  if (input.bugBacklogSize > 120) {
    score += 12;
    reasons.push("Backlog is large and velocity memes are rising.");
  }

  const finalScore = clampScore(score);

  if (finalScore >= 75) {
    return {
      score: finalScore,
      verdict: "High turbulence",
      recommendation: "Update resume, keep networking warm, and document impact now.",
      reasons,
    };
  }

  if (finalScore >= 45) {
    return {
      score: finalScore,
      verdict: "Watchful mode",
      recommendation: "Stay visible, prioritize measurable wins, avoid stealth work.",
      reasons,
    };
  }

  return {
    score: finalScore,
    verdict: "Relatively calm",
    recommendation: "Keep shipping. Also keep receipts for your accomplishments.",
    reasons,
  };
}

