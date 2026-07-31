# NestCalc Shop Helpers v1

This specification binds the product behavior for the named-presets and
G-code-rotation wave. `GOAL.md` remains the active execution authority. The
Wayfinder decision record is Superbrain map #32 and tickets #33-#43.

## Named full-state presets

Presets are signed-in, owner-partitioned snapshots of the complete normalized
`NestAppState` version 3. Saving or loading a preset does not change the live
scratch key, theme, migrations, calculator formulas, or AutoNest semantics.

- Live scratch state remains in `localStorage["nestcalc-app-state-v3"]`.
- Theme remains in `localStorage["nestcalc-theme"]`.
- Presets use IndexedDB database `nestcalc-presets`, database version 1,
  object store `presets`, and compound owner/preset keys.
- Clerk `userId` partitions records in the current browser or installed-app
  storage container. Clerk is not used as a storage or synchronization layer.
- Presets do not roam across devices, browsers, profiles, private sessions, or
  Safari/installed-PWA containers. The UI states `Saved on this device only`.
- The Calculator exposes one-tap chips and a management sheet for save-as,
  overwrite, rename, delete, and reorder.

## Product navigation

The authenticated root shell has two persistent tabs: `Calculator` and
`G-code`. AutoNest and presets remain inside Calculator. G-code selection uses
the `#g-code` history entry, so Back and Forward switch modules without a new
route or a calculator-state reset.

## G-code rotation

The G-code tool rotates supported RS274 XY motion counterclockwise around code
origin `(0,0)`.

Supported input:

- explicit `G90` absolute distance mode;
- explicit `G20` inch or `G21` millimeter units;
- explicit `G17` before `G02`/`G03` arcs;
- modal `G00`, `G01`, `G02`, and `G03` motion;
- center-format arcs using I/J offsets; and
- comments, blank lines, and non-target tokens preserved in place.

The transformer reconstructs an omitted absolute X or Y only after both modal
coordinates are known. It rotates endpoints as points and I/J as vectors. It
preserves G02/G03 direction.

Generation fails closed, with a one-based line diagnostic, for unsupported or
indeterminate state including G91, G53, G52, G68/G69, G92, G28/G30, G18/G19
arcs, R-word arcs, canned-cycle motion, conflicting modal words, duplicate
coordinate words, missing initial modal coordinates, unknown unit/distance
mode, or a G20/G21 unit change after the first XY motion. Rejecting a later
unit switch prevents modal coordinates and bounds from being mixed across
incompatible scales.

Transformed coordinates are serialized once as fixed-point values:

- G20: five fractional digits;
- G21: four fractional digits.

Before Copy or download becomes available, the formatted stream is reparsed and
every center-format arc must satisfy the active-unit NIST radius tolerance:
0.0002 inch or 0.002 millimeter. Passing this language-level check is not a
claim that a particular controller installation accepts the output. ACSPL+
ARC1/ARC2 output is not provided.

## Preview and output state

Source edits are parsed latest-only after a 50 ms trailing debounce. The source
axis-aligned bounds include supported arc extrema. Angle input schedules at
most one animation frame that rotates the four cached bounds corners; it does
not rewrite the program. This display is labeled `Conservative bounds preview`
because a rotated source AABB can be larger than the rotated toolpath.

`Generate` flushes the newest parse, rewrites once, validates the formatted
stream, and marks Copy/download ready. Any later source or angle edit marks the
output stale until Generate runs again.

## Product walls

This wave does not change calculator math, AutoNest packing or preview,
version-3 scratch-state schema, Clerk policy, request access, secrets, PWA
runtime caching, deployment, cloud sync, controller configuration, or native
iOS behavior. Product publication stops at a ready reviewed feature PR; merge
and deployment remain human decisions.
