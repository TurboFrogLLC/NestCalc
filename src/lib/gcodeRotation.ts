export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface GCodeDiagnostic {
  line: number;
  reason: string;
}

type GCodeUnit = "in" | "mm";

export type GCodeAnalysis =
  | { ok: true; bounds: Bounds; unit: GCodeUnit }
  | { ok: false; diagnostics: GCodeDiagnostic[] };

export type GCodeGeneration =
  | { ok: true; output: string; bounds: Bounds; unit: GCodeUnit }
  | { ok: false; diagnostics: GCodeDiagnostic[] };

interface Point {
  x: number;
  y: number;
}

interface WordToken {
  letter: string;
  upper: string;
  value: number;
  numberStart: number;
  numberEnd: number;
}

type MotionMode = 0 | 1 | 2 | 3;

interface ParsedMotion {
  mode: MotionMode;
  unit: GCodeUnit;
  start?: Point;
  endpoint: Point;
  centerOffset?: Point;
  xWord?: WordToken;
  yWord?: WordToken;
  iWord?: WordToken;
  jWord?: WordToken;
}

interface ParsedLine {
  text: string;
  ending: string;
  semicolonIndex: number | null;
  motion?: ParsedMotion;
}

interface ParsedProgram {
  lines: ParsedLine[];
  bounds: Bounds;
  unit: GCodeUnit;
}

type ParseResult =
  | { ok: true; program: ParsedProgram }
  | { ok: false; diagnostics: GCodeDiagnostic[] };

interface LexedLine {
  words: WordToken[];
  semicolonIndex: number | null;
}

const NUMBER_PATTERN = /^[+-]?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:[eE][+-]?\d+)?/;
const NON_XY_AXIS_LETTERS = ["Z", "A", "B", "C", "U", "V", "W"] as const;

function diagnostic(line: number, reason: string): ParseResult {
  return { ok: false, diagnostics: [{ line, reason }] };
}

function lexLine(text: string, lineNumber: number): LexedLine | GCodeDiagnostic {
  const words: WordToken[] = [];
  let semicolonIndex: number | null = null;
  let index = 0;

  while (index < text.length) {
    const character = text[index];

    if (character === ";") {
      semicolonIndex = index;
      break;
    }

    if (character === "(") {
      const closingIndex = text.indexOf(")", index + 1);
      if (closingIndex === -1) {
        return {
          line: lineNumber,
          reason: "Unterminated parenthesized comment.",
        };
      }
      index = closingIndex + 1;
      continue;
    }

    if (/\s/.test(character) || character === "%" || character === "/") {
      index += 1;
      continue;
    }

    if (/[A-Za-z]/.test(character)) {
      const letter = character;
      index += 1;
      while (index < text.length && /[ \t]/.test(text[index])) index += 1;
      const numberStart = index;
      const nonFiniteMatch = text
        .slice(index)
        .match(/^[+-]?(?:Infinity|NaN)\b/i);
      if (nonFiniteMatch) {
        return {
          line: lineNumber,
          reason: `Numeric word ${letter.toUpperCase()} must be finite.`,
        };
      }
      const match = text.slice(index).match(NUMBER_PATTERN);
      if (!match) {
        return {
          line: lineNumber,
          reason: `Malformed numeric word ${letter.toUpperCase()}.`,
        };
      }
      const value = Number(match[0]);
      if (!Number.isFinite(value)) {
        return {
          line: lineNumber,
          reason: `Numeric word ${letter.toUpperCase()} must be finite.`,
        };
      }
      index += match[0].length;
      words.push({
        letter,
        upper: letter.toUpperCase(),
        value,
        numberStart,
        numberEnd: index,
      });
      continue;
    }

    return {
      line: lineNumber,
      reason: `Unsupported executable token ${JSON.stringify(character)}.`,
    };
  }

  return { words, semicolonIndex };
}

function splitLines(source: string): Array<{ text: string; ending: string }> {
  const lines: Array<{ text: string; ending: string }> = [];
  const pattern = /([^\r\n]*)(\r\n|\r|\n|$)/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(source)) !== null) {
    if (match[0] === "" && pattern.lastIndex === source.length) break;
    lines.push({ text: match[1], ending: match[2] });
    if (match[2] === "") break;
  }

  return lines.length > 0 ? lines : [{ text: "", ending: "" }];
}

function parseProgram(source: string): ParseResult {
  const lines: ParsedLine[] = [];
  let absolute = false;
  let unit: GCodeUnit | null = null;
  let lastMotionUnit: GCodeUnit | null = null;
  let motionMode: MotionMode | null = null;
  let xyPlane = false;
  let currentX: number | null = null;
  let currentY: number | null = null;
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  let hasMotion = false;
  let hasCoordinateMotion = false;

  const includePoint = (point: Point) => {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  };

  const includeArc = (
    start: Point,
    endpoint: Point,
    centerOffset: Point,
    clockwise: boolean,
  ): boolean => {
    const center = {
      x: start.x + centerOffset.x,
      y: start.y + centerOffset.y,
    };
    const radius = Math.hypot(centerOffset.x, centerOffset.y);
    const startAngle = Math.atan2(start.y - center.y, start.x - center.x);
    const endAngle = Math.atan2(endpoint.y - center.y, endpoint.x - center.x);
    if (
      ![
        center.x,
        center.y,
        radius,
        startAngle,
        endAngle,
      ].every(Number.isFinite)
    ) {
      return false;
    }
    const fullCircle = endpoint.x === start.x && endpoint.y === start.y;

    const extentPoints: Point[] = [start, endpoint];
    const cardinalExtrema = [
      { angle: 0, point: { x: center.x + radius, y: center.y } },
      {
        angle: Math.PI / 2,
        point: { x: center.x, y: center.y + radius },
      },
      { angle: Math.PI, point: { x: center.x - radius, y: center.y } },
      {
        angle: (3 * Math.PI) / 2,
        point: { x: center.x, y: center.y - radius },
      },
    ];
    for (const { angle, point } of cardinalExtrema) {
      if (fullCircle || angleIsOnSweep(angle, startAngle, endAngle, clockwise)) {
        extentPoints.push(point);
      }
    }
    if (
      !extentPoints.every(({ x, y }) =>
        [x, y].every(Number.isFinite),
      )
    ) {
      return false;
    }
    for (const point of extentPoints) includePoint(point);
    return true;
  };

  for (const [lineIndex, sourceLine] of splitLines(source).entries()) {
    const lineNumber = lineIndex + 1;
    const { text } = sourceLine;
    const lexed = lexLine(text, lineNumber);
    if ("reason" in lexed) return { ok: false, diagnostics: [lexed] };

    const wordsByLetter = new Map<string, WordToken[]>();
    for (const word of lexed.words) {
      const existing = wordsByLetter.get(word.upper) ?? [];
      existing.push(word);
      wordsByLetter.set(word.upper, existing);
    }

    for (const letter of ["X", "Y", "I", "J", "R"]) {
      if ((wordsByLetter.get(letter)?.length ?? 0) > 1) {
        return diagnostic(lineNumber, `Multiple ${letter} words in one block.`);
      }
    }

    if ((wordsByLetter.get("O")?.length ?? 0) > 0) {
      return diagnostic(
        lineNumber,
        "O-word subprogram labels are unsupported.",
      );
    }
    const subprogramMCode = (wordsByLetter.get("M") ?? []).find(({ value }) =>
      [97, 98, 99, 198].includes(value),
    );
    if (subprogramMCode) {
      return diagnostic(
        lineNumber,
        `M${formatGCode(subprogramMCode.value)} subprogram execution is unsupported.`,
      );
    }

    const gValues = (wordsByLetter.get("G") ?? []).map(({ value }) => value);
    const motionCodes = gValues.filter((value) =>
      [0, 1, 2, 3].includes(value),
    );
    if (new Set(motionCodes).size > 1) {
      return diagnostic(lineNumber, "Conflicting modal motion G words.");
    }

    const distanceCodes = gValues.filter((value) => value === 90 || value === 91);
    if (new Set(distanceCodes).size > 1) {
      return diagnostic(lineNumber, "Conflicting distance-mode G words.");
    }
    if (gValues.includes(91)) {
      return diagnostic(lineNumber, "G91 incremental distance mode is unsupported.");
    }
    if (gValues.includes(90)) absolute = true;

    const planeCodes = gValues.filter((value) =>
      [17, 18, 19].includes(value),
    );
    if (new Set(planeCodes).size > 1) {
      return diagnostic(lineNumber, "Conflicting plane-selection G words.");
    }
    if (planeCodes[0] === 18 || planeCodes[0] === 19) {
      return diagnostic(
        lineNumber,
        `G${planeCodes[0]} plane selection is unsupported; use G17.`,
      );
    }
    if (planeCodes[0] === 17) xyPlane = true;

    const unitCodes = gValues.filter((value) => value === 20 || value === 21);
    if (new Set(unitCodes).size > 1) {
      return diagnostic(lineNumber, "Conflicting unit-mode G words.");
    }
    const requestedUnit: GCodeUnit | null =
      unitCodes[0] === 20 ? "in" : unitCodes[0] === 21 ? "mm" : null;
    if (requestedUnit && unit && requestedUnit !== unit && hasCoordinateMotion) {
      return diagnostic(
        lineNumber,
        "Unit changes after motion are unsupported because modal XY cannot be mixed safely.",
      );
    }
    if (requestedUnit) unit = requestedUnit;

    const supportedGCodes = new Set([0, 1, 2, 3, 17, 20, 21, 90]);
    const unsupportedGCode = gValues.find(
      (value) => !supportedGCodes.has(value),
    );
    if (unsupportedGCode !== undefined) {
      return diagnostic(
        lineNumber,
        `Unsupported executable G-code G${formatGCode(unsupportedGCode)}.`,
      );
    }

    if (motionCodes.length > 0) motionMode = motionCodes[0] as MotionMode;

    const xWord = wordsByLetter.get("X")?.[0];
    const yWord = wordsByLetter.get("Y")?.[0];
    const iWord = wordsByLetter.get("I")?.[0];
    const jWord = wordsByLetter.get("J")?.[0];
    const rWord = wordsByLetter.get("R")?.[0];
    const hasEndpointWord = Boolean(xWord || yWord);
    const hasArcWord = Boolean(iWord || jWord || rWord);
    const hasNonXyAxisWord = NON_XY_AXIS_LETTERS.some(
      (letter) => (wordsByLetter.get(letter)?.length ?? 0) > 0,
    );
    const isArc = motionMode === 2 || motionMode === 3;
    const hasTransformedMotion = hasEndpointWord || (isArc && hasArcWord);
    const hasCoordinateWords = hasTransformedMotion || hasNonXyAxisWord;
    const parsedLine: ParsedLine = {
      text,
      ending: sourceLine.ending,
      semicolonIndex: lexed.semicolonIndex,
    };

    if (hasArcWord && !isArc) {
      return diagnostic(
        lineNumber,
        "I, J, and R words are supported only for G02/G03 arcs.",
      );
    }

    if (hasCoordinateWords) {
      if (motionMode === null) {
        return diagnostic(
          lineNumber,
          "Motion mode must be established before coordinate motion.",
        );
      }
      if (!absolute) {
        return diagnostic(
          lineNumber,
          "G90 absolute distance mode must be explicit before motion.",
        );
      }
      if (unit === null) {
        return diagnostic(
          lineNumber,
          "G20 or G21 unit mode must be explicit before motion.",
        );
      }
      if (isArc && hasNonXyAxisWord) {
        return diagnostic(
          lineNumber,
          "G02/G03 with a non-XY axis is unsupported.",
        );
      }
      if (isArc && !xyPlane) {
        return diagnostic(
          lineNumber,
          "G17 XY plane must be explicit before an arc.",
        );
      }
      if (isArc && rWord) {
        return diagnostic(lineNumber, "R-word arcs are unsupported; use I/J.");
      }
      hasCoordinateMotion = true;

      if (hasTransformedMotion) {
        if ((xWord ? xWord.value : currentX) === null) {
          return diagnostic(lineNumber, "X position is unknown for this motion.");
        }
        if ((yWord ? yWord.value : currentY) === null) {
          return diagnostic(lineNumber, "Y position is unknown for this motion.");
        }

        const start =
          currentX === null || currentY === null
            ? undefined
            : { x: currentX, y: currentY };
        const endpoint: Point = {
          x: xWord ? xWord.value : (currentX as number),
          y: yWord ? yWord.value : (currentY as number),
        };
        const centerOffset = isArc
          ? { x: iWord?.value ?? 0, y: jWord?.value ?? 0 }
          : undefined;

        if (isArc) {
          if (!start) {
            return diagnostic(lineNumber, "Arc start X/Y position is unknown.");
          }
          const startRadius = Math.hypot(
            centerOffset?.x ?? 0,
            centerOffset?.y ?? 0,
          );
          const center = {
            x: start.x + (centerOffset?.x ?? 0),
            y: start.y + (centerOffset?.y ?? 0),
          };
          const endRadius = Math.hypot(
            endpoint.x - center.x,
            endpoint.y - center.y,
          );
          if (
            ![
              center.x,
              center.y,
              startRadius,
              endpoint.x - center.x,
              endpoint.y - center.y,
              endRadius,
            ].every(Number.isFinite)
          ) {
            return diagnostic(
              lineNumber,
              "Derived arc geometry must remain finite.",
            );
          }
          const tolerance = unit === "in" ? 0.0002 : 0.002;
          if (
            startRadius === 0 ||
            Math.abs(startRadius - endRadius) > tolerance
          ) {
            return diagnostic(
              lineNumber,
              `Arc center-format radii differ by more than ${tolerance.toFixed(
                unit === "in" ? 4 : 3,
              )} ${unit}.`,
            );
          }
          if (
            !includeArc(
              start,
              endpoint,
              centerOffset as Point,
              motionMode === 2,
            )
          ) {
            return diagnostic(
              lineNumber,
              "Derived arc bounds must remain finite.",
            );
          }
        } else {
          if (start) includePoint(start);
          includePoint(endpoint);
        }
        if (![maxX - minX, maxY - minY].every(Number.isFinite)) {
          return diagnostic(
            lineNumber,
            "Derived toolpath bounds span must remain finite.",
          );
        }
        const previewCorners = [
          { x: minX, y: minY },
          { x: minX, y: maxY },
          { x: maxX, y: minY },
          { x: maxX, y: maxY },
        ];
        if (
          !previewCorners.every(({ x, y }) =>
            Number.isFinite(Math.hypot(x, y)),
          )
        ) {
          return diagnostic(
            lineNumber,
            "Derived preview bounds must remain finite under rotation.",
          );
        }
        currentX = endpoint.x;
        currentY = endpoint.y;
        hasMotion = true;
        lastMotionUnit = unit;
        parsedLine.motion = {
          mode: motionMode,
          unit,
          start,
          endpoint,
          centerOffset,
          xWord,
          yWord,
          iWord,
          jWord,
        };
      }
    }

    lines.push(parsedLine);
  }

  if (!hasMotion || lastMotionUnit === null) {
    return diagnostic(1, "No supported XY motion found.");
  }
  if (![minX, minY, maxX, maxY].every(Number.isFinite)) {
    return diagnostic(1, "Derived toolpath bounds must remain finite.");
  }

  return {
    ok: true,
    program: {
      lines,
      bounds: { minX, minY, maxX, maxY },
      unit: lastMotionUnit,
    },
  };
}

function rotatePoint(point: Point, angleDegrees: number): Point {
  let reducedDegrees = angleDegrees % 360;
  if (reducedDegrees < 0) reducedDegrees += 360;
  if (Object.is(reducedDegrees, -0)) reducedDegrees = 0;

  let cosine: number;
  let sine: number;
  if (reducedDegrees === 0) {
    cosine = 1;
    sine = 0;
  } else if (reducedDegrees === 90) {
    cosine = 0;
    sine = 1;
  } else if (reducedDegrees === 180) {
    cosine = -1;
    sine = 0;
  } else if (reducedDegrees === 270) {
    cosine = 0;
    sine = -1;
  } else {
    const radians = (reducedDegrees * Math.PI) / 180;
    cosine = Math.cos(radians);
    sine = Math.sin(radians);
  }

  return {
    x: point.x * cosine - point.y * sine,
    y: point.x * sine + point.y * cosine,
  };
}

function normalizeRadians(value: number): number {
  const fullTurn = Math.PI * 2;
  return ((value % fullTurn) + fullTurn) % fullTurn;
}

function angleIsOnSweep(
  candidate: number,
  start: number,
  end: number,
  clockwise: boolean,
): boolean {
  const sweep = clockwise
    ? normalizeRadians(start - end)
    : normalizeRadians(end - start);
  const candidateSweep = clockwise
    ? normalizeRadians(start - candidate)
    : normalizeRadians(candidate - start);
  return candidateSweep <= sweep;
}

export function rotateBounds(bounds: Bounds, angleDegrees: number): Bounds {
  if (!Number.isFinite(angleDegrees)) {
    throw new RangeError("Rotation angle must be finite.");
  }

  const corners = [
    { x: bounds.minX, y: bounds.minY },
    { x: bounds.minX, y: bounds.maxY },
    { x: bounds.maxX, y: bounds.minY },
    { x: bounds.maxX, y: bounds.maxY },
  ].map((corner) => rotatePoint(corner, angleDegrees));

  return {
    minX: Math.min(...corners.map(({ x }) => x)),
    minY: Math.min(...corners.map(({ y }) => y)),
    maxX: Math.max(...corners.map(({ x }) => x)),
    maxY: Math.max(...corners.map(({ y }) => y)),
  };
}

export function analyzeGCode(_source: string): GCodeAnalysis {
  const parsed = parseProgram(_source);
  if (!parsed.ok) return parsed;

  return {
    ok: true,
    bounds: parsed.program.bounds,
    unit: parsed.program.unit,
  };
}

export function generateRotatedGCode(
  source: string,
  angleDegrees: number,
): GCodeGeneration {
  if (!Number.isFinite(angleDegrees)) {
    return {
      ok: false,
      diagnostics: [{ line: 1, reason: "Rotation angle must be finite." }],
    };
  }

  const parsed = parseProgram(source);
  if (!parsed.ok) return parsed;

  const output = parsed.program.lines
    .map((line) => {
      if (!line.motion) return line.text + line.ending;
      const rotated = rotatePoint(line.motion.endpoint, angleDegrees);
      const precision = line.motion.unit === "in" ? 5 : 4;
      const replacements = [
        line.motion.xWord
          ? {
              start: line.motion.xWord.numberStart,
              end: line.motion.xWord.numberEnd,
              text: formatCoordinate(rotated.x, precision),
            }
          : null,
        line.motion.yWord
          ? {
              start: line.motion.yWord.numberStart,
              end: line.motion.yWord.numberEnd,
              text: formatCoordinate(rotated.y, precision),
            }
          : null,
      ].filter((replacement) => replacement !== null);

      const missingWords: string[] = [];
      if (!line.motion.xWord) {
        missingWords.push(`X${formatCoordinate(rotated.x, precision)}`);
      }
      if (!line.motion.yWord) {
        missingWords.push(`Y${formatCoordinate(rotated.y, precision)}`);
      }
      if (line.motion.centerOffset) {
        const rotatedOffset = rotatePoint(
          line.motion.centerOffset,
          angleDegrees,
        );
        if (line.motion.iWord) {
          replacements.push({
            start: line.motion.iWord.numberStart,
            end: line.motion.iWord.numberEnd,
            text: formatCoordinate(rotatedOffset.x, precision),
          });
        } else {
          missingWords.push(`I${formatCoordinate(rotatedOffset.x, precision)}`);
        }
        if (line.motion.jWord) {
          replacements.push({
            start: line.motion.jWord.numberStart,
            end: line.motion.jWord.numberEnd,
            text: formatCoordinate(rotatedOffset.y, precision),
          });
        } else {
          missingWords.push(`J${formatCoordinate(rotatedOffset.y, precision)}`);
        }
      }
      if (missingWords.length > 0) {
        replacements.push(createInsertion(line, missingWords));
      }

      let transformed = line.text;
      for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
        transformed =
          transformed.slice(0, replacement.start) +
          replacement.text +
          transformed.slice(replacement.end);
      }

      return transformed + line.ending;
    })
    .join("");

  const validated = parseProgram(output);
  if (!validated.ok) return validated;

  for (const [lineIndex, sourceLine] of parsed.program.lines.entries()) {
    const sourceMotion = sourceLine.motion;
    const formattedMotion = validated.program.lines[lineIndex]?.motion;
    if (
      sourceMotion?.start &&
      sourceMotion.centerOffset &&
      formattedMotion?.start &&
      formattedMotion.centerOffset
    ) {
      const sourceEndpointsCoincide =
        sourceMotion.start.x === sourceMotion.endpoint.x &&
        sourceMotion.start.y === sourceMotion.endpoint.y;
      const formattedEndpointsCoincide =
        formattedMotion.start.x === formattedMotion.endpoint.x &&
        formattedMotion.start.y === formattedMotion.endpoint.y;
      if (sourceEndpointsCoincide !== formattedEndpointsCoincide) {
        return {
          ok: false,
          diagnostics: [
            {
              line: lineIndex + 1,
              reason:
                "Formatted arc topology changed because endpoint coincidence changed.",
            },
          ],
        };
      }
    }
  }

  return {
    ok: true,
    output,
    bounds: validated.program.bounds,
    unit: validated.program.unit,
  };
}

function formatCoordinate(value: number, precision: number): string {
  const zeroThreshold = 0.5 * 10 ** -precision;
  const normalized = Math.abs(value) < zeroThreshold ? 0 : value;
  const fixed = normalized.toFixed(precision);
  if (!/[eE]/.test(fixed)) return fixed;

  const sign = normalized < 0 ? "-" : "";
  const [coefficient, exponentText] = Math.abs(normalized)
    .toString()
    .toLowerCase()
    .split("e");
  const exponent = Number(exponentText);
  const [whole, fraction = ""] = coefficient.split(".");
  const digits = whole + fraction;
  const decimalIndex = whole.length + exponent;
  const integer =
    decimalIndex >= digits.length
      ? digits + "0".repeat(decimalIndex - digits.length)
      : `${digits.slice(0, decimalIndex)}.${digits.slice(decimalIndex)}`;

  return `${sign}${integer}.${"0".repeat(precision)}`;
}

function formatGCode(value: number): string {
  return Number.isInteger(value) ? String(value) : String(value);
}

function createInsertion(
  line: ParsedLine,
  words: string[],
): { start: number; end: number; text: string } {
  let insertionIndex = line.semicolonIndex ?? line.text.length;
  while (insertionIndex > 0 && /[ \t]/.test(line.text[insertionIndex - 1])) {
    insertionIndex -= 1;
  }
  const prefix = insertionIndex > 0 ? " " : "";
  return {
    start: insertionIndex,
    end: insertionIndex,
    text: prefix + words.join(" "),
  };
}
