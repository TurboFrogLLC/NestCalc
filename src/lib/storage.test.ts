import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_INPUTS, loadInputs, saveInputs } from "./storage";
import type { NestInputs } from "./types";

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
  });

  it("loads the current persisted input shape without changing values", () => {
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

  it("saves the current input shape under the existing storage key", () => {
    const { values } = installLocalStorage();

    saveInputs(DEFAULT_INPUTS);

    expect(values.get("nestcalc-state-v2")).toBe(JSON.stringify(DEFAULT_INPUTS));
  });
});
