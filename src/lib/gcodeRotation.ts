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

export type GCodeUnit = "in" | "mm" | "unknown";

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
  rawNumber: string;
  numberStart: number;
  numberEnd: number;
}

type MotionMode = 0 | 1 | 2 | 3;

interface TargetCandidate {
  letter: string;
  nonFinite: boolean;
}

interface LexedLine {
  words: WordToken[];
  bareLetters: string[];
  targetCandidates: TargetCandidate[];
  executableEnd: number;
}

interface ParsedMotion {
  mode: MotionMode;
  unit: GCodeUnit;
  start: Point | null;
  endpoint: Point;
  centerOffset?: Point;
  xWords: WordToken[];
  yWords: WordToken[];
  iWords: WordToken[];
  jWords: WordToken[];
  transformedArc: boolean;
  insertMissingX: boolean;
  insertMissingY: boolean;
  executableEnd: number;
}

interface ParsedLine {
  text: string;
  ending: string;
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

interface LinePart {
  text: string;
  ending: string;
}

interface Replacement {
  start: number;
  end: number;
  text: string;
}

const NUMBER_PATTERN = /^[+-]?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:[eE][+-]?\d+)?/;
const NON_FINITE_NUMBER_PATTERN = /^[+-]?(?:Infinity|NaN)\b/i;
const TARGET_LETTERS = new Set(["X", "Y", "I", "J"]);
const MODAL_BLOCK_LETTERS = new Set([
  "N",
  "G",
  "X",
  "Y",
  "I",
  "J",
  "F",
  "S",
  "T",
]);
const MODAL_BLOCK_G_CODES = new Set([0, 1, 2, 3, 17, 20, 21, 90]);
const ORTHOGONAL_DEGREES = new Set([0, 90, 180, 270]);

function diagnostic(line: number, reason: string): ParseResult {
  return { ok: false, diagnostics: [{ line, reason }] };
}

function isLetter(character: string | undefined): boolean {
  return character !== undefined && /[A-Za-z]/.test(character);
}

function isTargetBoundary(text: string, index: number): boolean {
  if (index === 0) return true;
  const previous = text[index - 1];
  return /\s/.test(previous) || /[0-9.+-]/.test(previous);
}

function scanLine(text: string): LexedLine {
  const words: WordToken[] = [];
  const bareLetters: string[] = [];
  const targetCandidates: TargetCandidate[] = [];
  let executableEnd = text.length;
  let index = 0;

  while (index < text.length) {
    const character = text[index];

    // ACS and shop-floor programs use both semicolon and exclamation comments.
    // Parenthesized comments are opaque as well. The first opaque region marks
    // the only safe insertion boundary for a reconstructed endpoint pair.
    if (character === ";" || character === "!" || character === "(") {
      executableEnd = index;
      break;
    }

    if (!isLetter(character)) {
      index += 1;
      continue;
    }

    const letterIndex = index;
    const letter = character;
    const upper = letter.toUpperCase();
    index += 1;
    while (index < text.length && /[ \t]/.test(text[index])) index += 1;

    const numberStart = index;
    const nonFiniteMatch = text.slice(index).match(NON_FINITE_NUMBER_PATTERN);
    const numberMatch = text.slice(index).match(NUMBER_PATTERN);

    if (nonFiniteMatch) {
      if (TARGET_LETTERS.has(upper) && isTargetBoundary(text, letterIndex)) {
        targetCandidates.push({ letter: upper, nonFinite: true });
      }
      index += nonFiniteMatch[0].length;
      continue;
    }

    if (numberMatch) {
      const rawNumber = numberMatch[0];
      const numberEnd = numberStart + rawNumber.length;
      const value = Number(rawNumber);
      if (!Number.isFinite(value)) {
        if (TARGET_LETTERS.has(upper) && isTargetBoundary(text, letterIndex)) {
          targetCandidates.push({ letter: upper, nonFinite: true });
        }
        index = numberEnd;
        continue;
      }
      words.push({
        letter,
        upper,
        value,
        rawNumber,
        numberStart,
        numberEnd,
      });
      index = numberEnd;
      continue;
    }

    if (TARGET_LETTERS.has(upper) && isTargetBoundary(text, letterIndex)) {
      targetCandidates.push({ letter: upper, nonFinite: false });
    } else {
      bareLetters.push(upper);
    }
    index = letterIndex + 1;
  }

  return { words, bareLetters, targetCandidates, executableEnd };
}

function splitLines(source: string): LinePart[] {
  const lines: LinePart[] = [];
  const pattern = /([^\r\n]*)(\r\n|\r|\n|$)/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(source)) !== null) {
    if (match[0] === "" && pattern.lastIndex === source.length) break;
    lines.push({ text: match[1], ending: match[2] });
    if (match[2] === "") break;
  }

  return lines.length > 0 ? lines : [{ text: "", ending: "" }];
}

function valuesFor(words: WordToken[], letter: string): WordToken[] {
  return words.filter((word) => word.upper === letter);
}

function lastWord(words: WordToken[]): WordToken | undefined {
  return words.at(-1);
}

function isSafeModalBlock(lexed: LexedLine): boolean {
  if (lexed.bareLetters.length > 0) return false;
  if (lexed.words.some((word) => !MODAL_BLOCK_LETTERS.has(word.upper))) {
    return false;
  }

  return lexed.words
    .filter((word) => word.upper === "G")
    .every((word) => MODAL_BLOCK_G_CODES.has(word.value));
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

function parseProgram(source: string): ParseResult {
  const lines: ParsedLine[] = [];
  let activeMotion: MotionMode | null = null;
  let unit: GCodeUnit = "unknown";
  let current: Point | null = null;
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  let hasMotion = false;
  let lastMotionUnit: GCodeUnit | null = null;

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
  ) => {
    includePoint(start);
    includePoint(endpoint);

    const center = {
      x: start.x + centerOffset.x,
      y: start.y + centerOffset.y,
    };
    const radius = Math.hypot(centerOffset.x, centerOffset.y);
    if (
      ![
        center.x,
        center.y,
        radius,
        start.x,
        start.y,
        endpoint.x,
        endpoint.y,
      ].every(Number.isFinite)
    ) {
      return;
    }

    if (radius === 0) return;

    const startAngle = Math.atan2(start.y - center.y, start.x - center.x);
    const endAngle = Math.atan2(endpoint.y - center.y, endpoint.x - center.x);
    const fullCircle = endpoint.x === start.x && endpoint.y === start.y;
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
        includePoint(point);
      }
    }
  };

  for (const [lineIndex, sourceLine] of splitLines(source).entries()) {
    const lineNumber = lineIndex + 1;
    const lexed = scanLine(sourceLine.text);
    const gWords = valuesFor(lexed.words, "G");

    if (gWords.some((word) => word.value === 53)) {
      return diagnostic(
        lineNumber,
        "G53 machine-coordinate motion is unsupported.",
      );
    }

    const motionWords = gWords.filter((word) =>
      [0, 1, 2, 3].includes(word.value),
    );
    const explicitMotion = lastWord(motionWords);
    if (explicitMotion) activeMotion = explicitMotion.value as MotionMode;

    for (const gWord of gWords) {
      if (gWord.value === 20) unit = "in";
      if (gWord.value === 21) unit = "mm";
    }

    const xWords = valuesFor(lexed.words, "X");
    const yWords = valuesFor(lexed.words, "Y");
    const iWords = valuesFor(lexed.words, "I");
    const jWords = valuesFor(lexed.words, "J");
    const hasCoordinateWords =
      xWords.length > 0 ||
      yWords.length > 0 ||
      iWords.length > 0 ||
      jWords.length > 0;

    if (explicitMotion && lexed.targetCandidates.length > 0) {
      const firstCandidate = lexed.targetCandidates[0];
      return diagnostic(
        lineNumber,
        firstCandidate.nonFinite
          ? `Numeric word ${firstCandidate.letter} must be finite.`
          : `Malformed numeric word ${firstCandidate.letter}.`,
      );
    }

    // An explicit G00-G03 always marks a transformable motion block. A
    // coordinate-only block is accepted only when it looks like a normal
    // modal block; this keeps ACS calls and ptp/ev expressions pass-through.
    const mode = explicitMotion
      ? (explicitMotion.value as MotionMode)
      : activeMotion !== null && isSafeModalBlock(lexed)
        ? activeMotion
        : null;

    const isArc = mode === 2 || mode === 3;
    const hasTransformableWords =
      xWords.length > 0 ||
      yWords.length > 0 ||
      (isArc && (iWords.length > 0 || jWords.length > 0));
    const parsedLine: ParsedLine = {
      text: sourceLine.text,
      ending: sourceLine.ending,
    };

    if (mode !== null && hasCoordinateWords && hasTransformableWords) {
      const start = current ? { ...current } : null;
      if (isArc && start === null) {
        return diagnostic(
          lineNumber,
          "Arc start X/Y must be known before transforming.",
        );
      }

      const xValue = lastWord(xWords)?.value ?? current?.x;
      const yValue = lastWord(yWords)?.value ?? current?.y;
      if (xValue === undefined || yValue === undefined) {
        return diagnostic(
          lineNumber,
          "Modal X/Y endpoint is incomplete before transformed motion.",
        );
      }

      const endpoint: Point = { x: xValue, y: yValue };
      const centerOffset =
        isArc && (iWords.length > 0 || jWords.length > 0)
          ? {
              x: lastWord(iWords)?.value ?? 0,
              y: lastWord(jWords)?.value ?? 0,
            }
          : undefined;

      if (start) includePoint(start);
      includePoint(endpoint);
      if (isArc && centerOffset && start) {
        includeArc(start, endpoint, centerOffset, mode === 2);
      }

      if (xWords.length > 0 || yWords.length > 0) current = endpoint;
      hasMotion = true;
      lastMotionUnit = unit;
      parsedLine.motion = {
        mode,
        unit,
        start,
        endpoint,
        centerOffset,
        xWords,
        yWords,
        iWords,
        jWords,
        transformedArc: isArc && centerOffset !== undefined,
        insertMissingX: xWords.length === 0,
        insertMissingY: yWords.length === 0,
        executableEnd: lexed.executableEnd,
      };
    }

    lines.push(parsedLine);
  }

  if (!hasMotion) return diagnostic(1, "No supported XY motion found.");
  if (![minX, minY, maxX, maxY].every(Number.isFinite)) {
    return diagnostic(1, "Derived toolpath bounds must remain finite.");
  }

  return {
    ok: true,
    program: {
      lines,
      bounds: { minX, minY, maxX, maxY },
      unit: lastMotionUnit ?? unit,
    },
  };
}

function normalizedDegrees(angleDegrees: number): number {
  let reducedDegrees = angleDegrees % 360;
  if (reducedDegrees < 0) reducedDegrees += 360;
  return Object.is(reducedDegrees, -0) ? 0 : reducedDegrees;
}

function rotatePoint(point: Point, angleDegrees: number): Point {
  const reducedDegrees = normalizedDegrees(angleDegrees);
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

function formatFixed(value: number, precision: number): string {
  const safePrecision = Math.min(100, Math.max(0, Math.trunc(precision)));
  const zeroThreshold = 0.5 * 10 ** -safePrecision;
  const normalized =
    Math.abs(value) < zeroThreshold || Object.is(value, -0) ? 0 : value;
  const fixed = normalized.toFixed(safePrecision);
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
  let integer: string;
  let fractional: string;

  if (decimalIndex <= 0) {
    integer = "0";
    fractional = `${"0".repeat(-decimalIndex)}${digits}`;
  } else if (decimalIndex >= digits.length) {
    integer = `${digits}${"0".repeat(decimalIndex - digits.length)}`;
    fractional = "";
  } else {
    integer = digits.slice(0, decimalIndex);
    fractional = digits.slice(decimalIndex);
  }

  if (safePrecision === 0) return `${sign}${integer}`;
  return `${sign}${integer}.${fractional.padEnd(safePrecision, "0").slice(0, safePrecision)}`;
}

function sourceFractionDigits(rawNumber: string): number {
  const [mantissa, exponentText = "0"] = rawNumber.toLowerCase().split("e");
  const decimalIndex = mantissa.indexOf(".");
  const mantissaDigits =
    decimalIndex === -1 ? 0 : mantissa.length - decimalIndex - 1;
  const exponent = Number(exponentText);
  return Number.isFinite(exponent)
    ? Math.max(0, mantissaDigits - exponent)
    : mantissaDigits;
}

function maximumSourcePrecision(words: WordToken[]): number {
  return words.reduce(
    (maximum, word) => Math.max(maximum, sourceFractionDigits(word.rawNumber)),
    0,
  );
}

function requiredMagnitudePrecision(value: number): number {
  const magnitude = Math.abs(value);
  if (!Number.isFinite(magnitude) || magnitude === 0 || magnitude >= 1) {
    return 0;
  }
  return Math.max(0, Math.ceil(-Math.log10(magnitude)));
}

function formatCoordinate(
  value: number,
  rawNumber: string,
  unit: GCodeUnit,
  angleDegrees: number,
  minimumPrecision = 0,
): string {
  if (!Number.isFinite(value)) return String(value);
  if (normalizedDegrees(angleDegrees) === 0) return rawNumber;

  const reducedDegrees = normalizedDegrees(angleDegrees);
  const sourcePrecision = sourceFractionDigits(rawNumber);
  const magnitudePrecision = requiredMagnitudePrecision(value);
  const precision =
    unit === "in"
      ? 5
      : unit === "mm"
        ? 4
        : ORTHOGONAL_DEGREES.has(reducedDegrees)
          ? Math.max(minimumPrecision, sourcePrecision, magnitudePrecision)
          : Math.max(
              6,
              minimumPrecision,
              sourcePrecision,
              magnitudePrecision,
            );
  return formatFixed(value, precision);
}

function formatInsertedCoordinate(
  value: number,
  unit: GCodeUnit,
  angleDegrees: number,
  minimumPrecision: number,
): string {
  const reducedDegrees = normalizedDegrees(angleDegrees);
  const precision =
    unit === "in"
      ? 5
      : unit === "mm"
        ? 4
        : ORTHOGONAL_DEGREES.has(reducedDegrees)
          ? Math.max(minimumPrecision, requiredMagnitudePrecision(value))
          : Math.max(6, minimumPrecision, requiredMagnitudePrecision(value));
  return formatFixed(value, precision);
}

function arcRadii(
  motion: ParsedMotion,
): { start: number; end: number } | null {
  if (!motion.start || !motion.centerOffset) return null;

  const center = {
    x: motion.start.x + motion.centerOffset.x,
    y: motion.start.y + motion.centerOffset.y,
  };
  const startRadius = Math.hypot(
    motion.centerOffset.x,
    motion.centerOffset.y,
  );
  const endRadius = Math.hypot(
    motion.endpoint.x - center.x,
    motion.endpoint.y - center.y,
  );

  if (![center.x, center.y, startRadius, endRadius].every(Number.isFinite)) {
    return null;
  }
  return { start: startRadius, end: endRadius };
}

function radiusTolerance(unit: GCodeUnit): number {
  return unit === "mm" ? 0.002 : 0.0002;
}

function insertionStart(text: string, executableEnd: number): number {
  let index = executableEnd;
  while (index > 0 && /\s/.test(text[index - 1])) index -= 1;
  return index;
}

export interface PartSize {
  width: number;
  height: number;
}

export function partSizeFromBounds(bounds: Bounds): PartSize | null {
  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;

  if (![width, height].every((span) => Number.isFinite(span) && span >= 0)) {
    return null;
  }

  return { width, height };
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

export function analyzeGCode(source: string): GCodeAnalysis {
  const parsed = parseProgram(source);
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

      const motion = line.motion;
      const rotatedEndpoint = rotatePoint(motion.endpoint, angleDegrees);
      const replacements: Replacement[] = [];
      const unknownArcPrecision =
        motion.transformedArc && motion.unit === "unknown" ? 6 : 0;
      const unknownEndpointPrecision =
        motion.unit === "unknown"
          ? Math.max(
              unknownArcPrecision,
              maximumSourcePrecision([...motion.xWords, ...motion.yWords]),
            )
          : 0;
      const unknownVectorPrecision =
        motion.unit === "unknown"
          ? Math.max(
              unknownArcPrecision,
              maximumSourcePrecision([...motion.iWords, ...motion.jWords]),
            )
          : 0;

      for (const word of motion.xWords) {
        replacements.push({
          start: word.numberStart,
          end: word.numberEnd,
          text: formatCoordinate(
            rotatedEndpoint.x,
            word.rawNumber,
            motion.unit,
            angleDegrees,
            unknownEndpointPrecision,
          ),
        });
      }
      for (const word of motion.yWords) {
        replacements.push({
          start: word.numberStart,
          end: word.numberEnd,
          text: formatCoordinate(
            rotatedEndpoint.y,
            word.rawNumber,
            motion.unit,
            angleDegrees,
            unknownEndpointPrecision,
          ),
        });
      }

      if (motion.centerOffset) {
        const rotatedOffset = rotatePoint(motion.centerOffset, angleDegrees);
        for (const word of motion.iWords) {
          replacements.push({
            start: word.numberStart,
            end: word.numberEnd,
            text: formatCoordinate(
              rotatedOffset.x,
              word.rawNumber,
              motion.unit,
              angleDegrees,
              unknownVectorPrecision,
            ),
          });
        }
        for (const word of motion.jWords) {
          replacements.push({
            start: word.numberStart,
            end: word.numberEnd,
            text: formatCoordinate(
              rotatedOffset.y,
              word.rawNumber,
              motion.unit,
              angleDegrees,
              unknownVectorPrecision,
            ),
          });
        }
      }

      if (motion.insertMissingX || motion.insertMissingY) {
        const start = insertionStart(line.text, motion.executableEnd);
        const prefix = line.text.slice(0, start);
        const missingWords: string[] = [];
        if (motion.insertMissingX) {
          missingWords.push(
            `X${formatInsertedCoordinate(
              rotatedEndpoint.x,
              motion.unit,
              angleDegrees,
              unknownEndpointPrecision,
            )}`,
          );
        }
        if (motion.insertMissingY) {
          missingWords.push(
            `Y${formatInsertedCoordinate(
              rotatedEndpoint.y,
              motion.unit,
              angleDegrees,
              unknownEndpointPrecision,
            )}`,
          );
        }
        const separator = prefix.length > 0 && !/\s/.test(prefix.at(-1) ?? "")
          ? " "
          : "";
        replacements.push({
          start,
          end: start,
          text: separator + missingWords.join(" "),
        });
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

  const formatted = parseProgram(output);
  if (!formatted.ok) return formatted;

  for (const [lineIndex, sourceLine] of parsed.program.lines.entries()) {
    const sourceMotion = sourceLine.motion;
    if (!sourceMotion?.transformedArc) continue;

    const formattedMotion = formatted.program.lines[lineIndex]?.motion;
    const radii = formattedMotion ? arcRadii(formattedMotion) : null;
    if (!radii || !formattedMotion) {
      return {
        ok: false,
        diagnostics: [
          {
            line: lineIndex + 1,
            reason:
              "Transformed center-format arc radii could not be verified.",
          },
        ],
      };
    }

    if (Math.abs(radii.start - radii.end) > radiusTolerance(formattedMotion.unit)) {
      return {
        ok: false,
        diagnostics: [
          {
            line: lineIndex + 1,
            reason:
              "Transformed center-format arc radii differ beyond the active tolerance.",
          },
        ],
      };
    }
  }

  return {
    ok: true,
    output,
    bounds: formatted.program.bounds,
    unit: formatted.program.unit,
  };
}
