import { describe, expect, it } from "vitest";
import { convertValue, formatDimension, round3, unitLabel } from "./units";

describe("unit helpers", () => {
  it("rounds values to three decimal places", () => {
    expect(round3(1.2349)).toBe(1.235);
  });

  it("converts inches and millimeters", () => {
    expect(convertValue(2, "in", "mm")).toBe(50.8);
    expect(convertValue(25.4, "mm", "in")).toBe(1);
  });

  it("formats labels and missing dimensions", () => {
    expect(unitLabel("in")).toBe("in");
    expect(unitLabel("mm")).toBe("mm");
    expect(formatDimension(null, "in")).toBe("—");
    expect(formatDimension(3, "mm")).toBe("3 mm");
  });
});
