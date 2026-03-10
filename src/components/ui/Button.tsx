import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type ButtonVariant = "primary" | "ghost" | "danger";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export default function Button({ className, variant = "primary", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-cyan-300/60 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-cyan-400 text-slate-950 hover:bg-cyan-300",
        variant === "ghost" && "border border-white/15 bg-white/[0.04] text-slate-200 hover:bg-white/[0.08]",
        variant === "danger" && "bg-rose-500/90 text-white hover:bg-rose-400",
        className,
      )}
      {...props}
    />
  );
}
