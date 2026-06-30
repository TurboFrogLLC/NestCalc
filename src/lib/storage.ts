import type { NestInputs, Theme } from "./types";

const STORAGE_KEY = "nestcalc-state-v2";
const THEME_KEY = "nestcalc-theme";

export const DEFAULT_INPUTS: NestInputs = {
  partWidth: 2,
  partHeight: 1.5,
  remnantWidth: 12,
  remnantHeight: 8,
  gapX: 0.125,
  gapY: 0.125,
  margins: { left: 0.5, right: 0.25, top: 0.25, bottom: 0.25 },
  moveMarginsWithRotation: false,
  unit: "in",
};

export const EMPTY_INPUTS: NestInputs = {
  partWidth: null,
  partHeight: null,
  remnantWidth: null,
  remnantHeight: null,
  gapX: null,
  gapY: null,
  margins: { left: null, right: null, top: null, bottom: null },
  moveMarginsWithRotation: false,
  unit: "in",
};

function migrateLegacyGap(parsed: Record<string, unknown>): {
  gapX: number | null;
  gapY: number | null;
} {
  if ("gapX" in parsed || "gapY" in parsed) {
    return {
      gapX: (parsed.gapX as number | null | undefined) ?? null,
      gapY: (parsed.gapY as number | null | undefined) ?? null,
    };
  }
  const legacyGap = parsed.gap as number | undefined;
  return {
    gapX: legacyGap ?? null,
    gapY: legacyGap ?? null,
  };
}

export function loadInputs(): NestInputs {
  if (typeof window === "undefined") return DEFAULT_INPUTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_INPUTS;
    const parsed = JSON.parse(raw) as Partial<NestInputs> & { gap?: number };
    const { gapX, gapY } = migrateLegacyGap(parsed as Record<string, unknown>);
    return {
      ...DEFAULT_INPUTS,
      ...parsed,
      gapX,
      gapY,
      margins: { ...DEFAULT_INPUTS.margins, ...parsed.margins },
      moveMarginsWithRotation: parsed.moveMarginsWithRotation ?? false,
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

export function loadTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function saveTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Ignore quota / private mode errors.
  }
}