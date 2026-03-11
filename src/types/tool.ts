export type ToolCategory = "Humor" | "Interactive" | "Career Tools" | "Startup Satire" | "Developer";

export type Tool = {
  name: string;
  slug: string;
  description: string;
  path: string;
  category: ToolCategory;
  icon: string;
  featured?: boolean;
};
