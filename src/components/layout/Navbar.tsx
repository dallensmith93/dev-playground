import { Link, NavLink } from "react-router-dom";
import { appMeta } from "../../constants/appMeta";
import { routes } from "../../constants/routes";
import RandomToolButton from "../shared/RandomToolButton";
import Button from "../ui/Button";

function openCommandPalette() {
  window.dispatchEvent(new Event("command-palette:open"));
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to={routes.home} className="group">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300/90 sm:text-sm sm:tracking-[0.22em]">
            {appMeta.name}
          </div>
          <div className="hidden text-xs text-slate-400 transition group-hover:text-slate-300 sm:block">{appMeta.subtitle}</div>
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button type="button" variant="ghost" onClick={openCommandPalette} className="px-2.5 py-2 text-xs sm:text-sm md:hidden">
            Search
          </Button>
          <div className="hidden items-center gap-1 rounded-lg border border-white/15 bg-white/[0.03] px-2.5 py-2 text-xs text-slate-300 md:flex">
            <span className="text-slate-400">Open Command Palette</span>
            <kbd className="rounded border border-white/20 bg-slate-900/70 px-1.5 py-0.5 font-mono text-[11px] text-cyan-200">Ctrl + K</kbd>
          </div>
          <Button type="button" variant="ghost" onClick={openCommandPalette} className="hidden px-2.5 py-2 text-xs md:inline-flex">
            Search
          </Button>
          <NavLink
            to={routes.home}
            className={({ isActive }) =>
              `rounded-lg px-2.5 py-2 text-sm transition sm:px-3 ${isActive ? "bg-white/10 text-slate-100" : "text-slate-300 hover:bg-white/5"}`
            }
          >
            Home
          </NavLink>
          <RandomToolButton />
        </div>
      </nav>
    </header>
  );
}
