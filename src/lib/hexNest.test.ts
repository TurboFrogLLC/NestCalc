import { describe, expect, it } from "vitest";
import { insetHexNestPart, layoutHexNest } from "./hexNest";

const input = {
  blank: { width: 6, height: 4 },
  margins: { left: 0.25, right: 0.25, top: 0.25, bottom: 0.25 },
  diameter: 1,
};

describe("HexNest", () => {
  it("lays out same-diameter rounds in offset tangent rows from the margin origin", () => {
    const layout = layoutHexNest(input);
    const origin = layout.parts.find((part) => part.isOrigin);
    const upper = layout.parts.find((part) => part.row === 1 && part.column === 0);

    expect(origin).toMatchObject({ id: "0:0", x: 0.25, y: 0.25, width: 1, height: 1 });
    expect(origin?.circle).toEqual({ cx: 0.75, cy: 0.75, radius: 0.5 });
    expect(upper).toMatchObject({ x: 0.75, y: 0.25 + Math.sqrt(3) / 2 });
    expect(layout.rowOffsetX).toBe(0.5);
    expect(layout.rowGapY).toBeCloseTo(Math.sqrt(3) / 2);
    expect(layout.parts.every((part) => part.x >= layout.bounds.x && part.y >= layout.bounds.y)).toBe(true);
    expect(layout.parts.every((part) => part.x + part.width <= layout.bounds.x + layout.bounds.width)).toBe(true);
  });

  it("keeps the origin locked while an upper drag insets and shifts the lower row", () => {
    const before = layoutHexNest(input);
    const upper = before.parts.find((part) => part.row === 1 && part.column === 1);
    const lower = before.parts.find((part) => part.id === "0:1");
    expect(upper).toBeDefined();
    expect(lower).toBeDefined();

    const after = insetHexNestPart(input, { partId: upper!.id, x: upper!.x + 0.3, y: upper!.y + 0.15 });
    const moved = after.parts.find((part) => part.id === upper!.id);
    const shiftedLower = after.parts.find((part) => part.id === lower!.id);
    const origin = after.parts.find((part) => part.isOrigin);

    expect(moved).toMatchObject({ x: upper!.x + 0.3, y: upper!.y + 0.15 });
    expect(shiftedLower?.x).toBeCloseTo(lower!.x + 0.3);
    expect(origin).toMatchObject({ x: 0.25, y: 0.25 });
    expect(after.parts.every((part) => part.x + part.width <= after.bounds.x + after.bounds.width)).toBe(true);
    const lowerRow = after.parts.filter((part) => part.row === 0);
    expect(lowerRow[2].x - lowerRow[1].x).toBeCloseTo(input.diameter);
  });

  it("does not move the origin when it is the requested inset target", () => {
    const before = layoutHexNest(input);
    const after = insetHexNestPart(input, { partId: "0:0", x: 4, y: 2 });
    expect(after).toEqual(before);
  });

  it("limits a large inset so the shifted lower row remains evenly spaced", () => {
    const after = insetHexNestPart(input, { partId: "1:1", x: 20, y: 2 });
    const lower = after.parts.filter((part) => part.row === 0);

    expect(lower[0].isOrigin).toBe(true);
    for (let index = 2; index < lower.length; index += 1) {
      expect(lower[index].x - lower[index - 1].x).toBeCloseTo(input.diameter);
    }
    expect(lower.at(-1)!.x + lower.at(-1)!.width).toBeCloseTo(after.bounds.x + after.bounds.width);
  });
});
