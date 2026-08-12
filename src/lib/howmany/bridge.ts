import type { GCodeUnit } from "../gcodeRotation";
import { parseNumericInput } from "../numericInput";
import type { Margins, NestInputs, Unit } from "../types";
import { convertValue, round3 } from "../units";

type InputKey = keyof Pick<
  NestInputs,
  | "partWidth"
  | "partHeight"
  | "remnantWidth"
  | "remnantHeight"
  | "gapX"
  | "gapY"
>;

export type ShellFieldBinding =
  | { kind: "input"; key: InputKey }
  | { kind: "margin"; key: keyof Margins };

const FIELD_BINDINGS: Record<string, ShellFieldBinding> = {
  "part-x": { kind: "input", key: "partWidth" },
  "part-y": { kind: "input", key: "partHeight" },
  "rem-x": { kind: "input", key: "remnantWidth" },
  "rem-y": { kind: "input", key: "remnantHeight" },
  "gap-x": { kind: "input", key: "gapX" },
  "gap-y": { kind: "input", key: "gapY" },
  "m-left": { kind: "margin", key: "left" },
  "m-right": { kind: "margin", key: "right" },
  "m-top": { kind: "margin", key: "top" },
  "m-bottom": { kind: "margin", key: "bottom" },
};

export function fieldBindingForId(id: string): ShellFieldBinding | null {
  return FIELD_BINDINGS[id] ?? null;
}

export function formatShellNumber(value: number | null): string {
  if (value === null) return "";
  return `${round3(value)}`;
}

export function formatMarginBadge(margins: Margins): string {
  return [
    `L${formatShellNumber(margins.left)}`,
    `R${formatShellNumber(margins.right)}`,
    `B${formatShellNumber(margins.bottom)}`,
    `T${formatShellNumber(margins.top)}`,
  ].join(" ");
}

export function normalizeQuickValue(raw: string): string | null {
  const value = raw.trim();
  if (!/^(?:\d+|\d*\.\d{0,3})$/.test(value) || value === ".") return null;

  const [integer, fraction] = value.split(".");
  if (fraction === undefined || fraction === "") return `${Number(integer)}`;
  return `${integer === "" ? "0" : Number(integer)}.${fraction}`;
}

export function shouldPreserveNumericDraft(
  draft: string,
  persistedValue: number | null,
): boolean {
  return parseNumericInput(draft) === persistedValue;
}

export interface ShellDecimalEdit {
  value: string;
  caret: number;
}

export function insertShellDecimal(
  value: string,
  selectionStart: number | null,
  selectionEnd: number | null,
  typingFresh: boolean,
): ShellDecimalEdit | null {
  if (typingFresh) return { value: "0.", caret: 2 };

  const start = selectionStart ?? value.length;
  const end = selectionEnd ?? start;
  const next = `${value.slice(0, start)}.${value.slice(end)}`;
  if ((next.match(/\./g) ?? []).length > 1) return null;
  return { value: next, caret: start + 1 };
}

interface PresetCarouselInput {
  count: number;
  selectedIndex: number;
  visibleCount: number;
  requestedPage: number;
}

export interface PresetCarouselState {
  page: number;
  maxPage: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export function derivePresetCarousel({
  count,
  selectedIndex,
  visibleCount,
  requestedPage,
}: PresetCarouselInput): PresetCarouselState {
  const safeVisibleCount = Math.max(1, Math.floor(visibleCount));
  const maxPage = Math.max(0, Math.ceil(Math.max(0, count) / safeVisibleCount) - 1);
  const selectedPage =
    selectedIndex >= 0 ? Math.floor(selectedIndex / safeVisibleCount) : requestedPage;
  const page = Math.min(maxPage, Math.max(0, selectedPage));

  return {
    page,
    maxPage,
    canGoPrevious: page > 0,
    canGoNext: page < maxPage,
  };
}

export function nextPresetIndex(
  currentIndex: number,
  count: number,
  direction: -1 | 1,
): number {
  if (count <= 0) return -1;
  const startingIndex = currentIndex >= 0 ? currentIndex : direction === 1 ? -1 : 0;
  return (startingIndex + direction + count) % count;
}

export interface PartSize {
  width: number;
  height: number;
}

export function displayGCodeSize(
  size: PartSize,
  sourceUnit: GCodeUnit,
  displayUnit: Unit,
): PartSize {
  if (sourceUnit === "unknown" || sourceUnit === displayUnit) return size;
  return {
    width: convertValue(size.width, sourceUnit, displayUnit),
    height: convertValue(size.height, sourceUnit, displayUnit),
  };
}

export interface GenerationIdentity {
  source: string;
  angle: number;
}

export function generationIsFresh(
  generation: GenerationIdentity | null,
  source: string,
  angle: number,
): boolean {
  return generation?.source === source && generation.angle === angle;
}
