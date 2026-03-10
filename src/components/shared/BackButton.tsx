import { Link } from "react-router-dom";

export default function BackButton({ to = "/" }: { to?: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-slate-200 transition hover:bg-white/[0.08]"
    >
      Back to playground
    </Link>
  );
}
