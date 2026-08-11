import type { GCodeUnit } from "../gcodeRotation";
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
