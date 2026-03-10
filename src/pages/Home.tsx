import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ToolCard from "../components/shared/ToolCard";
import RandomToolButton from "../components/shared/RandomToolButton";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { appMeta } from "../constants/appMeta";
import { routes } from "../constants/routes";
import { categories } from "../data/categories";
import { tools } from "../data/tools";

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tools.filter((tool) => {
      const categoryMatch = activeCategory === "All" || tool.category === activeCategory;
      const searchMatch = !query || `${tool.name} ${tool.description} ${tool.category}`.toLowerCase().includes(query);
      return categoryMatch && searchMatch;
    });
  }, [activeCategory, search]);

  const featured = tools.find((tool) => tool.featured) ?? tools[0];

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-6 sm:p-10">
        <div className="pointer-events-none absolute -right-20 top-4 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-emerald-400/20 blur-2xl" />
        <div className="relative max-w-3xl space-y-4">
          <p className="inline-flex rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.18em] text-cyan-200">
            Frontend Portfolio Centerpiece
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">{appMeta.name}</h1>
          <p className="text-lg text-slate-300">{appMeta.subtitle}</p>
          <p className="text-sm leading-relaxed text-slate-400">{appMeta.alt}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href="#tool-grid">
              <Button>Explore Tools</Button>
            </a>
            <RandomToolButton />
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1.6fr_1fr]">
        <Card>
          <h2 className="text-lg font-semibold text-slate-100">Featured</h2>
          <p className="mt-2 text-sm text-slate-400">Hand-picked for replayability and actual usefulness.</p>
          <Link to={featured.path} className="mt-4 block rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:bg-white/[0.05]">
            <h3 className="text-base font-medium text-slate-100">{featured.name}</h3>
            <p className="mt-1 text-sm text-slate-400">{featured.description}</p>
          </Link>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-slate-100">Find a tool</h2>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, category, use case"
            className="mt-3 w-full rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/50 focus:outline-none"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-3 py-1 text-xs transition ${
                  activeCategory === category
                    ? "bg-cyan-300 text-slate-950"
                    : "border border-white/15 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </Card>
      </section>

      <section id="tool-grid" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-100">Tool Grid</h2>
          <p className="text-sm text-slate-400">{filtered.length} tools</p>
        </div>
        {filtered.length === 0 ? (
          <Card>
            <p className="text-sm text-slate-400">No tools match that filter. Try a broader keyword.</p>
            <Link to={routes.home} className="mt-3 inline-block">
              <Button variant="ghost">Reset Filters</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
