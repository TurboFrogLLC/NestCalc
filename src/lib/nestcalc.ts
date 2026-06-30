import type { Margins, NestInputs, NestResult } from "./types";

const FIT_EPSILON = 1e-9;

export function coalesce(value: number | null | undefined): number {
  return value ?? 0;
}

export function partsInDimension(
  usable: number,
  part: number,
  gap: number,
): number {
  if (usable < part || part <= 0) return 0;
  const quotient = (usable + gap) / (part + gap);
  return Math.floor(quotient + FIT_EPSILON);
}

export function calculateNest(inputs: NestInputs): NestResult {
  const {
    margins,
    gapX,
    gapY,
    partWidth,
    partHeight,
    remnantWidth,
    remnantHeight,
  } = inputs;

  const remW = coalesce(remnantWidth);
  const remH = coalesce(remnantHeight);
  const partW = coalesce(partWidth);
  const partH = coalesce(partHeight);
  const gapAcross = coalesce(gapX);
  const gapDown = coalesce(gapY);

  const usableWidth =
    remW - coalesce(margins.left) - coalesce(margins.right);
  const usableHeight =
    remH - coalesce(margins.top) - coalesce(margins.bottom);

  const partsAcross = partsInDimension(usableWidth, partW, gapAcross);
  const partsDown = partsInDimension(usableHeight, partH, gapDown);

  return {
    usableWidth,
    usableHeight,
    partsAcross,
    partsDown,
    totalParts: partsAcross * partsDown,
  };
}

/** Rotate margin assignments 90° clockwise (rem orientation change). */
export function rotateMarginsCW(margins: Margins): Margins {
  return {
    left: margins.bottom,
    top: margins.left,
    right: margins.top,
    bottom: margins.right,
  };
}

export function clearedInputs(unit: NestInputs["unit"]): NestInputs {
  return {
    partWidth: null,
    partHeight: null,
    remnantWidth: null,
    remnantHeight: null,
    margins: { left: null, right: null, top: null, bottom: null },
    gapX: null,
    gapY: null,
    partLinked: false,
    gapLinked: false,
    moveMarginsWithRotation: false,
    unit,
  };
}