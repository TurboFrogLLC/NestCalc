import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  analyzeGCode,
  generateRotatedGCode,
  rotateBounds,
} from "./gcodeRotation";

const LOCAL_GOLDEN_FIXTURE =
  "/Users/computer/wrecklesstoddler/vibe/images/nestcalc/nestcalc code examples";

const GOLDEN_RANGES: ReadonlyArray<readonly [number, number]> = [
  [0, 159],
  [159, 199],
  [199, 256],
  [256, 429],
  [429, 655],
];

const FALLBACK_GOLDEN_PROGRAMS = Array.from({ length: 5 }, () =>
  [
    "! sanitized ACS controller text",
    "M20001 ; machine setup",
    "CALL CUT_START",
    "G40",
    "G00 X1 Y0",
    "G41D[CRC]",
    "G03 X0 Y1 I-1 J0",
    "G200",
    "M20002",
    "GOTO CUT_START",
    "RET",
  ].join("\n"),
);

function loadGoldenPrograms(): string[] {
  if (!existsSync(LOCAL_GOLDEN_FIXTURE)) return FALLBACK_GOLDEN_PROGRAMS;

  const lines = readFileSync(LOCAL_GOLDEN_FIXTURE, "utf8").split(/\r?\n/);
  return GOLDEN_RANGES.map(([start, end]) => {
    const block = lines.slice(start, end);
    const bodyStart = block.findIndex((line) => /^\s*CALL\b/i.test(line));
    if (bodyStart === -1) {
      throw new Error("Golden fixture program body marker is missing.");
    }
    return block.slice(bodyStart).join("\n").replace(/\n+$/, "");
  });
}

function maskMotionNumbers(source: string): string {
  return source.replace(
    /([XYIJ])([ \t]*)([+-]?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:[eE][+-]?\d+)?)/gi,
    "$1$2<coordinate>",
  );
}

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

describe("plotter-only G-code rotation", () => {
  it("accepts motion without G20/G21/G90/G17 and rotates endpoints", () => {
    const source = "G00 X1 Y2\nG01 X3 Y4";

    expect(analyzeGCode(source)).toEqual({
      ok: true,
      bounds: { minX: 1, minY: 2, maxX: 3, maxY: 4 },
      unit: "unknown",
    });
    expect(generateRotatedGCode(source, 90)).toEqual({
      ok: true,
      output: "G00 X-2 Y1\nG01 X-4 Y3",
      bounds: { minX: -4, minY: 1, maxX: -2, maxY: 3 },
      unit: "unknown",
    });
  });

  it("supports modal coordinate-only blocks without interpreting ACS text", () => {
    const source = "G00 X1 Y2\nX3 Y4\nCALL X_NOT_A_COORDINATE\nG40";
    const result = generateRotatedGCode(source, -90);

    expect(result).toEqual({
      ok: true,
      output: "G00 X2 Y-1\nX4 Y-3\nCALL X_NOT_A_COORDINATE\nG40",
      bounds: { minX: 2, minY: -3, maxX: 4, maxY: -1 },
      unit: "unknown",
    });
  });

  it("rotates I/J vectors and preserves clockwise/counterclockwise G-codes", () => {
    const source = "G00 X1 Y0\nG03 X0 Y1 I-1 J0\nG02 X1 Y0 I0 J-1";
    const result = generateRotatedGCode(source, 90);

    expect(result).toEqual({
      ok: true,
      output:
        "G00 X0 Y1\nG03 X-1.000000 Y0.000000 I0.000000 J-1.000000\n" +
        "G02 X0.000000 Y1.000000 I1.000000 J0.000000",
      bounds: { minX: -1, minY: 0, maxX: 0, maxY: 1 },
      unit: "unknown",
    });
  });

  it("uses extra precision for non-orthogonal rotation and keeps transformed arcs valid", () => {
    const result = generateRotatedGCode(
      "G00 X1.000 Y0.000\nG03 X0.000 Y1.000 I-1.000 J0.000",
      45,
    );

    expect(result).toEqual({
      ok: true,
      output:
        "G00 X0.707107 Y0.707107\n" +
        "G03 X-0.707107 Y0.707107 I-0.707107 J-0.707107",
      bounds: {
        minX: -0.707107,
        minY: 0.707107,
        maxX: 0.707107,
        maxY: 1.0000003094489522,
      },
      unit: "unknown",
    });
  });

  it("preserves blank lines, comments, labels, M-codes, and ACS constructs byte-for-byte", () => {
    const source = [
      "! controller header X99 Y99",
      "M20001 ; machine setup X88 Y88",
      "CALL CUT_START",
      "G40",
      "G00 X1 Y0",
      "G41D[CRC]",
      "G03 X0 Y1 I-1 J0 (arc X77 Y77)",
      "G200",
      "M20002",
      "GOTO CUT_START",
      "RET",
      "",
      "ptp/ev (X66 Y66)",
    ].join("\n");
    const result = generateRotatedGCode(source, 90);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(maskMotionNumbers(result.output)).toBe(maskMotionNumbers(source));
    expect(result.output).toContain("G41D[CRC]");
    expect(result.output).toContain("ptp/ev (X66 Y66)");
  });

  it("does not rewrite coordinate-looking text inside comments", () => {
    const source =
      "G00 X1 Y2 ; X90 Y90\n! G01 X80 Y80\n(G02 X70 Y70 I1 J1)\nG01 X3 Y4";
    const result = generateRotatedGCode(source, 90);

    expect(result).toEqual({
      ok: true,
      output:
        "G00 X-2 Y1 ; X90 Y90\n! G01 X80 Y80\n(G02 X70 Y70 I1 J1)\nG01 X-4 Y3",
      bounds: { minX: -4, minY: 1, maxX: -2, maxY: 3 },
      unit: "unknown",
    });
  });

  it("keeps explicit unit precision when a program provides it without requiring it", () => {
    expect(generateRotatedGCode("G20 G00 X1 Y2", 90)).toMatchObject({
      ok: true,
      output: "G20 G00 X-2.00000 Y1.00000",
      unit: "in",
    });
    expect(generateRotatedGCode("G21 G00 X1 Y2", 90)).toMatchObject({
      ok: true,
      output: "G21 G00 X-2.0000 Y1.0000",
      unit: "mm",
    });
  });

  it("reports non-finite target numbers but does not reject unrelated dialect text", () => {
    const result = analyzeGCode("! XInfinity YInfinity\nG00 XInfinity Y1");

    expect(result).toEqual({
      ok: false,
      diagnostics: [{ line: 2, reason: "Numeric word X must be finite." }],
    });
    expect(analyzeGCode("G00 X1e309 Y1")).toEqual({
      ok: false,
      diagnostics: [{ line: 1, reason: "Numeric word X must be finite." }],
    });
    expect(analyzeGCode("G200 XInfinity YInfinity\nG00 X1 Y2")).toMatchObject({
      ok: true,
    });
  });

  it("checks center-format radius equality on the rewritten arc only", () => {
    const source = "G00 X0 Y0\nG02 X2.0003 Y0 I1 J0";

    expect(analyzeGCode(source).ok).toBe(true);
    const result = generateRotatedGCode(source, 0);

    expect(result).toEqual({
      ok: false,
      diagnostics: [
        {
          line: 2,
          reason:
            "Transformed center-format arc radii differ beyond the active tolerance.",
        },
      ],
    });
  });
});

describe("golden ACS program bodies", () => {
  it("generates all five local program bodies at 0, 90, and -90 with zero alarms", () => {
    const programs = loadGoldenPrograms();
    expect(programs).toHaveLength(5);

    for (const program of programs) {
      for (const angle of [0, 90, -90]) {
        const result = generateRotatedGCode(program, angle);

        expect(result.ok).toBe(true);
        if (!result.ok) continue;
        if (angle === 0) {
          expect(result.output).toBe(program);
        } else {
          expect(maskMotionNumbers(result.output)).toBe(
            maskMotionNumbers(program),
          );
        }
      }
    }
  });
});
