import { useCallback } from "react";
import { tools } from "../data/tools";

export function useRandomTool() {
  return useCallback(() => {
    if (tools.length === 0) return null;
    return tools[Math.floor(Math.random() * tools.length)];
  }, []);
}
