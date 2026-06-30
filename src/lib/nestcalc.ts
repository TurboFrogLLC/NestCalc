import type { Margins, NestInputs, NestResult } from "./types";

export function partsInDimension(
  usable: number,
  part: number,
  gap: number,
): number {
  if (usable < part || part <= 0) return 0;
  return Math.floor((usable + gap) / (part + gap));
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