export type PersonalityKey = "shipper" | "architect" | "debugger" | "chaosMage";

export type PersonalityQuestion = {
  id: number;
  prompt: string;
  options: Array<{ label: string; key: PersonalityKey }>;
};

export type PersonalityResult = {
  type: string;
  summary: string;
  strengths: string[];
  warning: string;
};

export const personalityQuestions: PersonalityQuestion[] = [
  {
    id: 1,
    prompt: "A bug appears in production. Your first move is...",
    options: [
      { label: "Hotfix immediately", key: "shipper" },
      { label: "Trace architecture impact first", key: "architect" },
      { label: "Read logs for root cause", key: "debugger" },
      { label: "Rename it a feature", key: "chaosMage" },
    ],
  },
  {
    id: 2,
    prompt: "Your preferred project board style?",
    options: [
      { label: "Move fast, small tickets", key: "shipper" },
      { label: "Milestones and systems mapping", key: "architect" },
      { label: "Incident notes and edge cases", key: "debugger" },
      { label: "A single sticky note saying 'ship it'", key: "chaosMage" },
    ],
  },
  {
    id: 3,
    prompt: "Code review comments from you usually sound like...",
    options: [
      { label: "'Can we merge this today?'", key: "shipper" },
      { label: "'How does this scale in 12 months?'", key: "architect" },
      { label: "'What happens when input is undefined?'", key: "debugger" },
      { label: "'I both fear and respect this PR'", key: "chaosMage" },
    ],
  },
  {
    id: 4,
    prompt: "When deadlines tighten, you...",
    options: [
      { label: "Cut scope and ship cleanly", key: "shipper" },
      { label: "Protect core design decisions", key: "architect" },
      { label: "Hunt regressions before release", key: "debugger" },
      { label: "Ship with confidence and a backup excuse", key: "chaosMage" },
    ],
  },
];

const resultMap: Record<PersonalityKey, PersonalityResult> = {
  shipper: {
    type: "The Velocity Shipper",
    summary: "You optimize for momentum, outcomes, and visible progress.",
    strengths: ["Execution speed", "Pragmatic scope control", "Clear delivery bias"],
    warning: "Remember: fast and broken is still broken.",
  },
  architect: {
    type: "The Systems Architect",
    summary: "You see patterns early and build things that survive growth.",
    strengths: ["Long-term thinking", "Design consistency", "Scalability instincts"],
    warning: "Not every TODO needs a framework paper.",
  },
  debugger: {
    type: "The Root-Cause Hunter",
    summary: "You calm chaos by finding the real problem quickly.",
    strengths: ["Signal extraction", "Quality focus", "Failure analysis"],
    warning: "Sometimes 'good enough' is the real blocker fix.",
  },
  chaosMage: {
    type: "The Creative Chaos Mage",
    summary: "You improvise under pressure and still find a path to shipping.",
    strengths: ["Adaptability", "Creative problem-solving", "Resilience"],
    warning: "Document your magic before future-you files a complaint.",
  },
};

export function resolvePersonality(answers: PersonalityKey[]): PersonalityResult {
  const score: Record<PersonalityKey, number> = {
    shipper: 0,
    architect: 0,
    debugger: 0,
    chaosMage: 0,
  };

  answers.forEach((answer) => {
    score[answer] += 1;
  });

  const winner = (Object.entries(score).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "shipper") as PersonalityKey;
  return resultMap[winner];
}

