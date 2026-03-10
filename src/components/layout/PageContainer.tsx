import type { PropsWithChildren } from "react";

export default function PageContainer({ children }: PropsWithChildren) {
  return <main className="mx-auto w-full max-w-6xl px-3 py-6 sm:px-4 sm:py-10">{children}</main>;
}
