import type { NestInputs, NestResult, RemRotation } from "./types";

const FIT_EPSILON = 1e-9;

export function coalesce(value: number | null | undefined): number {
  return value ?? 0;
}

export function isRemAxesSwapped(remRotation: RemRotation): boolean {
  return remRotation === 90 || remRotation === 270;
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
    remRotation,
  } = inputs;

  const remW = coalesce(remnantWidth);
  const remH = coalesce(remnantHeight);
  const partW = coalesce(partWidth);
  const partH = coalesce(partHeight);
  const gapAcross = coalesce(gapX);
  const gapDown = coalesce(gapY);
  const swapAxes = isRemAxesSwapped(remRotation);

  const acrossRem = swapAxes ? remH : remW;
  const downRem = swapAxes ? remW : remH;
  const acrossMargins = swapAxes
    ? coalesce(margins.top) + coalesce(margins.bottom)
    : coalesce(margins.left) + coalesce(margins.right);
  const downMargins = swapAxes
    ? coalesce(margins.left) + coalesce(margins.right)
    : coalesce(margins.top) + coalesce(margins.bottom);

  const usableWidth = acrossRem - acrossMargins;
  const usableHeight = downRem - downMargins;

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

export function nextRemRotation(current: NestInputs["remRotation"]): NestInputs["remRotation"] {
  return ((current + 90) % 360) as NestInputs["remRotation"];
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
    remRotation: 0,
    unit,
  };
}