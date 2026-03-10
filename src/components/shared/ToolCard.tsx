import { Link } from "react-router-dom";
import type { Tool } from "../../types/tool";

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      to={tool.path}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.06]"
    >
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-cyan-300/10 blur-2xl transition-all duration-300 group-hover:bg-cyan-300/20" />
      <div className="relative">
        <h3 className="text-lg font-semibold text-slate-100">{tool.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{tool.description}</p>
      </div>
    </Link>
  );
}
