export type JobCheckResult = {
  scamRiskScore: number;
  redFlags: string[];
  goodSigns: string[];
  verdict: "Looks mostly legit" | "Mixed signals" | "High scam risk";
  recommendation: string;
};
