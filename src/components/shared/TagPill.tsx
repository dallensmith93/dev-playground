import type { PropsWithChildren } from "react";

export default function TagPill({ children }: PropsWithChildren) {
  return (
    <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-100">
      {children}
    </span>
  );
}
