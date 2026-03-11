import type { KeyboardEvent } from "react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { developerTools } from "../../data/tools";
import { useCommandPalette } from "../../hooks/useCommandPalette";
import { commandSearch } from "../../logic/commandSearch";
import type { CommandItem } from "../../types/command";
import Card from "../ui/Card";
import CommandInput from "./CommandInput";
import CommandList from "./CommandList";

export default function CommandPalette() {
  const navigate = useNavigate();
  const { isOpen, query, selectedIndex, close, moveSelection, setQuery, setSelectedIndex } = useCommandPalette();

  const commands = useMemo<CommandItem[]>(
    () =>
      developerTools.map((tool) => ({
        name: tool.name,
        route: tool.route,
        description: tool.description,
      })),
    [],
  );

  const filtered = useMemo(() => commandSearch(query, commands), [commands, query]);

  const selectCommand = (item: CommandItem) => {
    navigate(item.route);
    close();
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveSelection("down", filtered.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveSelection("up", filtered.length);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const chosen = filtered[selectedIndex];
      if (chosen) {
        selectCommand(chosen);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/75 p-3 pt-16 backdrop-blur-sm sm:p-4 sm:pt-20" onClick={close}>
      <div className="w-full max-w-2xl" onClick={(event) => event.stopPropagation()}>
        <Card className="space-y-3 border-white/15 bg-slate-900/95">
          <CommandInput query={query} onQueryChange={setQuery} onKeyDown={onInputKeyDown} autoFocus />
          <CommandList items={filtered} selectedIndex={selectedIndex} onSelect={selectCommand} onHover={setSelectedIndex} />
          <p className="text-xs text-slate-500">Use arrows/Enter on keyboard, or tap a result on mobile.</p>
        </Card>
      </div>
    </div>
  );
}
