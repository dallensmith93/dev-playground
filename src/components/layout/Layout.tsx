import type { PropsWithChildren } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageContainer from "./PageContainer";
import CommandPalette from "../command/CommandPalette";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>
      <Navbar />
      <PageContainer>{children}</PageContainer>
      <Footer />
      <CommandPalette />
    </div>
  );
}
