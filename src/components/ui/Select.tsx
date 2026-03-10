import type { SelectHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export default function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "min-h-11 w-full rounded-lg border border-white/15 bg-slate-900/80 px-3 py-2.5 text-base text-slate-100 focus:border-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30 sm:text-sm",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
