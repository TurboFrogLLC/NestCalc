/**
 * Motion-only XY bounds for the deliberately small fixture dialect.
 *
 * Supports G0/G1 endpoints and G2/G3 arcs.  I/J arcs use center offsets;
 * R arcs are resolved from their chord and radius.  It is not a controller
 * parser and deliberately ignores spindle, laser, feed, and comment tokens.
 */
const EPSILON = 1e-9;
const CARDINAL_ANGLES = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];

const numbers = (line) => Object.fromEntries(
  [...line.matchAll(/([XYZIJR])\s*(-?(?:\d+(?:\.\d*)?|\.\d+))/gi)]
    .map(([, key, value]) => [key.toUpperCase(), Number(value)]),
);

const containsAngle = (start, end, clockwise, candidate) => {
  const twoPi = Math.PI * 2;
  const normalize = (angle) => ((angle % twoPi) + twoPi) % twoPi;
  const span = clockwise
    ? normalize(start - end)
    : normalize(end - start);
  const traveled = clockwise
    ? normalize(start - candidate)
    : normalize(candidate - start);
  return traveled <= span + EPSILON;
};

const rCenter = (start, end, radius, clockwise) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const chord = Math.hypot(dx, dy);
  const r = Math.abs(radius);
  if (chord < EPSILON || chord > 2 * r + EPSILON) {
    throw new Error(`Invalid R arc: chord ${chord} cannot use R${radius}`);
  }
  const midpoint = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
  const height = Math.sqrt(Math.max(0, r * r - (chord * chord) / 4));
  if (height < EPSILON) return midpoint; // exactly 180 degrees: one center.
  const perpendicular = { x: -dy / chord, y: dx / chord };
  const candidates = [1, -1].map((sign) => ({
    x: midpoint.x + sign * height * perpendicular.x,
    y: midpoint.y + sign * height * perpendicular.y,
  }));
  const matching = candidates.filter((center) => {
    const startAngle = Math.atan2(start.y - center.y, start.x - center.x);
    const endAngle = Math.atan2(end.y - center.y, end.x - center.x);
    const span = clockwise
      ? ((startAngle - endAngle + Math.PI * 2) % (Math.PI * 2))
      : ((endAngle - startAngle + Math.PI * 2) % (Math.PI * 2));
    return radius < 0 ? span >= Math.PI - EPSILON : span <= Math.PI + EPSILON;
  });
  if (matching.length !== 1) throw new Error(`Ambiguous R arc: R${radius}`);
  return matching[0];
};

export const aabbForProgram = (program) => {
  let current = { x: 0, y: 0 };
  const points = [];
  const include = (point) => points.push(point);

  for (const rawLine of program.split(/\r?\n/)) {
    const line = rawLine.replace(/\([^)]*\)|;.*/, '').trim().toUpperCase();
    if (!line) continue;
    const values = numbers(line);
    const motion = line.match(/\bG0?([0123])\b/)?.[1];
    if (!motion) continue;
    const end = { x: values.X ?? current.x, y: values.Y ?? current.y };
    if (motion === '0' || motion === '1') {
      include(current);
      include(end);
    } else {
      const clockwise = motion === '2';
      const center = values.I !== undefined || values.J !== undefined
        ? { x: current.x + (values.I ?? 0), y: current.y + (values.J ?? 0) }
        : values.R !== undefined ? rCenter(current, end, values.R, clockwise)
          : (() => { throw new Error(`Arc needs I/J or R: ${rawLine}`); })();
      const startAngle = Math.atan2(current.y - center.y, current.x - center.x);
      const endAngle = Math.atan2(end.y - center.y, end.x - center.x);
      include(current);
      include(end);
      for (const angle of CARDINAL_ANGLES) {
        if (containsAngle(startAngle, endAngle, clockwise, angle)) {
          const radius = Math.hypot(current.x - center.x, current.y - center.y);
          include({ x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) });
        }
      }
    }
    current = end;
  }
  if (!points.length) throw new Error('No XY motion found');
  const xs = points.map(({ x }) => x);
  const ys = points.map(({ y }) => y);
  return { min_x: Math.min(...xs), min_y: Math.min(...ys), max_x: Math.max(...xs), max_y: Math.max(...ys) };
};
