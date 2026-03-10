import type { PropsWithChildren } from "react";

export default function SectionHeader({ children }: PropsWithChildren) {
  return <h2 className="text-xl font-semibold text-slate-100 sm:text-2xl">{children}</h2>;
}
