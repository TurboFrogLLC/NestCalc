"use client";

import {
  useCallback,
  useEffect,
  useSyncExternalStore,
} from "react";
import { DEFAULT_INPUTS, loadInputs, saveInputs } from "@/lib/storage";
import type { NestInputs } from "@/lib/types";

const STORAGE_EVENT = "nestcalc-storage";

let snapshot: NestInputs = DEFAULT_INPUTS;
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

function getServerSnapshot() {
  return DEFAULT_INPUTS;
}

let hydrated = false;

export function useNestInputs() {
  useEffect(() => {
    if (hydrated) return;
    hydrated = true;
    snapshot = loadInputs();
    emit();
  }, []);

  const inputs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setInputs = useCallback(
    (updater: NestInputs | ((current: NestInputs) => NestInputs)) => {
      snapshot =
        typeof updater === "function" ? updater(snapshot) : updater;
      saveInputs(snapshot);
      emit();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(STORAGE_EVENT));
      }
    },
    [],
  );

  return { inputs, setInputs };
}