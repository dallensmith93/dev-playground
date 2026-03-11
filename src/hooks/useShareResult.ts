import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { decodeShareParams } from "../logic/shareDecoder";

export function useShareResult() {
  const { tool = "", data = "" } = useParams<{ tool: string; data: string }>();

  return useMemo(() => {
    if (!tool || !data) {
      return { ok: false as const, error: "Missing share link data." };
    }
    return decodeShareParams(tool, data);
  }, [tool, data]);
}
