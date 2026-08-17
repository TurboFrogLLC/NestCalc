import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { aabbForProgram } from './bounds.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const header = ['(LAB FIXTURE ONLY - NOT LIVE CONTROLLER OUTPUT)', 'G21', 'G90', 'G17'];
const footer = ['M5', 'M2'];
const program = (body) => `${[...header, ...body, ...footer].join('\n')}\n`;
const rectangle = (width, height) => [
  'G0 X0 Y0', 'G1 X0 Y0', `G1 X${width} Y0`, `G1 X${width} Y${height}`,
  `G1 X0 Y${height}`, 'G1 X0 Y0',
];

const fixtures = [
  { id: 'F1-rectangle-outer', file: 'F1-rectangle-outer.nc', profile_count: 1, notes: 'Closed G0/G1 outer rectangle.', body: rectangle(40, 20) },
  { id: 'F2-circle-ij', file: 'F2-circle-ij.nc', profile_count: 1, notes: 'Two CCW I/J semicircles; bounds include arc extrema, not the endpoint chord box.', body: ['G0 X10 Y0', 'G3 X-10 Y0 I-10 J0', 'G3 X10 Y0 I10 J0'] },
  { id: 'F3-circle-r', file: 'F3-circle-r.nc', profile_count: 1, notes: 'Two CCW R10 semicircles; see README caveat for R-word 180-degree arcs.', body: ['G0 X10 Y0', 'G3 X-10 Y0 R10', 'G3 X10 Y0 R10'] },
  { id: 'F4-outer-inner-laser-tokens', file: 'F4-outer-inner-laser-tokens.nc', profile_count: 2, notes: 'Outer profile precedes inner hole; M3/M4/S tokens are fixture text only.', body: ['G0 X0 Y0', 'M3 S500', ...rectangle(60, 40).slice(1), 'M5', 'G0 X36 Y20', 'M4 S250', 'G3 X24 Y20 I-6 J0', 'G3 X36 Y20 I6 J0', 'M5'] },
  { id: 'F6-rectangle-0deg', file: 'F6-rectangle-0deg.nc', profile_count: 1, notes: '0 degree twin about origin.', body: rectangle(40, 20) },
  { id: 'F6-rectangle-90deg', file: 'F6-rectangle-90deg.nc', profile_count: 1, notes: '90 degree counter-clockwise twin about origin.', body: ['G0 X0 Y0', 'G1 X0 Y0', 'G1 X0 Y40', 'G1 X-20 Y40', 'G1 X-20 Y0', 'G1 X0 Y0'] },
];

const normalizeNumber = (value) => Math.abs(value) < 1e-8 ? 0 : Number(value.toFixed(6));
const aabb = (value) => Object.fromEntries(Object.entries(value).map(([key, number]) => [key, normalizeNumber(number)]));
const sha256 = (value) => createHash('sha256').update(value).digest('hex');

await mkdir(root, { recursive: true });
const manifestFixtures = [];
for (const fixture of fixtures) {
  const contents = program(fixture.body);
  const expected_aabb = aabb(aabbForProgram(contents));
  if (Object.values(expected_aabb).some((number) => !Number.isFinite(number))) throw new Error(`${fixture.id} has an empty AABB`);
  await writeFile(join(root, fixture.file), contents, 'utf8');
  manifestFixtures.push({ id: fixture.id, file: fixture.file, units: 'mm', expected_aabb, profile_count: fixture.profile_count, sha256: sha256(contents), notes: fixture.notes });
}
await writeFile(join(root, 'manifest.json'), `${JSON.stringify({ schema_version: 1, generated_by: 'node lab/laser-nc-fixtures/generate-fixtures.mjs', fixtures: manifestFixtures }, null, 2)}\n`, 'utf8');
console.log(`Generated ${manifestFixtures.length} deterministic laser NC fixtures.`);
