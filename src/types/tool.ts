export type ToolCategory = "Humor" | "Interactive" | "Career Tools" | "Startup Satire";

export type Tool = {
  name: string;
  slug: string;
  description: string;
  path: string;
  category: ToolCategory;
  icon: string;
  featured?: boolean;
};
