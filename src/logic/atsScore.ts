import type { AtsAnalysis } from "../types/ats";
import { clampScore } from "../utils/scoring";

const actionVerbs = [
  "built",
  "delivered",
  "improved",
  "reduced",
  "optimized",
  "led",
  "designed",
  "implemented",
  "launched",
  "owned",
  "automated",
  "scaled",
];

const fluffTerms = ["hardworking", "team player", "passionate", "go-getter", "ninja", "rockstar", "synergy"];

const roleTerms = [
  "react",
  "typescript",
  "javascript",
  "testing",
  "api",
  "accessibility",
  "performance",
  "ci/cd",
  "frontend",
  "css",
  "tailwind",
];

function extractKeywords(text: string): string[] {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .split(/[^a-z0-9+#/.-]+/)
        .map((token) => token.trim())
        .filter((token) => token.length >= 3),
    ),
  );
}

export function analyzeAts(resumeText: string, jobDescriptionText: string): AtsAnalysis {
  const resume = resumeText.toLowerCase();

  const jobKeywords = extractKeywords(jobDescriptionText).slice(0, 40);
  const missingTerms = jobKeywords.filter((keyword) => !resume.includes(keyword)).slice(0, 12);
  const matchedTerms = jobKeywords.filter((keyword) => resume.includes(keyword));

  const verbHits = actionVerbs.filter((verb) => resume.includes(verb));
  const roleHits = roleTerms.filter((term) => resume.includes(term));
  const fluffHits = fluffTerms.filter((term) => resume.includes(term));

  const hasNumbers = /\b\d+%?\b/.test(resumeText);
  const bulletCount = (resumeText.match(/[-*•]/g) ?? []).length;
  const repeatedWordsPenalty = /(\b\w+\b)(?:\W+\1){2,}/i.test(resumeText) ? 8 : 0;

  let score = 35;
  score += Math.min(30, matchedTerms.length * 2);
  score += Math.min(15, verbHits.length * 2);
  score += Math.min(12, roleHits.length * 1.5);
  score += hasNumbers ? 8 : 0;
  score += bulletCount >= 3 ? 5 : 0;
  score -= Math.min(12, fluffHits.length * 3);
  score -= repeatedWordsPenalty;

  const keywordCoverage = jobKeywords.length === 0 ? 0 : Math.round((matchedTerms.length / jobKeywords.length) * 100);

  const strongSignals: string[] = [];
  const weakSignals: string[] = [];
  const suggestions: string[] = [];

  if (verbHits.length >= 3) strongSignals.push("Uses strong action verbs.");
  else {
    weakSignals.push("Action verbs are limited.");
    suggestions.push("Add accomplishment bullets starting with verbs like Built, Reduced, Improved.");
  }

  if (hasNumbers) strongSignals.push("Includes measurable impact language.");
  else {
    weakSignals.push("Lacks measurable outcomes.");
    suggestions.push("Quantify impact with numbers, percentages, or scope.");
  }

  if (keywordCoverage >= 55) strongSignals.push("Good keyword overlap with target job.");
  else {
    weakSignals.push("Keyword coverage is low.");
    suggestions.push("Mirror critical terms from the job description naturally in relevant bullets.");
  }

  if (fluffHits.length > 0) {
    weakSignals.push("Contains generic fluff terms.");
    suggestions.push("Replace vague adjectives with concrete results and tools.");
  }

  if (roleHits.length >= 4) strongSignals.push("Role-specific technical terms are present.");
  else suggestions.push("Add role-specific stack keywords tied to real projects.");

  if (missingTerms.length > 0) {
    suggestions.push("Address top missing terms if they reflect your real experience.");
  }

  if (!jobDescriptionText.trim()) {
    weakSignals.push("No target job description provided; scoring is approximate.");
    suggestions.push("Paste a target job description for better keyword matching.");
  }

  return {
    score: clampScore(Math.round(score)),
    keywordCoverage,
    strongSignals,
    weakSignals,
    missingTerms,
    suggestions: Array.from(new Set(suggestions)).slice(0, 6),
  };
}


