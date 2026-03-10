import type { PropsWithChildren } from "react";
import { cn } from "../../utils/cn";

export default function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <section className={cn("rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-sm", className)}>{children}</section>;
}
