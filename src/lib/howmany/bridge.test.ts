import { describe, expect, it } from "vitest";
import {
  displayGCodeSize,
  fieldBindingForId,
  formatShellNumber,
  generationIsFresh,
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
