export interface HexNestMargins {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface HexNestInput {
  blank: { width: number; height: number };
  margins: HexNestMargins;
  diameter: number;
}

export interface HexNestCircle {
  cx: number;
  cy: number;
  radius: number;
}

export interface HexNestPart {
  id: string;
  row: number;
  column: number;
  x: number;
  y: number;
  width: number;
  height: number;
  circle: HexNestCircle;
  isOrigin: boolean;
}

export interface HexNestLayout {
  diameter: number;
  origin: { x: number; y: number };
  rowOffsetX: number;
  rowGapY: number;
  bounds: { x: number; y: number; width: number; height: number };
  parts: HexNestPart[];
}

export interface HexNestInset {
  partId: string;
  x: number;
  y: number;
}

const EPSILON = 1e-9;

function finitePositive(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function makePart(
  row: number,
  column: number,
  x: number,
  y: number,
  diameter: number,
): HexNestPart {
  return {
    id: `${row}:${column}`,
    row,
    column,
    x,
    y,
    width: diameter,
    height: diameter,
    circle: {
      cx: x + diameter / 2,
      cy: y + diameter / 2,
      radius: diameter / 2,
    },
    isOrigin: row === 0 && column === 0,
  };
}

function movePart(part: HexNestPart, x: number, y: number): HexNestPart {
  return makePart(part.row, part.column, x, y, part.width);
}

/**
 * Packs one round part type into alternating tangent rows. Coordinates describe
 * each part's bounding box, so the circle remains tangent to all four box sides.
 */
export function layoutHexNest(input: HexNestInput): HexNestLayout {
  const { blank, margins, diameter } = input;
  if (
    !finitePositive(blank.width) ||
    !finitePositive(blank.height) ||
    !finitePositive(diameter) ||
    Object.values(margins).some((margin) => !Number.isFinite(margin) || margin < 0)
  ) {
    throw new Error("HexNest requires finite positive blank dimensions and diameter.");
  }

  const bounds = {
    x: margins.left,
    y: margins.bottom,
    width: Math.max(0, blank.width - margins.left - margins.right),
    height: Math.max(0, blank.height - margins.top - margins.bottom),
  };
  const rowOffsetX = diameter / 2;
  const rowGapY = (Math.sqrt(3) / 2) * diameter;
  const parts: HexNestPart[] = [];

  for (let row = 0, y = bounds.y; y + diameter <= bounds.y + bounds.height + EPSILON; row += 1, y += rowGapY) {
    const offset = row % 2 === 0 ? 0 : rowOffsetX;
    for (let column = 0, x = bounds.x + offset; x + diameter <= bounds.x + bounds.width + EPSILON; column += 1, x += diameter) {
      parts.push(makePart(row, column, x, y, diameter));
    }
  }

  return {
    diameter,
    origin: { x: bounds.x, y: bounds.y },
    rowOffsetX,
    rowGapY,
    bounds,
    parts,
  };
}

/**
 * Insets one upper-row part and shifts the movable lower-row parts by the same
 * bounded X delta. The margin-origin part deliberately remains fixed.
 */
export function insetHexNestPart(
  input: HexNestInput,
  inset: HexNestInset,
): HexNestLayout {
  const layout = layoutHexNest(input);
  const dragged = layout.parts.find((part) => part.id === inset.partId);
  if (!dragged || dragged.isOrigin) return layout;

  const maxX = layout.bounds.x + layout.bounds.width - layout.diameter;
  const maxY = layout.bounds.y + layout.bounds.height - layout.diameter;
  const x = clamp(inset.x, layout.bounds.x, maxX);
  const y = clamp(inset.y, layout.bounds.y, maxY);
  const lowerRow = dragged.row - 1;
  const lowerParts = layout.parts.filter(
    (part) => part.row === lowerRow && !part.isOrigin,
  );
  const maxPartX = layout.bounds.x + layout.bounds.width - layout.diameter;
  const minShift = lowerParts.reduce(
    (minimum, part) =>
      Math.max(minimum, layout.bounds.x + layout.diameter - part.x),
    Number.NEGATIVE_INFINITY,
  );
  const maxShift = lowerParts.reduce(
    (maximum, part) => Math.min(maximum, maxPartX - part.x),
    Number.POSITIVE_INFINITY,
  );
  const deltaX = clamp(x - dragged.x, minShift, maxShift);

  return {
    ...layout,
    parts: layout.parts.map((part) => {
      if (part.id === dragged.id) return movePart(part, x, y);
      if (part.row !== lowerRow || part.isOrigin) return part;
      return movePart(part, part.x + deltaX, part.y);
    }),
  };
}
