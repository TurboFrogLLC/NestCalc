/**
 * Geometry for the L3 round-part comparison lab. Parts pack on their outer
 * diameter; any washer hole is intentionally outside this helper.
 */
const finitePositive = (value, name) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) throw new Error(`${name} must be greater than 0`);
  return number;
};

const unionBounds = (bounds) => ({
  min_x: Math.min(...bounds.map((bound) => bound.min_x)),
  min_y: Math.min(...bounds.map((bound) => bound.min_y)),
  max_x: Math.max(...bounds.map((bound) => bound.max_x)),
  max_y: Math.max(...bounds.map((bound) => bound.max_y)),
});

const circleBounds = ({ x, y }, radius) => ({
  min_x: x - radius,
  min_y: y - radius,
  max_x: x + radius,
  max_y: y + radius,
});

/**
 * Returns round-part centers and their combined AABB.
 * Modes: single; inset (hexagonal close-packing inset); row (comparison only).
 */
export const roundLayout = ({ radius, gap, mode = 'inset' }) => {
  const R = finitePositive(radius, 'R');
  const g = Number(gap);
  if (!Number.isFinite(g) || g <= 0) throw new Error('g must be greater than 0');
  if (!['single', 'inset', 'row'].includes(mode)) throw new Error(`Unsupported round layout mode: ${mode}`);

  const p = 2 * R + g;
  const centers = [{ x: 0, y: 0 }];
  if (mode === 'inset') centers.push({ x: p / 2, y: p * Math.sqrt(3) / 2 });
  if (mode === 'row') centers.push({ x: p, y: 0 });
  const bounds = unionBounds(centers.map((center) => circleBounds(center, R)));

  return { R, g, p, dx: centers.length === 2 ? centers[1].x : 0, dy: centers.length === 2 ? centers[1].y : 0, centers, bounds };
};

const format = (value) => Number(value.toFixed(9)).toString();

/** Emits the fixture dialect's two-semicircle representation for each OD. */
export const roundProgram = (layout) => {
  const circle = ({ x, y }) => {
    const right = { x: x + layout.R, y };
    const left = { x: x - layout.R, y };
    return [
      `G0 X${format(right.x)} Y${format(right.y)}`,
      `G3 X${format(left.x)} Y${format(left.y)} I${format(-layout.R)} J0`,
      `G3 X${format(right.x)} Y${format(right.y)} I${format(layout.R)} J0`,
    ];
  };
  return `${['(LAB FIXTURE ONLY - ROUND OD BACKPLOT)', 'G21', 'G90', 'G17', ...layout.centers.flatMap(circle), 'M5', 'M2'].join('\n')}\n`;
};
