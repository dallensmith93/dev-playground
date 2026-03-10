import type { PropsWithChildren } from "react";

export default function PageContainer({ children }: PropsWithChildren) {
  return <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">{children}</main>;
}
