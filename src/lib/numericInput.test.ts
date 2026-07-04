import { describe, expect, it } from "vitest";
import {
  finalizeNumericDraft,
  parseNumericInput,
  sanitizeNumericInput,
} from "./numericInput";

describe("sanitizeNumericInput", () => {
  it("keeps digits and one decimal point with three fractional digits", () => {
    expect(sanitizeNumericInput("a12.3456.7in")).toBe("12.345");
  });
});

describe("parseNumericInput", () => {
  it("parses non-negative numeric text rounded to three decimals", () => {
    expect(parseNumericInput(" 1.2349 ")).toBe(1.235);
  });

  it("returns null for empty draft values", () => {
    expect(parseNumericInput("")).toBeNull();
    expect(parseNumericInput(".")).toBeNull();
  });
});

describe("finalizeNumericDraft", () => {
  it("normalizes blank and trailing-dot drafts for blur", () => {
    expect(finalizeNumericDraft(" . ")).toBe("");
    expect(finalizeNumericDraft("12.")).toBe("12");
  });
});
