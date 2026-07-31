import type {
  AutoNestSettings,
  AutoNestTrimEdgePolicy,
  Margins,
  NestAppState,
  NestInputs,
  NestMode,
  ThemeMode,
} from "./types";

const STORAGE_KEY = "nestcalc-app-state-v3";
const LEGACY_INPUTS_KEY = "nestcalc-state-v2";
const THEME_KEY = "nestcalc-theme";

export const DEFAULT_INPUTS: NestInputs = {
  partWidth: 2,
  partHeight: 1.5,
  remnantWidth: 12,
  remnantHeight: 8,
  margins: { left: 0.5, right: 0.25, top: 0.25, bottom: 0.25 },
  gapX: 0.125,
  gapY: 0.125,
  partLinked: false,
  gapLinked: false,
  moveMarginsWithRotation: false,
  unit: "in",
};

export const DEFAULT_AUTONEST_SETTINGS: AutoNestSettings = {
  globalClampMargin: 0.53,
  trimEdgePolicy: "open",
  sharedTrimClearance: 0.53,
  overrideGlobalMargins: false,
  marginOverrides: { left: null, right: null, top: null, bottom: null },
};

export const DEFAULT_NEST_APP_STATE: NestAppState = {
  version: 3,
  mode: "manual",
  manualInputs: DEFAULT_INPUTS,
  autoNestSettings: DEFAULT_AUTONEST_SETTINGS,
};

type LegacyNestInputs = Partial<NestInputs> & {
  gap?: number;
  remRotation?: number;
};

type StoredAutoNestSettings = Partial<AutoNestSettings> & {
  marginOverrides?: Partial<Margins>;
};

type StoredNestAppState = Partial<
  Omit<NestAppState, "autoNestSettings" | "manualInputs">
> & {
  manualInputs?: LegacyNestInputs;
  autoNestSettings?: StoredAutoNestSettings;
};

function migrateLegacy(parsed: LegacyNestInputs): Partial<NestInputs> {
  const next: Partial<NestInputs> = { ...parsed };

  if (next.gapX == null && parsed.gap != null) {
    next.gapX = parsed.gap;
    next.gapY = parsed.gap;
  }

  const rotation = parsed.remRotation ?? 0;
  if (rotation === 90 || rotation === 270) {
    const remnantWidth = next.remnantWidth;
    const remnantHeight = next.remnantHeight;
    next.remnantWidth = remnantHeight;
    next.remnantHeight = remnantWidth;

    const gapX = next.gapX;
    const gapY = next.gapY;
    next.gapX = gapY;
    next.gapY = gapX;
  }

  delete (next as LegacyNestInputs).remRotation;
  delete (next as LegacyNestInputs).gap;

  if (next.moveMarginsWithRotation == null) {
    next.moveMarginsWithRotation = false;
  }

  if (next.partLinked == null) {
    next.partLinked = false;
  }

  if (next.gapLinked == null) {
    next.gapLinked = false;
  }

  return next;
}

function normalizeManualInputs(inputs: LegacyNestInputs = {}): NestInputs {
  const parsed = migrateLegacy(inputs);

  return {
    ...DEFAULT_INPUTS,
    ...parsed,
    margins: { ...DEFAULT_INPUTS.margins, ...parsed.margins },
    moveMarginsWithRotation: parsed.moveMarginsWithRotation ?? false,
  };
}

function normalizeAutoNestSettings(
  settings: StoredAutoNestSettings = {},
  unit: NestInputs["unit"] = "in",
): AutoNestSettings {
  const unitDefault = unit === "mm" ? 13.462 : 0.53;
  const globalClampMargin =
    settings.globalClampMargin === undefined
      ? unitDefault
      : settings.globalClampMargin;
  const trimEdgePolicy: AutoNestTrimEdgePolicy =
    settings.trimEdgePolicy === "full" ||
    settings.trimEdgePolicy === "shared"
      ? settings.trimEdgePolicy
      : "open";

  return {
    ...DEFAULT_AUTONEST_SETTINGS,
    ...settings,
    globalClampMargin,
    trimEdgePolicy,
    sharedTrimClearance:
      settings.sharedTrimClearance === undefined
        ? globalClampMargin
        : settings.sharedTrimClearance,
    marginOverrides: {
      ...DEFAULT_AUTONEST_SETTINGS.marginOverrides,
      ...settings.marginOverrides,
    },
  };
}

function normalizeMode(mode: NestMode | undefined): NestMode {
  return mode === "autonest" ? "autonest" : "manual";
}

function normalizeStoredAppState(state: StoredNestAppState = {}): NestAppState {
  const manualInputs = normalizeManualInputs(state.manualInputs);

  return {
    version: 3,
    mode: normalizeMode(state.mode),
    manualInputs,
    autoNestSettings: normalizeAutoNestSettings(
      state.autoNestSettings,
      manualInputs.unit,
    ),
  };
}

function isNullableFiniteNumber(value: unknown): value is number | null {
  return value === null || (typeof value === "number" && Number.isFinite(value));
}

function cloneValidatedNestAppState(state: NestAppState): NestAppState {
  const { manualInputs, autoNestSettings } = state;
  const numericValues = [
    manualInputs.partWidth,
    manualInputs.partHeight,
    manualInputs.remnantWidth,
    manualInputs.remnantHeight,
    manualInputs.gapX,
    manualInputs.gapY,
    manualInputs.margins.left,
    manualInputs.margins.right,
    manualInputs.margins.top,
    manualInputs.margins.bottom,
    autoNestSettings.globalClampMargin,
    autoNestSettings.sharedTrimClearance,
    autoNestSettings.marginOverrides.left,
    autoNestSettings.marginOverrides.right,
    autoNestSettings.marginOverrides.top,
    autoNestSettings.marginOverrides.bottom,
  ];
  const booleanValues = [
    manualInputs.partLinked,
    manualInputs.gapLinked,
    manualInputs.moveMarginsWithRotation,
    autoNestSettings.overrideGlobalMargins,
  ];

  if (
    numericValues.some((value) => !isNullableFiniteNumber(value)) ||
    booleanValues.some((value) => typeof value !== "boolean") ||
    (manualInputs.unit !== "in" && manualInputs.unit !== "mm")
  ) {
    throw new TypeError("NestCalc snapshot must be a valid version 3 state");
  }

  return {
    version: 3,
    mode: state.mode,
    manualInputs: {
      partWidth: manualInputs.partWidth,
      partHeight: manualInputs.partHeight,
      remnantWidth: manualInputs.remnantWidth,
      remnantHeight: manualInputs.remnantHeight,
      margins: {
        left: manualInputs.margins.left,
        right: manualInputs.margins.right,
        top: manualInputs.margins.top,
        bottom: manualInputs.margins.bottom,
      },
      gapX: manualInputs.gapX,
      gapY: manualInputs.gapY,
      partLinked: manualInputs.partLinked,
      gapLinked: manualInputs.gapLinked,
      moveMarginsWithRotation: manualInputs.moveMarginsWithRotation,
      unit: manualInputs.unit,
    },
    autoNestSettings: {
      globalClampMargin: autoNestSettings.globalClampMargin,
      trimEdgePolicy: autoNestSettings.trimEdgePolicy,
      sharedTrimClearance: autoNestSettings.sharedTrimClearance,
      overrideGlobalMargins: autoNestSettings.overrideGlobalMargins,
      marginOverrides: {
        left: autoNestSettings.marginOverrides.left,
        right: autoNestSettings.marginOverrides.right,
        top: autoNestSettings.marginOverrides.top,
        bottom: autoNestSettings.marginOverrides.bottom,
      },
    },
  };
}

/**
 * Validate the persisted-state version boundary and return a detached,
 * normalized version-3 snapshot. Presets use this entry point both before
 * writing and after reading so malformed or stale record versions never enter
 * live calculator state.
 */
export function normalizeNestAppState(value: unknown): NestAppState {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    (value as { version?: unknown }).version !== 3
  ) {
    throw new TypeError("NestCalc snapshot must use version 3");
  }

  return cloneValidatedNestAppState(
    normalizeStoredAppState(value as StoredNestAppState),
  );
}

function loadLegacyManualState(): NestAppState {
  const raw =
    localStorage.getItem(LEGACY_INPUTS_KEY) ??
    localStorage.getItem("nestcalc-state-v1");

  if (!raw) return DEFAULT_NEST_APP_STATE;

  return normalizeStoredAppState({
    mode: "manual",
    manualInputs: JSON.parse(raw) as LegacyNestInputs,
  });
}

export function loadNestAppState(): NestAppState {
  if (typeof window === "undefined") return DEFAULT_NEST_APP_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return loadLegacyManualState();

    return normalizeStoredAppState(JSON.parse(raw) as StoredNestAppState);
  } catch {
    return DEFAULT_NEST_APP_STATE;
  }
}

export function saveNestAppState(state: NestAppState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota / private mode errors.
  }
}

export function loadInputs(): NestInputs {
  return loadNestAppState().manualInputs;
}

export function saveInputs(inputs: NestInputs): void {
  if (typeof window === "undefined") return;
  try {
    const current = loadNestAppState();
    saveNestAppState({ ...current, manualInputs: inputs });
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
