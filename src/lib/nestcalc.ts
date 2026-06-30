import type { Margins, NestInputs, NestResult } from "./types";

const FIT_EPSILON = 1e-9;

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
  const { margins, gap, partWidth, partHeight, remnantWidth, remnantHeight } =
    inputs;

  const usableWidth = remnantWidth - margins.left - margins.right;
  const usableHeight = remnantHeight - margins.top - margins.bottom;

  const partsAcross = partsInDimension(usableWidth, partWidth, gap);
  const partsDown = partsInDimension(usableHeight, partHeight, gap);

  return {
    usableWidth,
    usableHeight,
    partsAcross,
    partsDown,
    totalParts: partsAcross * partsDown,
  };
}

/** Rotate margin assignments 90° clockwise (remnant orientation change). */
export function rotateMarginsCW(margins: Margins): Margins {
  return {
    left: margins.bottom,
    top: margins.left,
    right: margins.top,
    bottom: margins.right,
  };
}