import type { PropsWithChildren } from "react";

export default function ResultCard({ children }: PropsWithChildren) {
  return (
    <div className="animate-in rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 p-4 text-slate-100 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] duration-300">
      {children}
    </div>
  );
}
