import { afterEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_AUTONEST_SETTINGS,
  DEFAULT_INPUTS,
  DEFAULT_NEST_APP_STATE,
  loadInputs,
  loadNestAppState,
  saveInputs,
  saveNestAppState,
} from "./storage";
import type { NestAppState, NestInputs } from "./types";

function installLocalStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  const localStorage = {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      values.delete(key);
    }),
    clear: vi.fn(() => {
      values.clear();
    }),
  };

  vi.stubGlobal("window", { localStorage });
  vi.stubGlobal("localStorage", localStorage);

  return { localStorage, values };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("storage compatibility", () => {
  it("returns default inputs when no persisted state exists", () => {
    installLocalStorage();

    expect(loadInputs()).toEqual(DEFAULT_INPUTS);
    expect(loadNestAppState()).toEqual(DEFAULT_NEST_APP_STATE);
  });

  it("loads the old flat persisted input shape without changing values", () => {
    const persisted: NestInputs = {
      ...DEFAULT_INPUTS,
      partWidth: 7,
      partHeight: null,
      remnantWidth: 30,
      remnantHeight: 18,
      margins: { left: 0.125, right: null, top: 0.5, bottom: 0.25 },
      gapX: 0.062,
      gapY: null,
      partLinked: true,
      gapLinked: false,
      moveMarginsWithRotation: true,
      unit: "mm",
    };
    installLocalStorage({
      "nestcalc-state-v2": JSON.stringify(persisted),
    });

    expect(loadInputs()).toEqual(persisted);
    expect(loadNestAppState()).toEqual({
      version: 3,
      mode: "manual",
      manualInputs: persisted,
      autoNestSettings: {
        ...DEFAULT_AUTONEST_SETTINGS,
        globalClampMargin: 13.462,
        sharedTrimClearance: 13.462,
      },
    });
  });

  it("migrates legacy rotated remnant and gap fields", () => {
    installLocalStorage({
      "nestcalc-state-v2": JSON.stringify({
        partWidth: 2,
        partHeight: 1,
        remnantWidth: 10,
        remnantHeight: 20,
        margins: { left: 0.5 },
        gapX: 0.125,
        gapY: 0.25,
        remRotation: 90,
      }),
    });

    expect(loadInputs()).toMatchObject({
      partWidth: 2,
      partHeight: 1,
      remnantWidth: 20,
      remnantHeight: 10,
      margins: {
        ...DEFAULT_INPUTS.margins,
        left: 0.5,
      },
      gapX: 0.25,
      gapY: 0.125,
      partLinked: false,
      gapLinked: false,
      moveMarginsWithRotation: false,
    });
  });

  it("migrates legacy single gap fields into both current gap axes", () => {
    installLocalStorage({
      "nestcalc-state-v1": JSON.stringify({
        partWidth: 2,
        partHeight: 1,
        gap: 0.375,
      }),
    });

    expect(loadInputs()).toMatchObject({
      partWidth: 2,
      partHeight: 1,
      gapX: 0.375,
      gapY: 0.375,
    });
  });

  it("loads and saves the wrapped mode-aware app state", () => {
    const persisted: NestAppState = {
      version: 3,
      mode: "autonest",
      manualInputs: {
        ...DEFAULT_INPUTS,
        partWidth: 4,
        unit: "mm",
      },
      autoNestSettings: {
        globalClampMargin: 12.7,
        trimEdgePolicy: "shared",
        sharedTrimClearance: 1.27,
        overrideGlobalMargins: true,
        marginOverrides: { left: 1, right: 2, top: 3, bottom: 4 },
      },
    };
    const { values } = installLocalStorage({
      "nestcalc-app-state-v3": JSON.stringify(persisted),
    });

    expect(loadNestAppState()).toEqual(persisted);
    expect(loadInputs()).toEqual(persisted.manualInputs);

    saveNestAppState({ ...persisted, mode: "manual" });
    expect(JSON.parse(values.get("nestcalc-app-state-v3") ?? "")).toEqual({
      ...persisted,
      mode: "manual",
    });
  });

  it("defaults missing AutoNest settings inside wrapped state", () => {
    installLocalStorage({
      "nestcalc-app-state-v3": JSON.stringify({
        version: 3,
        mode: "autonest",
        manualInputs: { partWidth: 9 },
      }),
    });

    expect(loadNestAppState()).toEqual({
      version: 3,
      mode: "autonest",
      manualInputs: { ...DEFAULT_INPUTS, partWidth: 9 },
      autoNestSettings: DEFAULT_AUTONEST_SETTINGS,
    });
  });

  it("lazily migrates missing trim policy and clearance without rewriting storage", () => {
    const { localStorage } = installLocalStorage({
      "nestcalc-app-state-v3": JSON.stringify({
        version: 3,
        mode: "autonest",
        manualInputs: { ...DEFAULT_INPUTS, unit: "mm" },
        autoNestSettings: { globalClampMargin: 12.7 },
      }),
    });

    expect(loadNestAppState().autoNestSettings).toMatchObject({
      globalClampMargin: 12.7,
      trimEdgePolicy: "open",
      sharedTrimClearance: 12.7,
    });
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it.each(["full", "open", "shared"] as const)(
    "preserves explicit %s trim policy settings",
    (trimEdgePolicy) => {
      installLocalStorage({
        "nestcalc-app-state-v3": JSON.stringify({
          version: 3,
          manualInputs: DEFAULT_INPUTS,
          autoNestSettings: {
            globalClampMargin: 0.53,
            trimEdgePolicy,
            sharedTrimClearance: 0.03,
          },
        }),
      });

      expect(loadNestAppState().autoNestSettings).toMatchObject({
        trimEdgePolicy,
        sharedTrimClearance: 0.03,
      });
    },
  );

  it("normalizes an invalid runtime policy to open", () => {
    installLocalStorage({
      "nestcalc-app-state-v3": JSON.stringify({
        version: 3,
        manualInputs: DEFAULT_INPUTS,
        autoNestSettings: {
          globalClampMargin: 0.53,
          trimEdgePolicy: "diagonal",
          sharedTrimClearance: null,
        },
      }),
    });

    expect(loadNestAppState().autoNestSettings).toMatchObject({
      trimEdgePolicy: "open",
      sharedTrimClearance: null,
    });
  });

  it("saves manual inputs under the wrapped storage key while preserving mode and settings", () => {
    const { values } = installLocalStorage();
    const inputs = { ...DEFAULT_INPUTS, partWidth: 8 };

    saveInputs(inputs);

    expect(values.has("nestcalc-state-v2")).toBe(false);
    expect(JSON.parse(values.get("nestcalc-app-state-v3") ?? "")).toEqual({
      ...DEFAULT_NEST_APP_STATE,
      manualInputs: inputs,
    });
  });

  it("preserves wrapped mode and settings when saving through the manual input adapter", () => {
    const persisted: NestAppState = {
      version: 3,
      mode: "autonest",
      manualInputs: DEFAULT_INPUTS,
      autoNestSettings: {
        globalClampMargin: 1,
        trimEdgePolicy: "full",
        sharedTrimClearance: 0.25,
        overrideGlobalMargins: true,
        marginOverrides: { left: 0.1, right: null, top: 0.2, bottom: null },
      },
    };
    const { values } = installLocalStorage({
      "nestcalc-app-state-v3": JSON.stringify(persisted),
    });
    const inputs = { ...DEFAULT_INPUTS, remnantWidth: 44 };

    saveInputs(inputs);

    expect(JSON.parse(values.get("nestcalc-app-state-v3") ?? "")).toEqual({
      ...persisted,
      manualInputs: inputs,
    });
  });
});
