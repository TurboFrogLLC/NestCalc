import { describe, expect, it } from "vitest";
import {
  derivePresetCarousel,
  displayGCodeSize,
  fieldBindingForId,
  formatMarginBadge,
  formatShellNumber,
  generationIsFresh,
  insertShellDecimal,
  nextPresetIndex,
  normalizeQuickValue,
  shouldPreserveNumericDraft,
} from "./bridge";

describe("HowMany shell bridge helpers", () => {
  it("maps canonical shell fields to the existing session model", () => {
    expect(fieldBindingForId("part-x")).toEqual({
      kind: "input",
      key: "partWidth",
    });
    expect(fieldBindingForId("m-top")).toEqual({
      kind: "margin",
      key: "top",
    });
    expect(fieldBindingForId("not-a-field")).toBeNull();
  });

  it("formats persisted values without adding fake precision", () => {
    expect(formatShellNumber(null)).toBe("");
    expect(formatShellNumber(12)).toBe("12");
    expect(formatShellNumber(1.23456)).toBe("1.235");
  });

  it("formats the collapsed margin badge in the shell's fixed order", () => {
    expect(
      formatMarginBadge({ left: 1.25, right: 2, bottom: 3.5, top: 4 }),
    ).toBe("L1.25 R2 B3.5 T4");
  });

  it("accepts only nonnegative quick values with at most three decimals", () => {
    expect(normalizeQuickValue(" .060 ")).toBe("0.060");
    expect(normalizeQuickValue("12.")).toBe("12");
    expect(normalizeQuickValue("12.345")).toBe("12.345");
    expect(normalizeQuickValue("12.3456")).toBeNull();
    expect(normalizeQuickValue("-1")).toBeNull();
    expect(normalizeQuickValue("abc")).toBeNull();
    expect(normalizeQuickValue(".")).toBeNull();
  });

  it("preserves focused decimal drafts that still represent current state", () => {
    expect(shouldPreserveNumericDraft(".", null)).toBe(true);
    expect(shouldPreserveNumericDraft("0.", 0)).toBe(true);
    expect(shouldPreserveNumericDraft(".5", 0.5)).toBe(true);
    expect(shouldPreserveNumericDraft("1.", 1)).toBe(true);
    expect(shouldPreserveNumericDraft("1.25", 1.25)).toBe(true);
    expect(shouldPreserveNumericDraft("1.25", 2)).toBe(false);
  });

  it("matches the shell keypad's decimal insertion rules", () => {
    expect(insertShellDecimal("12", 2, 2, true)).toEqual({
      value: "0.",
      caret: 2,
    });
    expect(insertShellDecimal("12", 1, 2, false)).toEqual({
      value: "1.",
      caret: 2,
    });
    expect(insertShellDecimal("1.2", 3, 3, false)).toBeNull();
  });

  it("keeps preset pages truthful for selection and an empty carousel", () => {
    expect(
      derivePresetCarousel({
        count: 5,
        selectedIndex: 3,
        visibleCount: 2,
        requestedPage: 0,
      }),
    ).toEqual({ page: 1, maxPage: 2, canGoPrevious: true, canGoNext: true });

    expect(
      derivePresetCarousel({
        count: 0,
        selectedIndex: -1,
        visibleCount: 3,
        requestedPage: 2,
      }),
    ).toEqual({ page: 0, maxPage: 0, canGoPrevious: false, canGoNext: false });
  });

  it("cycles preset focus without escaping the real preset collection", () => {
    expect(nextPresetIndex(0, 3, 1)).toBe(1);
    expect(nextPresetIndex(2, 3, 1)).toBe(0);
    expect(nextPresetIndex(0, 3, -1)).toBe(2);
    expect(nextPresetIndex(-1, 3, -1)).toBe(2);
    expect(nextPresetIndex(0, 0, 1)).toBe(-1);
  });

  it("converts generated bounds only at the display boundary", () => {
    expect(displayGCodeSize({ width: 2, height: 1 }, "in", "mm")).toEqual({
      width: 50.8,
      height: 25.4,
    });
    expect(displayGCodeSize({ width: 20, height: 10 }, "unknown", "mm")).toEqual({
      width: 20,
      height: 10,
    });
  });

  it("marks output stale when either source or angle changes", () => {
    const generation = { source: "G0 X1 Y1", angle: 90 };
    expect(generationIsFresh(generation, "G0 X1 Y1", 90)).toBe(true);
    expect(generationIsFresh(generation, "G0 X2 Y1", 90)).toBe(false);
    expect(generationIsFresh(generation, "G0 X1 Y1", 180)).toBe(false);
    expect(generationIsFresh(null, "G0 X1 Y1", 90)).toBe(false);
  });
});
