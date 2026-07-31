import { describe, expect, it } from "vitest";
import {
  analyzeGCode,
  generateRotatedGCode,
  rotateBounds,
} from "./gcodeRotation";

describe("rotateBounds", () => {
  it("rotates all four source-bound corners around code origin", () => {
    expect(
      rotateBounds({ minX: 1, minY: 2, maxX: 3, maxY: 4 }, 90),
    ).toEqual({ minX: -4, minY: 1, maxX: -2, maxY: 3 });
  });

  it("supports clockwise quarter-turns without floating-point residue", () => {
    expect(
      rotateBounds({ minX: 1, minY: 2, maxX: 3, maxY: 4 }, -90),
    ).toEqual({ minX: 2, minY: -3, maxX: 4, maxY: -1 });
  });
});

describe("supported RS274 rotation", () => {
  it("rotates an absolute endpoint and emits five-place inch coordinates", () => {
    const source = "G90 G20\nG00 X1 Y2 F120";

    expect(analyzeGCode(source)).toEqual({
      ok: true,
      bounds: { minX: 1, minY: 2, maxX: 1, maxY: 2 },
      unit: "in",
    });
    expect(generateRotatedGCode(source, 90)).toEqual({
      ok: true,
      output: "G90 G20\nG00 X-2.00000 Y1.00000 F120",
      bounds: { minX: -2, minY: 1, maxX: -2, maxY: 1 },
      unit: "in",
    });
  });

  it("reconstructs an omitted axis at four-place millimeter precision", () => {
    const source =
      "G90 G21\r\nG00 X10 Y20 (home)\r\nG01 X12.34567 F200 ; keep feed";

    const result = generateRotatedGCode(source, 0);

    expect(result).toMatchObject({ ok: true, unit: "mm" });
    if (!result.ok) return;
    expect(result.output).toBe(
      "G90 G21\r\nG00 X10.0000 Y20.0000 (home)\r\n" +
        "G01 X12.3457 F200 Y20.0000 ; keep feed",
    );
  });

  it("rotates an I/J arc vector and includes swept cardinal extrema", () => {
    const source = "G90 G21 G17\nG00 X1 Y0\nG03 X0 Y1 I-1";

    expect(analyzeGCode(source)).toEqual({
      ok: true,
      bounds: { minX: 0, minY: 0, maxX: 1, maxY: 1 },
      unit: "mm",
    });
    expect(generateRotatedGCode(source, 90)).toEqual({
      ok: true,
      output:
        "G90 G21 G17\n" +
        "G00 X0.0000 Y1.0000\n" +
        "G03 X-1.0000 Y0.0000 I0.0000 J-1.0000",
      bounds: { minX: -1, minY: 0, maxX: 0, maxY: 1 },
      unit: "mm",
    });
  });

  it("preserves finite sub-picometer coordinates in source bounds", () => {
    expect(
      analyzeGCode(
        "G90 G21\nG00 X0.0000000000005 Y-0.0000000000005",
      ),
    ).toEqual({
      ok: true,
      bounds: {
        minX: 5e-13,
        minY: -5e-13,
        maxX: 5e-13,
        maxY: -5e-13,
      },
      unit: "mm",
    });
  });

  it("does not treat distinct near-coincident arc endpoints as a full circle", () => {
    expect(
      analyzeGCode(
        "G90 G21 G17\nG00 X1 Y0\n" +
          "G03 X1 Y0.0000000000005 I-1 J0",
      ),
    ).toEqual({
      ok: true,
      bounds: { minX: 1, minY: 0, maxX: 1, maxY: 5e-13 },
      unit: "mm",
    });
  });

  it("does not include a cardinal extremum just outside the exact arc sweep", () => {
    expect(
      analyzeGCode(
        "G90 G21 G17\nG00 X1 Y0\n" +
          "G03 X0.0000000000005 Y1 I-1 J0",
      ),
    ).toEqual({
      ok: true,
      bounds: { minX: 5e-13, minY: 0, maxX: 1, maxY: 1 },
      unit: "mm",
    });
  });

  it("includes cardinal extrema inside a clockwise arc sweep", () => {
    expect(
      analyzeGCode("G90 G21 G17\nG00 X1 Y0\nG02 X0 Y1 I-1 J0"),
    ).toEqual({
      ok: true,
      bounds: { minX: -1, minY: -1, maxX: 1, maxY: 1 },
      unit: "mm",
    });
  });

  it("rotates endpoints and center vectors at a non-orthogonal angle", () => {
    const result = generateRotatedGCode(
      "G90 G21 G17\nG00 X1 Y0\nG03 X0 Y1 I-1",
      45,
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output).toBe(
      "G90 G21 G17\n" +
        "G00 X0.7071 Y0.7071\n" +
        "G03 X-0.7071 Y0.7071 I-0.7071 J-0.7071",
    );
  });

  it("blocks output when fixed formatting breaks arc-radius tolerance", () => {
    const source =
      "G90 G20 G17\nG00 X0 Y0\nG02 X2.000184 Y0 I1 J0";

    expect(analyzeGCode(source).ok).toBe(true);
    const result = generateRotatedGCode(source, 24.57);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.diagnostics[0]).toMatchObject({ line: 3 });
    expect(result.diagnostics[0].reason).toContain("radii differ");
  });

  it.each([
    ["G20", "G90 G20 G17\nG00 X1 Y0\nG03 X1 Y0.000001 I-1 J0"],
    ["G21", "G90 G21 G17\nG00 X1 Y0\nG03 X1 Y0.00001 I-1 J0"],
  ])(
    "rejects a %s arc whose distinct endpoints collapse during formatting",
    (_unit, source) => {
      expect(analyzeGCode(source).ok).toBe(true);

      const result = generateRotatedGCode(source, 0);

      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.diagnostics[0]).toMatchObject({ line: 3 });
      expect(result.diagnostics[0].reason).toContain("arc topology");
    },
  );

  it.each([
    [
      0,
      "G00 X1.00000 Y0.00000\nG03 X0.00000 Y1.00000 I-1.00000 J0.00000",
    ],
    [
      -90,
      "G00 X0.00000 Y-1.00000\nG03 X1.00000 Y0.00000 I0.00000 J1.00000",
    ],
  ])("preserves G03 direction while rotating points and vectors by %s°", (angle, expectedMotion) => {
    const result = generateRotatedGCode(
      "G90 G20 G17\nG00 X1 Y0\nG03 X0 Y1 I-1 J0",
      angle,
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output).toBe(`G90 G20 G17\n${expectedMotion}`);
  });

  it("normalizes negative zero after the one serialization rounding step", () => {
    const result = generateRotatedGCode("G90 G20\nG00 X1 Y0", -180);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output).toBe("G90 G20\nG00 X-1.00000 Y0.00000");
    expect(result.output).not.toContain("-0.00000");
  });

  it("preserves material displacement from a tiny nonzero angle", () => {
    const result = generateRotatedGCode(
      "G90 G21\nG00 X0 Y100000000",
      5e-11,
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output).toBe(
      "G90 G21\nG00 X-0.0001 Y100000000.0000",
    );
  });

  it("reduces a maximum finite angle before trigonometry", () => {
    const result = generateRotatedGCode(
      "G90 G21\nG00 X1 Y0",
      Number.MAX_VALUE,
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output).toBe("G90 G21\nG00 X-0.6157 Y0.7880");
  });

  it("preserves blank lines, comments, line endings, and non-target tokens byte-for-byte", () => {
    const source =
      "%\r\nG90 G21\r\n\r\nN10 G00 X1 Y2 Z3 F40 (X9 Y9) ; X8 Y8\r\nM03 S12000\r\n%";
    const result = generateRotatedGCode(source, 0);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output).toBe(
      "%\r\nG90 G21\r\n\r\n" +
        "N10 G00 X1.0000 Y2.0000 Z3 F40 (X9 Y9) ; X8 Y8\r\n" +
        "M03 S12000\r\n%",
    );
  });

  it("uses five G20 places and four G21 places, never the lower UI precision", () => {
    const inches = generateRotatedGCode("G90 G20\nG00 X1.234567 Y2", 0);
    const millimeters = generateRotatedGCode("G90 G21\nG00 X1.234567 Y2", 0);

    expect(inches.ok && inches.output).toContain("X1.23457 Y2.00000");
    expect(millimeters.ok && millimeters.output).toContain("X1.2346 Y2.0000");
    expect(inches.ok && inches.output).not.toContain("X1.2346 Y2.0000");
    expect(millimeters.ok && millimeters.output).not.toContain("X1.235 Y2.000");
  });

  it("never emits exponent notation for large finite transformed coordinates", () => {
    const result = generateRotatedGCode("G90 G21\nG00 X1e21 Y0", 0);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output).toBe(
      "G90 G21\nG00 X1000000000000000000000.0000 Y0.0000",
    );
    expect(result.output).not.toMatch(/[eE][+-]?\d/);
  });
});

describe("fail-closed source diagnostics", () => {
  it.each([
    [
      "modal motion",
      "G90 G21\nZ1\nG00 X0 Y0",
      2,
      "Motion mode",
    ],
    ["absolute mode", "G21 G00 Z1\nG00 X0 Y0", 1, "G90"],
    ["unit mode", "G90 G00 Z1\nG00 X0 Y0", 1, "G20 or G21"],
  ])(
    "applies %s safety to non-XY coordinate motion",
    (_name, source, line, reasonFragment) => {
      const result = analyzeGCode(source);

      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.diagnostics[0]).toMatchObject({ line });
      expect(result.diagnostics[0].reason).toContain(reasonFragment);
    },
  );

  it("rejects an unsupported helical arc", () => {
    const result = analyzeGCode(
      "G90 G21 G17\nG00 X0 Y0\nG02 X1 Y0 Z1 I0.5 J0",
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.diagnostics[0]).toMatchObject({ line: 3 });
    expect(result.diagnostics[0].reason).toContain("non-XY axis");
  });

  it.each([
    [
      "overflowed radius",
      "G90 G21 G17\nG00 X0 Y0\nG03 X0 Y0 I1.7e308 J1.7e308",
    ],
    [
      "overflowed center",
      "G90 G21 G17\nG00 X1.7e308 Y0\nG03 X1.7e308 Y0 I1.7e308 J0",
    ],
  ])("rejects non-finite derived arc geometry from an %s", (_name, source) => {
    const result = analyzeGCode(source);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.diagnostics[0]).toMatchObject({ line: 3 });
    expect(result.diagnostics[0].reason).toContain("finite");
  });

  it.each([
    ["G91", "G90 G21\nG91 G01 X1 Y1", "G91"],
    ["G53", "G90 G21\nG53 G00 X1 Y1", "G53"],
    ["G52", "G90 G21\nG52 X1 Y1", "G52"],
    ["G68", "G90 G21\nG68 X0 Y0 R45", "G68"],
    ["G69", "G90 G21\nG69", "G69"],
    ["G92", "G90 G21\nG92 X0 Y0", "G92"],
    ["G28", "G90 G21\nG28 X0 Y0", "G28"],
    ["G30", "G90 G21\nG30 X0 Y0", "G30"],
    ["G18", "G90 G21\nG18", "G18"],
    ["G19", "G90 G21\nG19", "G19"],
    ["R-word arc", "G90 G21 G17\nG02 X1 Y1 R1", "R-word"],
    ["canned cycle", "G90 G21\nG81 X1 Y1", "G81"],
  ])("rejects executable unsupported %s", (_name, source, reasonFragment) => {
    const result = analyzeGCode(source);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.diagnostics[0]).toMatchObject({ line: 2 });
    expect(result.diagnostics[0].reason).toContain(reasonFragment);
  });

  it.each([
    ["malformed number", "G90 G21\nG00 Xnope Y1", 2, "Malformed numeric word X"],
    ["non-finite number", "G90 G21\nG00 X1e309 Y1", 2, "must be finite"],
    ["Infinity", "G90 G21\nG00 XInfinity Y1", 2, "must be finite"],
    ["NaN", "G90 G21\nG00 XNaN Y1", 2, "must be finite"],
    ["macro variable", "G90 G21\n#1=2", 2, "Unsupported executable token"],
    ["subprogram label", "G90 G21\nO1000", 2, "O-word"],
    ["M97 subprogram call", "G90 G21\nM97 P1000", 2, "M97"],
    ["M98 subprogram call", "G90 G21\nM98 P1000", 2, "M98"],
    ["M99 subprogram return", "G90 G21\nM99", 2, "M99"],
    ["M198 subprogram call", "G90 G21\nM198 P1000", 2, "M198"],
  ])("rejects an unsupported %s", (_name, source, line, reasonFragment) => {
    const result = analyzeGCode(source);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.diagnostics[0]).toMatchObject({ line });
    expect(result.diagnostics[0].reason).toContain(reasonFragment);
  });

  it.each([
    ["absolute mode", "G20 G00 X1 Y1", 1, "G90"],
    ["unit mode", "G90 G00 X1 Y1", 1, "G20 or G21"],
    ["motion mode", "G90 G21\nX1 Y1", 2, "Motion mode"],
    ["initial Y", "G90 G21\nG00 X1", 2, "Y position"],
    [
      "XY plane",
      "G90 G21\nG00 X0 Y0\nG02 X1 Y0 I0.5 J0",
      3,
      "G17",
    ],
    [
      "arc start",
      "G90 G21 G17\nG02 X1 Y0 I0.5 J0",
      2,
      "Arc start",
    ],
  ])(
    "rejects motion with indeterminate %s",
    (_name, source, line, reasonFragment) => {
      const result = analyzeGCode(source);

      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.diagnostics[0]).toMatchObject({ line });
      expect(result.diagnostics[0].reason).toContain(reasonFragment);
    },
  );

  it.each([
    ["duplicate X", "G90 G21\nG00 X1 X2 Y0", 2, "Multiple X"],
    ["duplicate Y", "G90 G21\nG00 X1 Y0 Y2", 2, "Multiple Y"],
    ["duplicate I", "G90 G21 G17\nG00 X0 Y0\nG02 X1 Y0 I0.5 I0.5 J0", 3, "Multiple I"],
    ["duplicate J", "G90 G21 G17\nG00 X0 Y0\nG02 X1 Y0 I0.5 J0 J0", 3, "Multiple J"],
    ["duplicate R", "G90 G21 G17\nG00 X0 Y0\nG02 X1 Y0 R1 R2", 3, "Multiple R"],
    ["motion modes", "G90 G21\nG00 G01 X1 Y1", 2, "Conflicting modal motion"],
    ["distance modes", "G90 G91 G21 G00 X1 Y1", 1, "Conflicting distance"],
    ["unit modes", "G90 G20 G21 G00 X1 Y1", 1, "Conflicting unit"],
    ["planes", "G90 G21 G17 G18", 1, "Conflicting plane"],
  ])("rejects %s in one block", (_name, source, line, reasonFragment) => {
    const result = analyzeGCode(source);

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.diagnostics[0]).toMatchObject({ line });
    expect(result.diagnostics[0].reason).toContain(reasonFragment);
  });

  it("rejects a unit switch after motion instead of mixing modal coordinates", () => {
    const result = analyzeGCode("G90 G20\nG00 X1 Y2\nG21\nG01 Y25.4");

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.diagnostics[0]).toMatchObject({ line: 3 });
    expect(result.diagnostics[0].reason).toContain("Unit changes after motion");
  });

  it("rejects a unit switch after validated non-XY motion", () => {
    const result = analyzeGCode(
      "G90 G20 G00 Z1\nG21\nG00 X0 Y0",
    );

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.diagnostics[0]).toMatchObject({ line: 2 });
    expect(result.diagnostics[0].reason).toContain("Unit changes after motion");
  });

  it("rejects finite endpoints whose derived XY bounds span is non-finite", () => {
    const source =
      "G90 G21\nG00 X-1.7e308 Y0\nG01 X1.7e308 Y0";

    for (const result of [analyzeGCode(source), generateRotatedGCode(source, 0)]) {
      expect(result.ok).toBe(false);
      if (result.ok) continue;
      expect(result.diagnostics[0]).toMatchObject({ line: 3 });
      expect(result.diagnostics[0].reason).toContain("span");
    }
  });

  it.each([
    ["one point", "G90 G21\nG00 X1.7e308 Y1.7e308", 2],
    [
      "combined extrema",
      "G90 G21\nG00 X1.7e308 Y0\nG01 X0 Y1.7e308",
      3,
    ],
  ])(
    "rejects finite bounds whose %s preview corner radius is non-finite",
    (_name, source, line) => {
      for (const result of [
        analyzeGCode(source),
        generateRotatedGCode(source, 45),
      ]) {
        expect(result.ok).toBe(false);
        if (result.ok) continue;
        expect(result.diagnostics[0]).toMatchObject({ line });
        expect(result.diagnostics[0].reason).toContain("preview");
      }
    },
  );
});

describe("non-target coordinate preservation", () => {
  it("preserves a validated linear Z-only move without inserting X/Y", () => {
    const result = generateRotatedGCode(
      "G90 G21\nG00 X0 Y0\nG01 Z1 F10\nG01 X1",
      90,
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output).toBe(
      "G90 G21\n" +
        "G00 X0.0000 Y0.0000\n" +
        "G01 Z1 F10\n" +
        "G01 X0.0000 Y1.0000",
    );
  });
});
