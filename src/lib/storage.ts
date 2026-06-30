import type { NestInputs } from "./types";

const STORAGE_KEY = "nestcalc-state-v1";

export const DEFAULT_INPUTS: NestInputs = {
  partWidth: 2,
  partHeight: 1.5,
  remnantWidth: 12,
  remnantHeight: 8,
  margins: { left: 0.5, right: 0.25, top: 0.25, bottom: 0.25 },
  gap: 0.125,
  unit: "in",
};

export function loadInputs(): NestInputs {
  if (typeof window === "undefined") return DEFAULT_INPUTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_INPUTS;
    const parsed = JSON.parse(raw) as Partial<NestInputs>;
    return {
      ...DEFAULT_INPUTS,
      ...parsed,
      margins: { ...DEFAULT_INPUTS.margins, ...parsed.margins },
    };
  } catch {
    return DEFAULT_INPUTS;
  }
}

export function saveInputs(inputs: NestInputs): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
  } catch {
    // Ignore quota / private mode errors.
  }
}