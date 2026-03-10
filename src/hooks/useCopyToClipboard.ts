import { useState } from "react";

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = async (value: string) => {
    if (!value.trim()) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return { copied, copy };
}
