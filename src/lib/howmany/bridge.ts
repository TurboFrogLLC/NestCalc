import type { GCodeUnit } from "../gcodeRotation";
import { parseNumericInput } from "../numericInput";
import { clearedInputs } from "../nestcalc";
import { createHowManyNestSession } from "../nestSession";
import type { Margins, NestInputs, NestResult, Unit } from "../types";
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

export const HOWMANY_COUNT_ID = "lb-count";

export interface HowManyCountDocument {
  getElementById(id: string): { value?: string; textContent: string | null } | null;
}

function shellFieldValue(
  el: { value?: string; textContent?: string | null } | null,
): string {
  if (!el) return "";
  if (typeof el.value === "string") return el.value;
  return el.textContent ?? "";
}

export function nestInputsFromShellFields(
  values: Record<string, string>,
  fieldUnit: Unit = "in",
  sessionUnit: Unit = "in",
): NestInputs {
  const inputs = clearedInputs(sessionUnit);
  const margins = { ...inputs.margins };

  for (const [id, binding] of Object.entries(FIELD_BINDINGS)) {
    const parsed = committedShellNumericValue(values[id] ?? "");
    const converted =
      parsed === null ? null : convertValue(parsed, fieldUnit, sessionUnit);
    if (binding.kind === "input") {
      inputs[binding.key] = converted;
    } else {
      margins[binding.key] = converted;
    }
  }

  return { ...inputs, margins };
}

export function joinHowManyCountFromFields(
  values: Record<string, string>,
  fieldUnit: Unit = "in",
  sessionUnit: Unit = "in",
): number {
  return joinHowManyNestResultFromFields(values, fieldUnit, sessionUnit).totalParts;
}

export function joinHowManyNestResultFromFields(
  values: Record<string, string>,
  fieldUnit: Unit = "in",
  sessionUnit: Unit = "in",
): NestResult {
  const session = createHowManyNestSession(
    nestInputsFromShellFields(values, fieldUnit, sessionUnit),
  );
  return session.result.mode === "manual"
    ? session.result.manual
    : session.manual.result;
}

export function joinHowManyCount(
  doc: HowManyCountDocument,
  fieldUnit: Unit = "in",
  sessionUnit: Unit = "in",
): number {
  const values: Record<string, string> = {};
  for (const id of Object.keys(FIELD_BINDINGS)) {
    values[id] = shellFieldValue(doc.getElementById(id));
  }
  const totalParts = joinHowManyCountFromFields(values, fieldUnit, sessionUnit);
  const count = doc.getElementById(HOWMANY_COUNT_ID);
  if (count) count.textContent = String(totalParts);
  return totalParts;
}

export function formatShellNumber(value: number | null): string {
  if (value === null) return "";
  return `${round3(value)}`;
}

export function sanitizeShellNumericDraft(value: string): string {
  let sanitized = "";
  let hasDecimal = false;

  for (const character of value) {
    if (character >= "0" && character <= "9") {
      sanitized += character;
      continue;
    }
    if (character === "." && !hasDecimal) {
      sanitized += character;
      hasDecimal = true;
    }
  }

  return sanitized;
}

export function quickValueDraft(
  currentValue: string,
  quickValue: string,
): string {
  if (currentValue.includes(".")) return currentValue;

  const current = sanitizeShellNumericDraft(currentValue);
  const quick = sanitizeShellNumericDraft(quickValue);
  if (current !== currentValue || !/^\d*$/.test(current)) return currentValue;
  if (!/^\d*\.\d+$/.test(quick) || !Number.isFinite(Number(quick))) {
    return currentValue;
  }

  const fraction = quick.slice(quick.indexOf("."));
  return `${current}${fraction}`;
}

export function committedShellNumericValue(value: string): number | null {
  const parsed = parseNumericInput(value);
  return parsed !== null && Number.isFinite(parsed) ? parsed : null;
}

export function normalizeShellDialogName(value: string): string {
  return value.trim().slice(0, 24);
}

export function marginsBadgeText(margins: Margins): string {
  const display = (value: number | null) =>
    value === null ? "—" : formatShellNumber(value);
  return `L${display(margins.left)} R${display(margins.right)} B${display(
    margins.bottom,
  )} T${display(margins.top)}`;
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
