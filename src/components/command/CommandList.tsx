import type { CommandItem } from "../../types/command";

type CommandListProps = {
  items: CommandItem[];
  selectedIndex: number;
  onSelect: (item: CommandItem) => void;
  onHover: (index: number) => void;
};

export default function CommandList({ items, selectedIndex, onSelect, onHover }: CommandListProps) {
  if (items.length === 0) {
    return <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 text-sm text-slate-400">No matching tools.</div>;
  }

  return (
    <ul className="max-h-[55vh] space-y-1 overflow-y-auto sm:max-h-80">
      {items.map((item, index) => {
        const active = index === selectedIndex;
        return (
          <li key={item.route}>
            <button
              type="button"
              onClick={() => onSelect(item)}
              onMouseEnter={() => onHover(index)}
              className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                active
                  ? "border-cyan-300/40 bg-cyan-300/10 text-slate-100"
                  : "border-transparent bg-white/[0.02] text-slate-300 hover:border-white/10 hover:bg-white/[0.06]"
              }`}
            >
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-slate-400">{item.description}</p>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
