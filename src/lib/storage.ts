import type { NestInputs, ThemeMode } from "./types";

const STORAGE_KEY = "nestcalc-state-v2";
const THEME_KEY = "nestcalc-theme";

export const DEFAULT_INPUTS: NestInputs = {
  partWidth: 2,
  partHeight: 1.5,
  remnantWidth: 12,
  remnantHeight: 8,
  margins: { left: 0.5, right: 0.25, top: 0.25, bottom: 0.25 },
  gapX: 0.125,
  gapY: 0.125,
  remRotation: 0,
  unit: "in",
};

type LegacyNestInputs = NestInputs & { gap?: number };

function migrateLegacy(parsed: Partial<LegacyNestInputs>): Partial<NestInputs> {
  const next: Partial<NestInputs> = { ...parsed };
  if (next.gapX == null && parsed.gap != null) {
    next.gapX = parsed.gap;
    next.gapY = parsed.gap;
  }
  if (next.remRotation == null) {
    next.remRotation = 0;
  }
  return next;
}

export function loadInputs(): NestInputs {
  if (typeof window === "undefined") return DEFAULT_INPUTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const legacy = localStorage.getItem("nestcalc-state-v1");
      if (!legacy) return DEFAULT_INPUTS;
      const parsed = migrateLegacy(JSON.parse(legacy) as Partial<LegacyNestInputs>);
      return {
        ...DEFAULT_INPUTS,
        ...parsed,
        margins: { ...DEFAULT_INPUTS.margins, ...parsed.margins },
      };
    }
    const parsed = migrateLegacy(JSON.parse(raw) as Partial<LegacyNestInputs>);
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

export function loadTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function saveTheme(theme: ThemeMode): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Ignore quota / private mode errors.
  }
}