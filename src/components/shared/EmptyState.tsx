export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-6 text-sm text-slate-400">
      {message}
    </div>
  );
}
