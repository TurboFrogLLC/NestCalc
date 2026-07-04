import { describe, expect, it } from "vitest";
import { calculateNest, clearedInputs } from "./nestcalc";
import {
  calculateManualNest,
  clearManualInputs,
  createManualNestSession,
  rotateManualPart,
  rotateManualRemnant,
  swapManualGap,
  swapManualPart,
  toggleManualGapLink,
  toggleManualPartLink,
  toggleManualUnit,
  updateManualField,
  updateManualMargin,
} from "./nestSession";
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

describe("manual nest session", () => {
  it("calculates manual results through the session boundary", () => {
    expect(createManualNestSession(baseInputs)).toEqual({
      inputs: baseInputs,
      result: calculateNest(baseInputs),
    });
    expect(calculateManualNest(baseInputs)).toEqual(calculateNest(baseInputs));
  });

  it("updates fields and linked part or gap pairs with current UI semantics", () => {
    expect(updateManualField(baseInputs, "partWidth", 12)).toMatchObject({
      partWidth: 12,
      partHeight: 5,
    });

    expect(
      updateManualField({ ...baseInputs, partLinked: true }, "partHeight", 7),
    ).toMatchObject({
      partWidth: 7,
      partHeight: 7,
    });

    expect(
      updateManualField({ ...baseInputs, gapLinked: true }, "gapX", 0.25),
    ).toMatchObject({
      gapX: 0.25,
      gapY: 0.25,
    });
  });

  it("updates one margin side without changing the other margins", () => {
    expect(updateManualMargin(baseInputs, "right", 0.75).margins).toEqual({
      left: 1,
      right: 0.75,
      top: 3,
      bottom: 4,
    });
  });

  it("rotates the part dimensions only", () => {
    expect(rotateManualPart(baseInputs)).toMatchObject({
      partWidth: 5,
      partHeight: 10,
      remnantWidth: 45,
      remnantHeight: 22,
      gapX: 1,
      gapY: 0.5,
      margins: baseInputs.margins,
    });
  });

  it("rotates the remnant and gaps while keeping margins fixed by default", () => {
    expect(rotateManualRemnant(baseInputs)).toMatchObject({
      partWidth: 10,
      partHeight: 5,
      remnantWidth: 22,
      remnantHeight: 45,
      gapX: 0.5,
      gapY: 1,
      margins: baseInputs.margins,
    });
  });

  it("rotates margins with the remnant only when enabled", () => {
    expect(
      rotateManualRemnant({
        ...baseInputs,
        moveMarginsWithRotation: true,
      }).margins,
    ).toEqual({
      left: 4,
      top: 1,
      right: 3,
      bottom: 2,
    });
  });

  it("links and unlinks part values with current copy rules", () => {
    expect(
      toggleManualPartLink({
        ...baseInputs,
        partWidth: null,
        partHeight: 8,
      }),
    ).toMatchObject({
      partWidth: 8,
      partHeight: 8,
      partLinked: true,
    });

    expect(
      toggleManualPartLink({ ...baseInputs, partLinked: true }),
    ).toMatchObject({
      partWidth: 10,
      partHeight: 5,
      partLinked: false,
    });
  });

  it("links and unlinks gap values with current copy rules", () => {
    expect(
      toggleManualGapLink({
        ...baseInputs,
        gapX: 0.25,
        gapY: null,
      }),
    ).toMatchObject({
      gapX: 0.25,
      gapY: 0.25,
      gapLinked: true,
    });

    expect(toggleManualGapLink({ ...baseInputs, gapLinked: true })).toMatchObject({
      gapX: 1,
      gapY: 0.5,
      gapLinked: false,
    });
  });

  it("swaps part and gap pairs independently", () => {
    expect(swapManualPart(baseInputs)).toMatchObject({
      partWidth: 5,
      partHeight: 10,
      gapX: 1,
      gapY: 0.5,
    });

    expect(swapManualGap(baseInputs)).toMatchObject({
      partWidth: 10,
      partHeight: 5,
      gapX: 0.5,
      gapY: 1,
    });
  });

  it("converts all numeric inputs when toggling units", () => {
    expect(toggleManualUnit(baseInputs)).toMatchObject({
      unit: "mm",
      partWidth: 254,
      partHeight: 127,
      remnantWidth: 1143,
      remnantHeight: 558.8,
      gapX: 25.4,
      gapY: 12.7,
      margins: {
        left: 25.4,
        right: 50.8,
        top: 76.2,
        bottom: 101.6,
      },
    });
  });

  it("clears inputs to the current clear state while preserving unit", () => {
    expect(clearManualInputs({ ...baseInputs, unit: "mm" })).toEqual(
      clearedInputs("mm"),
    );
  });
});
