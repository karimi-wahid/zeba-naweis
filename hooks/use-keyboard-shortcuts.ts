"use client";

import { useEffect } from "react";

interface KeyboardShortcuts {
  onGenerate?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onCopyAll?: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter: Generate
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        shortcuts.onGenerate?.();
      }

      // Ctrl/Cmd + Z: Undo
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        shortcuts.onUndo?.();
      }

      // Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z: Redo
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        shortcuts.onRedo?.();
      }

      // Ctrl/Cmd + Shift + C: Copy All
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "c") {
        e.preventDefault();
        shortcuts.onCopyAll?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}
