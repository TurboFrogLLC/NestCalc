"use client";

import {
  useCallback,
  useEffect,
  useSyncExternalStore,
} from "react";
import {
  DEFAULT_NEST_APP_STATE,
  loadNestAppState,
  normalizeNestAppState,
  saveNestAppState,
} from "@/lib/storage";
import type { NestAppState, NestInputs } from "@/lib/types";

const STORAGE_EVENT = "nestcalc-storage";

let snapshot: NestAppState = DEFAULT_NEST_APP_STATE;
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
  return DEFAULT_NEST_APP_STATE;
}

let hydrated = false;

export function useNestAppState() {
  useEffect(() => {
    if (hydrated) return;
    hydrated = true;
    snapshot = loadNestAppState();
    emit();
  }, []);

  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setState = useCallback(
    (updater: NestAppState | ((current: NestAppState) => NestAppState)) => {
      const next =
        typeof updater === "function" ? updater(snapshot) : updater;
      snapshot = normalizeNestAppState(next);
      saveNestAppState(snapshot);
      emit();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(STORAGE_EVENT));
      }
    },
    [],
  );

  return { state, setState };
}

export function useNestInputs() {
  const { state, setState } = useNestAppState();

  const setInputs = useCallback(
    (updater: NestInputs | ((current: NestInputs) => NestInputs)) => {
      setState((current) => ({
        ...current,
        manualInputs:
          typeof updater === "function"
            ? updater(current.manualInputs)
            : updater,
      }));
    },
    [setState],
  );

  const inputs = state.manualInputs;

  return { inputs, setInputs };
}
