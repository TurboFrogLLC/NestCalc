"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { loadTheme, saveTheme } from "@/lib/storage";
import type { ThemeMode } from "@/lib/types";

const THEME_EVENT = "nestcalc-theme";

let snapshot: ThemeMode = "dark";
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot(): ThemeMode {
  return "dark";
}

let hydrated = false;

function applyTheme(theme: ThemeMode) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", theme === "light" ? "#f4f4f5" : "#09090b");
  }
}

export function useTheme() {
  useEffect(() => {
    if (hydrated) return;
    hydrated = true;
    snapshot = loadTheme();
    applyTheme(snapshot);
    emit();
  }, []);

  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((next: ThemeMode) => {
    snapshot = next;
    saveTheme(next);
    applyTheme(next);
    emit();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(THEME_EVENT));
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  return { theme, setTheme, toggleTheme };
}