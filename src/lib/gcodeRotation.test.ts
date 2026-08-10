import { describe, expect, it } from "vitest";
import {
  analyzeGCode,
  generateRotatedGCode,
  partSizeFromBounds,
  rotateBounds,
} from "./gcodeRotation";

// These are sanitized NC motion/control bodies copied from the local ACS
// fixture. Headers and identifying metadata are intentionally excluded.
const GOLDEN_PROGRAMS = [
  `CALL Initialize;
N002 G90
N004 G40
N006 G00 X1.0126 Y0.435
CALL StartCut1;
N008 G41D[CRC]
N010 G01 X1.0126 Y0.335
N012 G01 X1.56 Y0.335
N014 G03 X1.56 Y0.655 I0.0 J0.16
N016 G01 X0.5 Y0.655
N018 G03 X0.5 Y0.335 I0.0 J-0.16
N020 G01 X1.0126 Y0.335
N022 G01 X1.0126 Y0.385
CALL StopCut;
N024 G40
CALL ZtoSafe;

N026 G00 X1.965 Y0.4932
CALL StartCut2;
N028 G41D[CRC]
N030 G01 X1.935 Y0.4932
N032 G01 X1.935 Y0.0
N034 G01 X0.0 Y0.0
N036 G01 X0.0 Y0.05
N038 G01 X0.20727 Y0.409
N040 G03 X0.20727 Y0.581 I-0.14896 J0.086
N042 G01 X0.0 Y0.94
N044 G01 X0.0 Y0.99
N046 G01 X1.935 Y0.99
N048 G01 X1.935 Y0.5132
N050 G01 X1.965 Y0.5132
CALL StopCut;
N052 G40
CALL ZtoSafe;

! MAIN PROGRAM END
CALL Terminate;
STOP`,
  `CALL Initialize;
N002 G90
N004 G40
N006 G00 X0.83817 Y0.44949
CALL StartCut1;
N008 G41D[CRC]
N010 G01 X0.9273 Y0.40416
N012 G03 X0.9273 Y0.40416 I-0.18105 J0.09209
N014 G01 X0.88273 Y0.42682
CALL StopCut;
N016 G40
CALL ZtoSafe;

N018 G00 X1.26093 Y0.19626
CALL StartCut2;
N020 G41D[CRC]
N022 G01 X1.25615 Y0.20137
N024 G02 X0.0 Y0.74625 I-0.5099 J0.54488
N026 G02 X1.26843 Y0.21313 I0.74625 J0.0
N028 G01 X1.27333 Y0.20813
CALL StopCut;
N030 G40
CALL ZtoSafe;

! MAIN PROGRAM END
CALL Terminate;
STOP`,
  `CALL Initialize;
N002 G90
N004 G40
N006 G00 X0.7075 Y1.2975
CALL StartCut1;
N008 G41D[CRC]
N010 G01 X0.7575 Y1.2975
N012 G03 X0.4925 Y1.2975 I-0.1325 J0.0
N014 G01 X0.4925 Y0.7325
N016 G03 X0.7575 Y0.7325 I0.1325 J0.0
N018 G01 X0.7575 Y1.2975
N020 G01 X0.7075 Y1.2975
CALL StopCut;
N022 G40
CALL ZtoSafe;

N024 G00 X0.6234 Y1.62
CALL StartCut2;
N026 G41D[CRC]
N028 G01 X0.6234 Y1.56
N030 G01 X1.25 Y1.56
N032 G01 X1.25 Y1.43
N034 G01 X1.095 Y1.43
N036 G03 X1.095 Y1.24 I0.0 J-0.095
N038 G01 X1.25 Y1.24
N040 G01 X1.25 Y0.0
N042 G01 X1.12951 Y0.02561
N044 G03 X0.12049 Y0.02561 I-0.50451 J-1.41261
N046 G01 X0.0 Y0.0
N048 G01 X0.0 Y1.24
N050 G01 X0.155 Y1.24
N052 G03 X0.155 Y1.43 I0.0 J0.095
N054 G01 X0.0 Y1.43
N056 G01 X0.0 Y1.56
N058 G01 X0.6034 Y1.56
N060 G01 X0.6034 Y1.62
CALL StopCut;
N062 G40
CALL ZtoSafe;
N064 M01

! MAIN PROGRAM END
CALL Terminate;
STOP`,
  `CALL Initialize;
N002 G90
N004 G40
N006 G00 X1.8585 Y1.81806
CALL StartCut1;
N008 G41D[CRC]
N010 G01 X1.88032 Y1.83865
N012 G03 X1.88032 Y1.83865 I-0.74532 J-0.70365
CALL StopCut;
N014 G40
CALL ZtoSafe;

N016 G00 X1.9683 Y1.94915
CALL StartCut2;
N018 G41D[CRC]
N020 G01 X1.94684 Y1.92818
N022 G02 X1.94684 Y1.92818 I-0.81184 J-0.79318
CALL StopCut;
N024 G40
CALL ZtoSafe;

! MAIN PROGRAM END
CALL Terminate;
STOP`,
  `CALL Initialize;
N002 G90
N004 G40
N006 G00 X0.17583 Y0.05386
CALL StartCut1;
N008 G41D[CRC]
N010 G01 X0.16169 Y0.068
N012 G01 X0.10248 Y0.00879
N014 G02 X0.06005 Y0.00879 I-0.02121 J0.02121
N016 G01 X0.04591 Y0.02293
N018 G02 X0.04591 Y0.06536 I0.02121 J0.02121
N020 G01 X0.20678 Y0.22622
N022 G01 X0.00879 Y0.42421
N024 G02 X0.00879 Y0.46664 I0.02121 J0.02121
N026 G01 X0.2987 Y0.75655
N028 G02 X0.35527 Y0.69998 I0.02828 J-0.02828
N030 G01 X0.10071 Y0.44543
N032 G01 X0.2987 Y0.24744
N034 G02 X0.2987 Y0.20501 I-0.02121 J-0.02121
N036 G01 X0.16169 Y0.068
CALL StopCut;
N038 G40
CALL ZtoSafe;

N040 G00 X0.41782 Y0.05386
CALL StartCut1;
N042 G41D[CRC]
N044 G01 X0.40368 Y0.068
N046 G01 X0.34446 Y0.00879
N048 G02 X0.30204 Y0.00879 I-0.02121 J0.02121
N050 G01 X0.28789 Y0.02293
N052 G02 X0.28789 Y0.06536 I0.02121 J0.02121
N054 G01 X0.44876 Y0.22622
N056 G01 X0.25077 Y0.42421
N058 G02 X0.25077 Y0.46664 I0.02121 J0.02121
N060 G01 X0.54069 Y0.75655
N062 G02 X0.59725 Y0.69998 I0.02828 J-0.02828
N064 G01 X0.3427 Y0.44543
N066 G01 X0.54069 Y0.24744
N068 G02 X0.54069 Y0.20501 I-0.02121 J-0.02121
N070 G01 X0.40368 Y0.068
CALL StopCut;
N072 G40
CALL ZtoSafe;

N074 G00 X0.6598 Y0.05386
CALL StartCut1;
N076 G41D[CRC]
N078 G01 X0.64566 Y0.068
N080 G01 X0.58645 Y0.00879
N082 G02 X0.54402 Y0.00879 I-0.02121 J0.02121
N084 G01 X0.52988 Y0.02293
N086 G02 X0.52988 Y0.06536 I0.02121 J0.02121
N088 G01 X0.69075 Y0.22622
N090 G01 X0.49276 Y0.42421
N092 G02 X0.49276 Y0.46664 I0.02121 J0.02121
N094 G01 X0.78267 Y0.75655
N096 G02 X0.83924 Y0.69998 I0.02828 J-0.02828
N098 G01 X0.58468 Y0.44543
N100 G01 X0.78267 Y0.24744
N102 G02 X0.78267 Y0.20501 I-0.02121 J-0.02121
N104 G01 X0.64566 Y0.068
CALL StopCut;
N106 G40
CALL ZtoSafe;

N108 G00 X0.90179 Y0.05386
CALL StartCut1;
N110 G41D[CRC]
N112 G01 X0.88765 Y0.068
N114 G01 X0.82843 Y0.00879
N116 G02 X0.78601 Y0.00879 I-0.02121 J0.02121
N118 G01 X0.77186 Y0.02293
N120 G02 X0.77186 Y0.06536 I0.02121 J0.02121
N122 G01 X0.93273 Y0.22622
N124 G01 X0.73474 Y0.42421
N126 G02 X0.73474 Y0.46664 I0.02121 J0.02121
N128 G01 X1.02466 Y0.75655
N130 G02 X1.08122 Y0.69998 I0.02828 J-0.02828
N132 G01 X0.82667 Y0.44543
N134 G01 X1.02466 Y0.24744
N136 G02 X1.02466 Y0.20501 I-0.02121 J-0.02121
N138 G01 X0.88765 Y0.068
CALL StopCut;
N140 G40
CALL ZtoSafe;

N142 G00 X1.14377 Y0.05386
CALL StartCut1;
N144 G41D[CRC]
N146 G01 X1.12963 Y0.068
N148 G01 X1.07042 Y0.00879
N150 G02 X1.02799 Y0.00879 I-0.02121 J0.02121
N152 G01 X1.01385 Y0.02293
N154 G02 X1.01385 Y0.06536 I0.02121 J0.02121
N156 G01 X1.17472 Y0.22622
N158 G01 X0.97673 Y0.42421
N160 G02 X0.97673 Y0.46664 I0.02121 J0.02121
N162 G01 X1.26664 Y0.75655
N164 G02 X1.32321 Y0.69998 I0.02828 J-0.02828
N166 G01 X1.06865 Y0.44543
N168 G01 X1.26664 Y0.24744
N170 G02 X1.26664 Y0.20501 I-0.02121 J-0.02121
N172 G01 X1.12963 Y0.068
CALL StopCut;
N174 G40
CALL ZtoSafe;

N176 G00 X1.38576 Y0.05386
CALL StartCut1;
N178 G41D[CRC]
N180 G01 X1.37162 Y0.068
N182 G01 X1.3124 Y0.00879
N184 G02 X1.26998 Y0.00879 I-0.02121 J0.02121
N186 G01 X1.25583 Y0.02293
N188 G02 X1.25583 Y0.06536 I0.02121 J0.02121
N190 G01 X1.4167 Y0.22622
N192 G01 X1.21871 Y0.42421
N194 G02 X1.21871 Y0.46664 I0.02121 J0.02121
N196 G01 X1.50862 Y0.75655
N198 G02 X1.56519 Y0.69998 I0.02828 J-0.02828
N200 G01 X1.31063 Y0.44543
N202 G01 X1.50862 Y0.24744
N204 G02 X1.50862 Y0.20501 I-0.02121 J-0.02121
N206 G01 X1.37162 Y0.068
CALL StopCut;
N208 G40
CALL ZtoSafe;

N210 G00 X1.62774 Y0.05386
CALL StartCut1;
N212 G41D[CRC]
N214 G01 X1.6136 Y0.068
N216 G01 X1.55439 Y0.00879
N218 G02 X1.51196 Y0.00879 I-0.02121 J0.02121
N220 G01 X1.49782 Y0.02293
N222 G02 X1.49782 Y0.06536 I0.02121 J0.02121
N224 G01 X1.65869 Y0.22622
N226 G01 X1.4607 Y0.42421
N228 G02 X1.4607 Y0.46664 I0.02121 J0.02121
N230 G01 X1.75061 Y0.75655
N232 G02 X1.80718 Y0.69998 I0.02828 J-0.02828
N234 G01 X1.55262 Y0.44543
N236 G01 X1.75061 Y0.24744
N238 G02 X1.75061 Y0.20501 I-0.02121 J-0.02121
N240 G01 X1.6136 Y0.068
CALL StopCut;
N242 G40
CALL ZtoSafe;

N244 G00 X1.86973 Y0.05386
CALL StartCut1;
N246 G41D[CRC]
N248 G01 X1.85559 Y0.068
N250 G01 X1.79637 Y0.00879
N252 G02 X1.75395 Y0.00879 I-0.02121 J0.02121
N254 G01 X1.7398 Y0.02293
N256 G02 X1.7398 Y0.06536 I0.02121 J0.02121
N258 G01 X1.90067 Y0.22622
N260 G01 X1.70268 Y0.42421
N262 G02 X1.70268 Y0.46664 I0.02121 J0.02121
N264 G01 X1.99259 Y0.75655
N266 G02 X2.04916 Y0.69998 I0.02828 J-0.02828
N268 G01 X1.7946 Y0.44543
N270 G01 X1.99259 Y0.24744
N272 G02 X1.99259 Y0.20501 I-0.02121 J-0.02121
N274 G01 X1.85559 Y0.068
CALL StopCut;
N276 G40
CALL ZtoSafe;

N278 G00 X2.11171 Y0.05386
CALL StartCut1;
N280 G41D[CRC]
N282 G01 X2.09757 Y0.068
N284 G01 X2.03836 Y0.00879
N286 G02 X1.99593 Y0.00879 I-0.02121 J0.02121
N288 G01 X1.98179 Y0.02293
N290 G02 X1.98179 Y0.06536 I0.02121 J0.02121
N292 G01 X2.14266 Y0.22622
N294 G01 X1.94467 Y0.42421
N296 G02 X1.94467 Y0.46664 I0.02121 J0.02121
N298 G01 X2.23458 Y0.75655
N300 G02 X2.29115 Y0.69998 I0.02828 J-0.02828
N302 G01 X2.03659 Y0.44543
N304 G01 X2.23458 Y0.24744
N306 G02 X2.23458 Y0.20501 I-0.02121 J-0.02121
N308 G01 X2.09757 Y0.068
CALL StopCut;
N310 G40
CALL ZtoSafe;

N312 G00 X2.3537 Y0.05386
CALL StartCut1;
N314 G41D[CRC]
N316 G01 X2.33956 Y0.068
N318 G01 X2.28034 Y0.00879
N320 G02 X2.23792 Y0.00879 I-0.02121 J0.02121
N322 G01 X2.22377 Y0.02293
N324 G02 X2.22377 Y0.06536 I0.02121 J0.02121
N326 G01 X2.38464 Y0.22622
N328 G01 X2.18665 Y0.42421
N330 G02 X2.18665 Y0.46664 I0.02121 J0.02121
N332 G01 X2.47656 Y0.75655
N334 G02 X2.53313 Y0.69998 I0.02828 J-0.02828
N336 G01 X2.27857 Y0.44543
N338 G01 X2.47656 Y0.24744
N340 G02 X2.47656 Y0.20501 I-0.02121 J-0.02121
N342 G01 X2.33956 Y0.068
CALL StopCut;
N344 G40
CALL ZtoSafe;

! MAIN PROGRAM END
CALL Terminate;
STOP`,
] as const;

function maskMotionNumbers(source: string): string {
  return source.replace(
    /([XYIJ])([ \t]*)([+-]?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:[eE][+-]?\d+)?)/gi,
    "$1$2<coordinate>",
  );
}

describe("partSizeFromBounds", () => {
  it("uses source-bounds spans regardless of negative or offset origins", () => {
    expect(
      partSizeFromBounds({ minX: -3, minY: 10, maxX: 7, maxY: 14 }),
    ).toEqual({ width: 10, height: 4 });
  });

  it("rejects non-finite or reversed bounds", () => {
    expect(
      partSizeFromBounds({ minX: 0, minY: 0, maxX: Number.NaN, maxY: 1 }),
    ).toBeNull();
    expect(
      partSizeFromBounds({ minX: 2, minY: 0, maxX: 1, maxY: 1 }),
    ).toBeNull();
  });

  it("keeps zero spans explicit so the UI can disable Fill", () => {
    expect(
      partSizeFromBounds({ minX: 2, minY: -1, maxX: 2, maxY: 3 }),
    ).toEqual({ width: 0, height: 4 });
  });
});

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
  it("keeps source spans stable for the sanitized golden bodies", () => {
    const sizes = GOLDEN_PROGRAMS.map((program) => {
      const analysis = analyzeGCode(program);
      return analysis.ok ? partSizeFromBounds(analysis.bounds) : analysis;
    });

    expect(sizes).toEqual([
      { width: 1.965, height: 0.99 },
      { width: 1.492502118522956, height: 1.492502118522956 },
      { width: 1.25, height: 1.62 },
      { width: 2.2699944475703013, height: 2.2699944475703018 },
      { width: 2.5448294292018443, height: 0.7682594292018445 },
    ]);
  });

  it("generates all five local program bodies at 0, 90, and -90 with zero alarms", () => {
    expect(GOLDEN_PROGRAMS).toHaveLength(5);

    for (const program of GOLDEN_PROGRAMS) {
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

describe("plotter residual P1 regressions", () => {
  it("reconstructs an omitted modal endpoint axis", () => {
    const result = generateRotatedGCode(
      "G21\nG00 X1 Y2\nG01 X3 ; omitted Y",
      90,
    );

    expect(result).toEqual({
      ok: true,
      output:
        "G21\nG00 X-2.0000 Y1.0000\nG01 X-2.0000 Y3.0000 ; omitted Y",
      bounds: { minX: -2, minY: 1, maxX: -2, maxY: 3 },
      unit: "mm",
    });
  });

  it("rejects executable G53 instead of rotating machine coordinates", () => {
    expect(
      generateRotatedGCode("G20\nG53 G00 X1 Y2", 90),
    ).toEqual({
      ok: false,
      diagnostics: [
        { line: 2, reason: "G53 machine-coordinate motion is unsupported." },
      ],
    });
  });

  it("preserves the magnitude of scientific-notation coordinates", () => {
    const result = generateRotatedGCode("G00 X1e-3 Y0", 90);

    expect(result).toEqual({
      ok: true,
      output: "G00 X0.000 Y0.001",
      bounds: { minX: 0, minY: 0.001, maxX: 0, maxY: 0.001 },
      unit: "unknown",
    });
  });

  it("rejects a center-format arc before its modal start is known", () => {
    expect(generateRotatedGCode("G03 X1 Y0 I-1 J0", 90)).toEqual({
      ok: false,
      diagnostics: [
        { line: 1, reason: "Arc start X/Y must be known before transforming." },
      ],
    });
  });
});
