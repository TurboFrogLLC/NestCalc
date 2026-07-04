import { calculateNest, clearedInputs, rotateMarginsCW } from "./nestcalc";
import type { Margins, NestInputs, NestResult, Unit } from "./types";
import { convertValue } from "./units";

type NumericField =
  | "partWidth"
  | "partHeight"
  | "remnantWidth"
  | "remnantHeight"
  | "gapX"
  | "gapY";

export interface ManualNestSession {
  inputs: NestInputs;
  result: NestResult;
}

function convertNullableValue(
  value: number | null,
  from: Unit,
  to: Unit,
): number | null {
  return value === null ? null : convertValue(value, from, to);
}

function linkValues(
  x: number | null,
  y: number | null,
): { x: number | null; y: number | null } {
  if (x === null && y === null) return { x: null, y: null };
  if (x === null) return { x: y, y };
  if (y === null) return { x, y: x };
  return { x, y: x };
}

function swapValues(
  x: number | null,
  y: number | null,
): { x: number | null; y: number | null } {
  return { x: y, y: x };
}

export function createManualNestSession(
  inputs: NestInputs,
): ManualNestSession {
  return {
    inputs,
    result: calculateNest(inputs),
  };
}

export function calculateManualNest(inputs: NestInputs): NestResult {
  return calculateNest(inputs);
}

export function updateManualField(
  inputs: NestInputs,
  field: NumericField,
  value: number | null,
): NestInputs {
  if (inputs.partLinked && (field === "partWidth" || field === "partHeight")) {
    return {
      ...inputs,
      partWidth: value,
      partHeight: value,
    };
  }

  if (inputs.gapLinked && (field === "gapX" || field === "gapY")) {
    return {
      ...inputs,
      gapX: value,
      gapY: value,
    };
  }

  return {
    ...inputs,
    [field]: value,
  };
}

export function updateManualMargin(
  inputs: NestInputs,
  key: keyof Margins,
  value: number | null,
): NestInputs {
  return {
    ...inputs,
    margins: { ...inputs.margins, [key]: value },
  };
}

export function clearManualInputs(inputs: NestInputs): NestInputs {
  return clearedInputs(inputs.unit);
}

export function rotateManualPart(inputs: NestInputs): NestInputs {
  return {
    ...inputs,
    partWidth: inputs.partHeight,
    partHeight: inputs.partWidth,
  };
}

export function rotateManualRemnant(inputs: NestInputs): NestInputs {
  return {
    ...inputs,
    remnantWidth: inputs.remnantHeight,
    remnantHeight: inputs.remnantWidth,
    gapX: inputs.gapY,
    gapY: inputs.gapX,
    margins: inputs.moveMarginsWithRotation
      ? rotateMarginsCW(inputs.margins)
      : inputs.margins,
  };
}

export function toggleManualPartLink(inputs: NestInputs): NestInputs {
  if (inputs.partLinked) {
    return { ...inputs, partLinked: false };
  }

  const linked = linkValues(inputs.partWidth, inputs.partHeight);
  return {
    ...inputs,
    partWidth: linked.x,
    partHeight: linked.y,
    partLinked: true,
  };
}

export function toggleManualGapLink(inputs: NestInputs): NestInputs {
  if (inputs.gapLinked) {
    return { ...inputs, gapLinked: false };
  }

  const linked = linkValues(inputs.gapX, inputs.gapY);
  return {
    ...inputs,
    gapX: linked.x,
    gapY: linked.y,
    gapLinked: true,
  };
}

export function swapManualPart(inputs: NestInputs): NestInputs {
  const swapped = swapValues(inputs.partWidth, inputs.partHeight);
  return {
    ...inputs,
    partWidth: swapped.x,
    partHeight: swapped.y,
  };
}

export function swapManualGap(inputs: NestInputs): NestInputs {
  const swapped = swapValues(inputs.gapX, inputs.gapY);
  return {
    ...inputs,
    gapX: swapped.x,
    gapY: swapped.y,
  };
}

export function toggleManualUnit(inputs: NestInputs): NestInputs {
  const from = inputs.unit;
  const to: Unit = from === "in" ? "mm" : "in";
  const cv = (value: number | null) => convertNullableValue(value, from, to);

  return {
    ...inputs,
    unit: to,
    partWidth: cv(inputs.partWidth),
    partHeight: cv(inputs.partHeight),
    remnantWidth: cv(inputs.remnantWidth),
    remnantHeight: cv(inputs.remnantHeight),
    gapX: cv(inputs.gapX),
    gapY: cv(inputs.gapY),
    margins: {
      left: cv(inputs.margins.left),
      right: cv(inputs.margins.right),
      top: cv(inputs.margins.top),
      bottom: cv(inputs.margins.bottom),
    },
  };
}
