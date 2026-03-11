import { useCallback, useEffect, useState } from "react";

type UseCommandPaletteResult = {
  isOpen: boolean;
  query: string;
  selectedIndex: number;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setQuery: (value: string) => void;
  setSelectedIndex: (value: number) => void;
  moveSelection: (direction: "up" | "down", total: number) => void;
};

export function useCommandPalette(): UseCommandPaletteResult {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQueryState] = useState("");
  const [selectedIndex, setSelectedIndexState] = useState(0);

  const open = useCallback(() => setIsOpen(true), []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQueryState("");
    setSelectedIndexState(0);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((previous) => {
      const next = !previous;
      if (!next) {
        setQueryState("");
        setSelectedIndexState(0);
      }
      return next;
    });
  }, []);

  const setQuery = useCallback((value: string) => {
    setQueryState(value);
    setSelectedIndexState(0);
  }, []);

  const setSelectedIndex = useCallback((value: number) => {
    setSelectedIndexState(Math.max(0, value));
  }, []);

  const moveSelection = useCallback((direction: "up" | "down", total: number) => {
    if (total <= 0) {
      setSelectedIndexState(0);
      return;
    }

    setSelectedIndexState((previous) => {
      if (direction === "down") {
        return Math.min(total - 1, previous + 1);
      }
      return Math.max(0, previous - 1);
    });
  }, []);

  useEffect(() => {
    const onWindowKeyDown = (event: KeyboardEvent) => {
      const shortcut = event.key.toLowerCase() === "k" && (event.ctrlKey || event.metaKey);

      if (shortcut) {
        event.preventDefault();
        toggle();
        return;
      }

      if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        close();
      }
    };

    window.addEventListener("keydown", onWindowKeyDown);
    return () => window.removeEventListener("keydown", onWindowKeyDown);
  }, [close, isOpen, toggle]);

  useEffect(() => {
    const onOpenPalette = () => open();
    const onTogglePalette = () => toggle();

    window.addEventListener("command-palette:open", onOpenPalette);
    window.addEventListener("command-palette:toggle", onTogglePalette);

    return () => {
      window.removeEventListener("command-palette:open", onOpenPalette);
      window.removeEventListener("command-palette:toggle", onTogglePalette);
    };
  }, [open, toggle]);

  return {
    isOpen,
    query,
    selectedIndex,
    open,
    close,
    toggle,
    setQuery,
    setSelectedIndex,
    moveSelection,
  };
}
