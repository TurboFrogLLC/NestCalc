import { describe, expect, it } from "vitest";
import {
  calculateAutoNest,
  calculateBestUniformNest,
} from "./autoNestEngine";
import type { AutoNestSettings, NestInputs } from "./types";

const zeroMarginSettings: AutoNestSettings = {
  globalClampMargin: 0,
  overrideGlobalMargins: false,
  marginOverrides: { left: null, right: null, top: null, bottom: null },
};

const baseInputs: NestInputs = {
  partWidth: 6,
  partHeight: 4,
  remnantWidth: 10,
  remnantHeight: 10,
  margins: { left: 99, right: 99, top: 99, bottom: 99 },
  gapX: 0,
  gapY: 0,
  partLinked: false,
  gapLinked: false,
  moveMarginsWithRotation: false,
  unit: "in",
};

describe("calculateBestUniformNest", () => {
  it("compares 0-degree and 90-degree uniform layouts with AutoNest margins", () => {
    expect(calculateBestUniformNest(baseInputs, zeroMarginSettings)).toEqual({
      usableWidth: 10,
      usableHeight: 10,
      partsAcross: 1,
      partsDown: 2,
      totalParts: 2,
    });
  });
});

describe("calculateAutoNest", () => {
  it("computes a two-group mixed-orientation result when it beats uniform", () => {
    const result = calculateAutoNest(baseInputs, zeroMarginSettings);

    expect(result.status).toBe("computed");
    if (result.status !== "computed") return;

    expect(result.bestUniform.totalParts).toBe(2);
    expect(result.twoGroup.totalParts).toBe(3);
    expect(result.twoGroup.trimLine.orientation).toBe("vertical");
    expect(result.twoGroup.suggestedOriginOffset).toEqual({
      x: result.twoGroup.trimLine.position,
      y: 0,
    });
    expect(
      result.twoGroup.blanks.map((blank) => blank.group.orientation).sort(),
    ).toEqual(["0deg", "90deg"]);
    expect(
      result.twoGroup.blanks.reduce(
        (total, blank) => total + blank.group.count,
        0,
      ),
    ).toBe(3);
    expect(
      result.twoGroup.blanks.find((blank) => blank.group.orientation === "0deg")
        ?.group.boundingBox,
    ).toEqual({ width: 6, height: 8 });
    expect(
      result.twoGroup.blanks.find((blank) => blank.group.orientation === "90deg")
        ?.group.boundingBox,
    ).toEqual({ width: 4, height: 6 });
  });

  it("uses AutoNest clamp margins as full clearance around both trim blanks", () => {
    const settings: AutoNestSettings = {
      globalClampMargin: 0,
      overrideGlobalMargins: true,
      marginOverrides: { left: 0.5, right: 0.5, top: 0.5, bottom: 0.5 },
    };
    const result = calculateAutoNest(
      { ...baseInputs, remnantWidth: 12, remnantHeight: 11 },
      settings,
    );

    expect(result.status).toBe("computed");
    if (result.status !== "computed") return;

    expect(result.twoGroup.trimLine).toEqual({
      orientation: "vertical",
      position: 5,
    });
    expect(result.twoGroup.blanks).toEqual([
      {
        width: 5,
        height: 11,
        achievedMargins: { left: 0.5, right: 0.5, top: 0.5, bottom: 4.5 },
        group: {
          orientation: "90deg",
          count: 1,
          boundingBox: { width: 4, height: 6 },
        },
      },
      {
        width: 7,
        height: 11,
        achievedMargins: { left: 0.5, right: 0.5, top: 0.5, bottom: 2.5 },
        group: {
          orientation: "0deg",
          count: 2,
          boundingBox: { width: 6, height: 8 },
        },
      },
    ]);
  });

  it("falls back when mixed two-group packing does not improve the uniform result", () => {
    const result = calculateAutoNest(
      {
        ...baseInputs,
        partWidth: 2,
        partHeight: 1.5,
        remnantWidth: 12,
        remnantHeight: 8,
        gapX: 0.125,
        gapY: 0.125,
      },
      {
        ...zeroMarginSettings,
        globalClampMargin: 0.53,
      },
    );

    expect(result).toMatchObject({
      status: "fallback",
      reason: "two-group-not-useful",
      bestUniform: {
        totalParts: 20,
      },
      fallback: {
        totalParts: 20,
      },
    });
  });

  it("falls back for insufficient part or remnant inputs", () => {
    const result = calculateAutoNest(
      { ...baseInputs, partWidth: null },
      zeroMarginSettings,
    );

    expect(result).toMatchObject({
      status: "fallback",
      reason: "insufficient-inputs",
      bestUniform: {
        totalParts: 0,
      },
      fallback: {
        totalParts: 0,
      },
    });
  });

  it("falls back for negative gaps or margins instead of returning invalid geometry", () => {
    expect(
      calculateAutoNest({ ...baseInputs, gapX: -0.125 }, zeroMarginSettings),
    ).toMatchObject({
      status: "fallback",
      reason: "insufficient-inputs",
    });

    expect(
      calculateAutoNest(baseInputs, {
        ...zeroMarginSettings,
        globalClampMargin: -1,
      }),
    ).toMatchObject({
      status: "fallback",
      reason: "insufficient-inputs",
    });
  });
});
