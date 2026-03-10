import type { JobCheckResult } from "../types/jobCheck";
import { clampScore } from "../utils/scoring";

type Pattern = { test: RegExp; note: string; weight: number };

const redFlagPatterns: Pattern[] = [
  { test: /urgent hiring|apply now|immediate start/i, note: "Pressure language and urgency tactics", weight: 10 },
  { test: /earn \$?\d{2,}[kK]?\s*(per week|weekly)|unlimited income/i, note: "Too-good-to-be-true compensation wording", weight: 18 },
  { test: /no experience needed/i, note: "No experience claim can be risky in high-pay postings", weight: 12 },
  { test: /wire transfer|crypto payment|send money|purchase equipment/i, note: "Requests money or purchases from candidates", weight: 24 },
  { test: /bank account|ssn|social security|credit card/i, note: "Requests sensitive personal financial details", weight: 25 },
  { test: /work from home and get rich|guaranteed income/i, note: "Spammy income promises", weight: 14 },
  { test: /kindly|dear candidate|whatsapp/i, note: "Suspicious spam-style wording", weight: 8 }
];

const goodSignalPatterns: Pattern[] = [
  { test: /responsibilities|what you'll do|day-to-day/i, note: "Clear responsibilities section", weight: 8 },
  { test: /requirements|qualifications/i, note: "Specific qualification criteria", weight: 8 },
  { test: /react|typescript|python|node|aws|sql|kubernetes/i, note: "Concrete stack or tooling listed", weight: 8 },
  { test: /report to|hiring manager|interview process/i, note: "Defined reporting line or process", weight: 7 },
  { test: /salary range|benefits|pto|equity/i, note: "Transparent compensation and benefits", weight: 9 },
  { test: /about us|company|mission|team/i, note: "Some company context provided", weight: 6 }
];

export function analyzeJobDescription(text: string): JobCheckResult {
  const normalized = text.trim();
  if (!normalized) {
    return {
      scamRiskScore: 0,
      redFlags: [],
      goodSigns: [],
      verdict: "Mixed signals",
      recommendation: "Paste a full job description to analyze.",
    };
  }

  const lower = normalized.toLowerCase();
  let risk = 30;

  const redFlags = redFlagPatterns
    .filter((rule) => rule.test.test(lower))
    .map((rule) => {
      risk += rule.weight;
      return rule.note;
    });

  const goodSigns = goodSignalPatterns
    .filter((rule) => rule.test.test(lower))
    .map((rule) => {
      risk -= rule.weight;
      return rule.note;
    });

  const shortAndVague = normalized.length < 260;
  if (shortAndVague) {
    risk += 10;
    redFlags.push("Very short posting with limited role specifics");
  }

  if (!/https?:\/\//i.test(lower) && !/linkedin|company/i.test(lower)) {
    risk += 6;
    redFlags.push("Unclear company identity or external verification details");
  }

  const scamRiskScore = clampScore(risk);

  const verdict: JobCheckResult["verdict"] =
    scamRiskScore >= 70 ? "High scam risk" : scamRiskScore >= 40 ? "Mixed signals" : "Looks mostly legit";

  const recommendation =
    verdict === "High scam risk"
      ? "Avoid sharing personal or financial details. Verify company identity independently before engaging."
      : verdict === "Mixed signals"
        ? "Proceed cautiously. Ask clarifying questions about team, reporting line, and compensation in writing."
        : "Looks reasonably structured. Still verify role details with official company channels.";

  return {
    scamRiskScore,
    redFlags: redFlags.length ? redFlags : ["No major scam patterns detected"],
    goodSigns: goodSigns.length ? goodSigns : ["Few concrete quality signals found"],
    verdict,
    recommendation,
  };
}
