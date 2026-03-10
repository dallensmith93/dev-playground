export function keywordMatch(text: string, keywords: string[]): number {
  const normalized = text.toLowerCase();
  return keywords.reduce((count, keyword) => count + (normalized.includes(keyword.toLowerCase()) ? 1 : 0), 0);
}
