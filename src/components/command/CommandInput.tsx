import type { KeyboardEvent } from "react";
import Input from "../ui/Input";

type CommandInputProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
};

export default function CommandInput({ query, onQueryChange, onKeyDown, autoFocus = false }: CommandInputProps) {
  return (
    <Input
      autoFocus={autoFocus}
      value={query}
      onChange={(event) => onQueryChange(event.target.value)}
      onKeyDown={onKeyDown}
      placeholder="Search tools..."
      aria-label="Command palette search"
      className="h-12 text-sm"
    />
  );
}
