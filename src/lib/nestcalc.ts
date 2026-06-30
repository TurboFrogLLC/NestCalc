import type { Margins, NestInputs, NestResult } from "./types";

const FIT_EPSILON = 1e-9;

export function toNumber(value: number | null): number {
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

  const remW = toNumber(remnantWidth);
  const remH = toNumber(remnantHeight);
  const partW = toNumber(partWidth);
  const partH = toNumber(partHeight);
  const gapAcross = toNumber(gapX);
  const gapDown = toNumber(gapY);

  const usableWidth =
    remW - toNumber(margins.left) - toNumber(margins.right);
  const usableHeight =
    remH - toNumber(margins.top) - toNumber(margins.bottom);

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