export type AtsAnalysis = {
  score: number;
  keywordCoverage: number;
  strongSignals: string[];
  weakSignals: string[];
  missingTerms: string[];
  suggestions: string[];
};
