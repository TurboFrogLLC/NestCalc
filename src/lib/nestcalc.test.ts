import { describe, expect, it } from "vitest";
import {
  calculateNest,
  clearedInputs,
  partsInDimension,
  rotateMarginsCW,
} from "./nestcalc";
import type { NestInputs } from "./types";

const baseInputs: NestInputs = {
  partWidth: 10,
  partHeight: 5,
  remnantWidth: 45,
  remnantHeight: 22,
  margins: { left: 1, right: 2, top: 3, bottom: 4 },
  gapX: 1,
  gapY: 0.5,
  partLinked: false,
  gapLinked: false,
  moveMarginsWithRotation: false,
  unit: "in",
};

describe("calculateNest", () => {
  it("counts rectangular parts inside usable remnant area", () => {
    expect(calculateNest(baseInputs)).toEqual({
      usableWidth: 42,
      usableHeight: 15,
      partsAcross: 3,
      partsDown: 2,
      totalParts: 6,
    });
  });

  it("treats missing dimensions as zero without producing negative counts", () => {
    expect(
      calculateNest({
        ...baseInputs,
        partWidth: null,
        partHeight: null,
        remnantWidth: null,
        remnantHeight: null,
      }),
    ).toMatchObject({
      partsAcross: 0,
      partsDown: 0,
      totalParts: 0,
    });
  });
});

describe("partsInDimension", () => {
  it("fits parts exactly when the final part lands on the usable edge", () => {
    expect(partsInDimension(32, 10, 1)).toBe(3);
  });

  it("returns zero when the part or usable span cannot fit", () => {
    expect(partsInDimension(9, 10, 1)).toBe(0);
    expect(partsInDimension(10, 0, 1)).toBe(0);
  });
});

describe("rotateMarginsCW", () => {
  it("rotates remnant margin assignments clockwise", () => {
    expect(rotateMarginsCW(baseInputs.margins)).toEqual({
      left: 4,
      top: 1,
      right: 3,
      bottom: 2,
    });
  });
});

describe("clearedInputs", () => {
  it("resets user-entered dimensions while preserving the active unit", () => {
    expect(clearedInputs("mm")).toEqual({
      partWidth: null,
      partHeight: null,
      remnantWidth: null,
      remnantHeight: null,
      margins: { left: null, right: null, top: null, bottom: null },
      gapX: null,
      gapY: null,
      partLinked: false,
      gapLinked: false,
      moveMarginsWithRotation: false,
      unit: "mm",
    });
  });
});
