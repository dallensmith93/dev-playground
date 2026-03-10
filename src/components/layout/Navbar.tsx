import { Link, NavLink } from "react-router-dom";
import { appMeta } from "../../constants/appMeta";
import { routes } from "../../constants/routes";
import RandomToolButton from "../shared/RandomToolButton";

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
