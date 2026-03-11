import type { CommandItem } from "../types/command";

export function commandSearch(query: string, items: CommandItem[]): CommandItem[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return items;
  }

  return items.filter((item) => {
    const haystack = `${item.name} ${item.description}`.toLowerCase();
    return haystack.includes(normalized);
  });
}
