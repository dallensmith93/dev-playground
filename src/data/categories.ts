import type { ToolCategory } from "../types/tool";

export const categories: readonly ("All" | ToolCategory)[] = [
  "All",
  "Humor",
  "Interactive",
  "Career Tools",
  "Startup Satire",
] as const;
