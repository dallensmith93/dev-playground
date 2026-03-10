import type { SelectHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export default function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-lg border border-white/15 bg-slate-900/80 px-3 py-2 text-slate-100 focus:border-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
