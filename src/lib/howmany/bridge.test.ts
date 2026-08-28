import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { calculateNest } from "../nestcalc";
import { convertValue } from "../units";
import {
  committedShellNumericValue,
  derivePresetCarousel,
  displayGCodeSize,
  fieldBindingForId,
  formatShellNumber,
  generationIsFresh,
  HOWMANY_COUNT_ID,
  insertShellDecimal,
  joinHowManyCount,
  joinHowManyCountFromFields,
  marginsBadgeText,
  nestInputsFromShellFields,
  normalizeShellDialogName,
  quickValueDraft,
  sanitizeShellNumericDraft,
  shouldPreserveNumericDraft,
} from "./bridge";

const nestFixtureFields = {
  "part-x": "10",
  "part-y": "5",
  "rem-x": "45",
  "rem-y": "22",
  "gap-x": "1",
  "gap-y": "0.5",
  "m-left": "1",
  "m-right": "2",
  "m-top": "3",
  "m-bottom": "4",
};

function shellDocument(fields: Record<string, string>) {
  const nodes = new Map<string, { id: string; value?: string; textContent: string }>();
  nodes.set(HOWMANY_COUNT_ID, { id: HOWMANY_COUNT_ID, textContent: "" });
  for (const [id, value] of Object.entries(fields)) {
    nodes.set(id, { id, value, textContent: value });
  }
  return {
    getElementById(id: string) {
      return nodes.get(id) ?? null;
    },
  };
}

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

    const wholeNumber = insertShellDecimal("1", 1, 1, false);
    expect(wholeNumber).toEqual({ value: "1.", caret: 2 });
    expect(`${wholeNumber?.value}2`).toBe("1.2");
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

  it("sanitizes hosted numeric drafts to digits and one decimal point", () => {
    expect(sanitizeShellNumericDraft("12a.3b.4")).toBe("12.34");
    expect(sanitizeShellNumericDraft(".625in")).toBe(".625");
    expect(sanitizeShellNumericDraft("abc")).toBe("");
  });

  it("hydrates empty and whole-number drafts with quick fractions", () => {
    expect(quickValueDraft("5", "0.375")).toBe("5.375");
    expect(quickValueDraft("", "0.375")).toBe(".375");
  });

  it("leaves decimal drafts unchanged when a quick value is clicked", () => {
    expect(quickValueDraft("5.", "0.375")).toBe("5.");
    expect(quickValueDraft("5.25", "0.375")).toBe("5.25");
  });

  it("rejects invalid quick drafts without producing NaN or a lone decimal", () => {
    expect(quickValueDraft("5", "not-a-number")).toBe("5");
    expect(quickValueDraft("", ".")).toBe("");
    expect(Number.isNaN(Number(quickValueDraft("5", "not-a-number")))).toBe(
      false,
    );
    expect(committedShellNumericValue(".")).toBeNull();
    expect(committedShellNumericValue("NaN")).toBeNull();
    expect(committedShellNumericValue("1.2")).toBe(1.2);
  });

  it("keeps multi-character dialog names while enforcing the authority limit", () => {
    expect(normalizeShellDialogName("  stainless  ")).toBe("stainless");
    expect(normalizeShellDialogName("ABCDEFGHIJKLMNOPQRSTUVWXY")).toBe(
      "ABCDEFGHIJKLMNOPQRSTUVWX",
    );
  });

  it("formats the collapsed margins badge in left, right, bottom, top order", () => {
    expect(
      marginsBadgeText({ left: 0.125, right: null, bottom: 2, top: 0 }),
    ).toBe("L0.125 R— B2 T0");
  });
});

describe("HowMany count join", () => {
  it("writes calculateNest totalParts onto #lb-count through the session join", () => {
    const expected = calculateNest({
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
    });
    const doc = shellDocument(nestFixtureFields);

    const totalParts = joinHowManyCount(doc);

    expect(HOWMANY_COUNT_ID).toBe("lb-count");
    expect(totalParts).toBe(expected.totalParts);
    expect(totalParts).toBe(6);
    expect(doc.getElementById(HOWMANY_COUNT_ID)?.textContent).toBe("6");
    expect(joinHowManyCountFromFields(nestFixtureFields)).toBe(6);
  });

  it("runs convertValue on the join before createNestSession", () => {
    const mmFields = Object.fromEntries(
      Object.entries(nestFixtureFields).map(([id, value]) => [
        id,
        String(convertValue(Number(value), "in", "mm")),
      ]),
    );
    const inputs = nestInputsFromShellFields(mmFields, "mm", "in");

    expect(inputs.partWidth).toBe(10);
    expect(inputs.remnantWidth).toBe(45);
    expect(inputs.gapY).toBe(0.5);
    expect(inputs.margins.top).toBe(3);
    expect(joinHowManyCountFromFields(mmFields, "mm", "in")).toBe(6);
  });

  it("keeps the V3 host count slot by the arc and kills AUTO-SIZE → FLiPIT", () => {
    const html = readFileSync(
      path.join(
        process.cwd(),
        "docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html",
      ),
      "utf8",
    );
    const autoSizeClick = html.match(
      /getElementById\('btn-auto-size'\)\.addEventListener\('click', function \(\) \{[\s\S]*?\}\);/,
    )?.[0];

    expect(html).toContain('id="lb-count"');
    expect(html.indexOf('id="lb-count"')).toBeGreaterThan(
      html.indexOf('id="lb-corner-arc"'),
    );
    expect(html.indexOf('id="lb-count"')).toBeLessThan(
      html.indexOf('id="lb-hit-corner"'),
    );
    expect(html).toContain('id="part-x"');
    expect(html).toContain('id="rem-x"');
    expect(autoSizeClick).toBeTruthy();
    expect(autoSizeClick).not.toContain("__flipitAutoSize");
  });
});
