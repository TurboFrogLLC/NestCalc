import { calculateNest, coalesce, partsInDimension } from "./nestcalc";
import type {
  AutoNestBlankResult,
  AutoNestGroupOrientation,
  AutoNestGroupResult,
  AutoNestResult,
  AutoNestSettings,
  AutoNestTrimEdgePolicy,
  Margins,
  NestInputs,
  NestResult,
  TrimLineOrientation,
} from "./types";

const FIT_EPSILON = 1e-9;
const TWO_GROUP_SEARCH_CANDIDATE_BUDGET = 20_000;

function emptyNestResult(): NestResult {
  return {
    usableWidth: 0,
    usableHeight: 0,
    partsAcross: 0,
    partsDown: 0,
    totalParts: 0,
  };
}

interface OrientedPart {
  orientation: AutoNestGroupOrientation;
  width: number;
  height: number;
}

interface PackedGroup {
  orientation: AutoNestGroupOrientation;
  count: number;
  boundingBox: {
    width: number;
    height: number;
  };
  grid: AutoNestGroupResult["grid"];
}

interface Candidate {
  totalParts: number;
  trimLine: {
    orientation: TrimLineOrientation;
    position: number;
  };
  blanks: [AutoNestBlankResult, AutoNestBlankResult];
  suggestedOriginOffset: {
    x: number;
    y: number;
  };
}

type RequiredMarginPair = [Margins, Margins];

function finitePositive(value: number | null): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function finiteNonNegative(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}

function gridSpan(count: number, size: number, gap: number): number {
  if (count <= 0) return 0;
  return count * size + Math.max(0, count - 1) * gap;
}

export function effectiveAutoNestMargins(settings: AutoNestSettings): Margins {
  const globalMargin = coalesce(settings.globalClampMargin);

  if (!settings.overrideGlobalMargins) {
    return {
      left: globalMargin,
      right: globalMargin,
      top: globalMargin,
      bottom: globalMargin,
    };
  }

  return {
    left: settings.marginOverrides.left ?? globalMargin,
    right: settings.marginOverrides.right ?? globalMargin,
    top: settings.marginOverrides.top ?? globalMargin,
    bottom: settings.marginOverrides.bottom ?? globalMargin,
  };
}

function trimEdgePolicy(settings: AutoNestSettings): AutoNestTrimEdgePolicy {
  return settings.trimEdgePolicy === "full" ||
    settings.trimEdgePolicy === "shared"
    ? settings.trimEdgePolicy
    : "open";
}

function requiredMarginsForSplit(
  settings: AutoNestSettings,
  outer: Margins,
  orientation: TrimLineOrientation,
): RequiredMarginPair {
  const policy = trimEdgePolicy(settings);
  if (policy === "full") return [{ ...outer }, { ...outer }];

  const shared =
    policy === "shared" ? coalesce(settings.sharedTrimClearance) : 0;

  if (orientation === "vertical") {
    return [
      { ...outer, right: 0 },
      { ...outer, left: shared },
    ];
  }

  return [
    { ...outer, bottom: 0 },
    { ...outer, top: shared },
  ];
}

function hasUsableAutoNestInputs(
  inputs: NestInputs,
  margins: Margins,
  settings: AutoNestSettings,
): boolean {
  const gapsAreValid =
    finiteNonNegative(coalesce(inputs.gapX)) &&
    finiteNonNegative(coalesce(inputs.gapY));
  const marginsAreValid = [
    margins.left,
    margins.right,
    margins.top,
    margins.bottom,
  ].every((value) => finiteNonNegative(coalesce(value)));
  const sharedClearanceIsValid =
    trimEdgePolicy(settings) !== "shared" ||
    finiteNonNegative(coalesce(settings.sharedTrimClearance));

  return (
    finitePositive(inputs.partWidth) &&
    finitePositive(inputs.partHeight) &&
    finitePositive(inputs.remnantWidth) &&
    finitePositive(inputs.remnantHeight) &&
    gapsAreValid &&
    marginsAreValid &&
    sharedClearanceIsValid
  );
}

function inputsWithMargins(inputs: NestInputs, margins: Margins): NestInputs {
  return {
    ...inputs,
    margins,
  };
}

function inputsForOrientation(
  inputs: NestInputs,
  margins: Margins,
  orientation: AutoNestGroupOrientation,
): NestInputs {
  if (orientation === "0deg") {
    return inputsWithMargins(inputs, margins);
  }

  return {
    ...inputs,
    partWidth: inputs.partHeight,
    partHeight: inputs.partWidth,
    margins,
  };
}

export function calculateBestUniformNest(
  inputs: NestInputs,
  settings: AutoNestSettings,
): NestResult {
  const margins = effectiveAutoNestMargins(settings);
  const zeroDegree = calculateNest(inputsForOrientation(inputs, margins, "0deg"));
  const ninetyDegree = calculateNest(
    inputsForOrientation(inputs, margins, "90deg"),
  );

  return ninetyDegree.totalParts > zeroDegree.totalParts
    ? ninetyDegree
    : zeroDegree;
}

function toGroupResult(group: PackedGroup): AutoNestGroupResult {
  return {
    orientation: group.orientation,
    count: group.count,
    boundingBox: group.boundingBox,
    grid: group.grid,
  };
}

function makeBlank(
  width: number,
  height: number,
  margins: Margins,
  group: PackedGroup,
): AutoNestBlankResult {
  const left = coalesce(margins.left);
  const top = coalesce(margins.top);

  return {
    width,
    height,
    achievedMargins: {
      left,
      top,
      right: width - left - group.boundingBox.width,
      bottom: height - top - group.boundingBox.height,
    },
    group: toGroupResult(group),
  };
}

function usefulBlankThreshold(
  inputs: NestInputs,
  margins: Margins,
  settings: AutoNestSettings,
): number {
  const partMin = Math.min(coalesce(inputs.partWidth), coalesce(inputs.partHeight));
  const largestMargin = Math.max(
    coalesce(margins.left),
    coalesce(margins.right),
    coalesce(margins.top),
    coalesce(margins.bottom),
    trimEdgePolicy(settings) === "shared"
      ? coalesce(settings.sharedTrimClearance)
      : 0,
  );

  // Conservative sliver guard: each physical blank must have room for at
  // least the smallest part side or the clamp clearance envelope, whichever is
  // larger. This avoids returning trim pieces that are only margin-clearance
  // slivers while still allowing legitimate one-row or one-column nests.
  return Math.max(partMin, largestMargin * 2);
}

function blankIsUseful(blank: AutoNestBlankResult, threshold: number): boolean {
  return (
    blank.width + FIT_EPSILON >= threshold &&
    blank.height + FIT_EPSILON >= threshold
  );
}

function achievedMarginsAreValid(
  blank: AutoNestBlankResult,
  margins: Margins,
): boolean {
  return (
    coalesce(blank.achievedMargins.left) + FIT_EPSILON >= coalesce(margins.left) &&
    coalesce(blank.achievedMargins.right) + FIT_EPSILON >= coalesce(margins.right) &&
    coalesce(blank.achievedMargins.top) + FIT_EPSILON >= coalesce(margins.top) &&
    coalesce(blank.achievedMargins.bottom) + FIT_EPSILON >= coalesce(margins.bottom)
  );
}

function candidateIsUseful(
  candidate: Candidate,
  requiredMargins: RequiredMarginPair,
  threshold: number,
): boolean {
  return candidate.blanks.every(
    (blank, index) =>
      blankIsUseful(blank, threshold) &&
      achievedMarginsAreValid(blank, requiredMargins[index]),
  );
}

function candidateTieBreaker(candidate: Candidate): number {
  return Math.min(
    candidate.blanks[0].width,
    candidate.blanks[0].height,
    candidate.blanks[1].width,
    candidate.blanks[1].height,
  );
}

function isBetterCandidate(
  candidate: Candidate,
  current: Candidate | null,
): boolean {
  if (!current) return true;
  if (candidate.totalParts !== current.totalParts) {
    return candidate.totalParts > current.totalParts;
  }

  const candidateSpan = candidateTieBreaker(candidate);
  const currentSpan = candidateTieBreaker(current);
  if (Math.abs(candidateSpan - currentSpan) > FIT_EPSILON) {
    return candidateSpan > currentSpan;
  }

  if (candidate.trimLine.orientation !== current.trimLine.orientation) {
    return candidate.trimLine.orientation === "vertical";
  }

  return candidate.trimLine.position < current.trimLine.position;
}

function verticalCandidate(
  first: PackedGroup,
  second: PackedGroup,
  remnantWidth: number,
  remnantHeight: number,
  requiredMargins: RequiredMarginPair,
): Candidate | null {
  const [firstMargins, secondMargins] = requiredMargins;
  const firstWidth =
    coalesce(firstMargins.left) +
    first.boundingBox.width +
    coalesce(firstMargins.right);
  const secondMinimumWidth =
    coalesce(secondMargins.left) +
    second.boundingBox.width +
    coalesce(secondMargins.right);

  if (firstWidth + secondMinimumWidth > remnantWidth + FIT_EPSILON) {
    return null;
  }

  const secondWidth = remnantWidth - firstWidth;
  const firstBlank = makeBlank(firstWidth, remnantHeight, firstMargins, first);
  const secondBlank = makeBlank(secondWidth, remnantHeight, secondMargins, second);

  return {
    totalParts: first.count + second.count,
    trimLine: {
      orientation: "vertical",
      position: firstWidth,
    },
    blanks: [firstBlank, secondBlank],
    suggestedOriginOffset: {
      x: firstWidth,
      y: 0,
    },
  };
}

function horizontalCandidate(
  first: PackedGroup,
  second: PackedGroup,
  remnantWidth: number,
  remnantHeight: number,
  requiredMargins: RequiredMarginPair,
): Candidate | null {
  const [firstMargins, secondMargins] = requiredMargins;
  const firstHeight =
    coalesce(firstMargins.top) +
    first.boundingBox.height +
    coalesce(firstMargins.bottom);
  const secondMinimumHeight =
    coalesce(secondMargins.top) +
    second.boundingBox.height +
    coalesce(secondMargins.bottom);

  if (firstHeight + secondMinimumHeight > remnantHeight + FIT_EPSILON) {
    return null;
  }

  const secondHeight = remnantHeight - firstHeight;
  const firstBlank = makeBlank(remnantWidth, firstHeight, firstMargins, first);
  const secondBlank = makeBlank(remnantWidth, secondHeight, secondMargins, second);

  return {
    totalParts: first.count + second.count,
    trimLine: {
      orientation: "horizontal",
      position: firstHeight,
    },
    blanks: [firstBlank, secondBlank],
    suggestedOriginOffset: {
      x: 0,
      y: firstHeight,
    },
  };
}

function packedGroupForGrid(
  part: OrientedPart,
  columns: number,
  rows: number,
  gapX: number,
  gapY: number,
): PackedGroup {
  return {
    orientation: part.orientation,
    count: columns * rows,
    boundingBox: {
      width: gridSpan(columns, part.width, gapX),
      height: gridSpan(rows, part.height, gapY),
    },
    grid: {
      columns,
      rows,
      partWidth: part.width,
      partHeight: part.height,
      gapX,
      gapY,
    },
  };
}

function estimateTwoGroupSearchCandidates(
  inputs: NestInputs,
  margins: Margins,
  settings: AutoNestSettings,
): number {
  const remnantWidth = coalesce(inputs.remnantWidth);
  const remnantHeight = coalesce(inputs.remnantHeight);
  const gapX = coalesce(inputs.gapX);
  const gapY = coalesce(inputs.gapY);
  const verticalFirstMargins = requiredMarginsForSplit(
    settings,
    margins,
    "vertical",
  )[0];
  const horizontalFirstMargins = requiredMarginsForSplit(
    settings,
    margins,
    "horizontal",
  )[0];
  const verticalUsableWidth =
    remnantWidth -
    coalesce(verticalFirstMargins.left) -
    coalesce(verticalFirstMargins.right);
  const verticalUsableHeight =
    remnantHeight -
    coalesce(verticalFirstMargins.top) -
    coalesce(verticalFirstMargins.bottom);
  const horizontalUsableWidth =
    remnantWidth -
    coalesce(horizontalFirstMargins.left) -
    coalesce(horizontalFirstMargins.right);
  const horizontalUsableHeight =
    remnantHeight -
    coalesce(horizontalFirstMargins.top) -
    coalesce(horizontalFirstMargins.bottom);
  const parts: [OrientedPart, OrientedPart] = [
    {
      orientation: "0deg",
      width: coalesce(inputs.partWidth),
      height: coalesce(inputs.partHeight),
    },
    {
      orientation: "90deg",
      width: coalesce(inputs.partHeight),
      height: coalesce(inputs.partWidth),
    },
  ];
  let candidates = 0;

  for (const [firstPart] of [
    parts,
    [parts[1], parts[0]] as [OrientedPart, OrientedPart],
  ]) {
    const verticalRowsFirst = partsInDimension(
      verticalUsableHeight,
      firstPart.height,
      gapY,
    );

    if (verticalRowsFirst > 0) {
      candidates += partsInDimension(
        verticalUsableWidth,
        firstPart.width,
        gapX,
      );
    }

    const horizontalColumnsFirst = partsInDimension(
      horizontalUsableWidth,
      firstPart.width,
      gapX,
    );

    if (horizontalColumnsFirst > 0) {
      candidates += partsInDimension(
        horizontalUsableHeight,
        firstPart.height,
        gapY,
      );
    }
  }

  return candidates;
}

function findBestTwoGroupCandidate(
  inputs: NestInputs,
  margins: Margins,
  settings: AutoNestSettings,
): Candidate | null {
  const remnantWidth = coalesce(inputs.remnantWidth);
  const remnantHeight = coalesce(inputs.remnantHeight);
  const gapX = coalesce(inputs.gapX);
  const gapY = coalesce(inputs.gapY);
  const parts: [OrientedPart, OrientedPart] = [
    {
      orientation: "0deg",
      width: coalesce(inputs.partWidth),
      height: coalesce(inputs.partHeight),
    },
    {
      orientation: "90deg",
      width: coalesce(inputs.partHeight),
      height: coalesce(inputs.partWidth),
    },
  ];
  const threshold = usefulBlankThreshold(inputs, margins, settings);
  const verticalMargins = requiredMarginsForSplit(
    settings,
    margins,
    "vertical",
  );
  const horizontalMargins = requiredMarginsForSplit(
    settings,
    margins,
    "horizontal",
  );
  let best: Candidate | null = null;

  for (const [firstPart, secondPart] of [
    parts,
    [parts[1], parts[0]] as [OrientedPart, OrientedPart],
  ]) {
    const verticalRowsFirst = partsInDimension(
      remnantHeight -
        coalesce(verticalMargins[0].top) -
        coalesce(verticalMargins[0].bottom),
      firstPart.height,
      gapY,
    );
    const verticalRowsSecond = partsInDimension(
      remnantHeight -
        coalesce(verticalMargins[1].top) -
        coalesce(verticalMargins[1].bottom),
      secondPart.height,
      gapY,
    );
    const maxFirstVerticalColumns = partsInDimension(
      remnantWidth -
        coalesce(verticalMargins[0].left) -
        coalesce(verticalMargins[0].right),
      firstPart.width,
      gapX,
    );

    for (
      let firstColumns = 1;
      firstColumns <= maxFirstVerticalColumns && verticalRowsFirst > 0;
      firstColumns += 1
    ) {
      const firstGroup = packedGroupForGrid(
        firstPart,
        firstColumns,
        verticalRowsFirst,
        gapX,
        gapY,
      );
      const firstWidth =
        coalesce(verticalMargins[0].left) +
        firstGroup.boundingBox.width +
        coalesce(verticalMargins[0].right);
      const secondAvailableWidth =
        remnantWidth -
        firstWidth -
        coalesce(verticalMargins[1].left) -
        coalesce(verticalMargins[1].right);
      const secondColumns = partsInDimension(
        secondAvailableWidth,
        secondPart.width,
        gapX,
      );

      if (secondColumns <= 0 || verticalRowsSecond <= 0) {
        continue;
      }

      const secondGroup = packedGroupForGrid(
        secondPart,
        secondColumns,
        verticalRowsSecond,
        gapX,
        gapY,
      );
      const candidate = verticalCandidate(
        firstGroup,
        secondGroup,
        remnantWidth,
        remnantHeight,
        verticalMargins,
      );

      if (
        candidate &&
        candidateIsUseful(candidate, verticalMargins, threshold) &&
        isBetterCandidate(candidate, best)
      ) {
        best = candidate;
      }
    }

    const horizontalColumnsFirst = partsInDimension(
      remnantWidth -
        coalesce(horizontalMargins[0].left) -
        coalesce(horizontalMargins[0].right),
      firstPart.width,
      gapX,
    );
    const horizontalColumnsSecond = partsInDimension(
      remnantWidth -
        coalesce(horizontalMargins[1].left) -
        coalesce(horizontalMargins[1].right),
      secondPart.width,
      gapX,
    );
    const maxFirstHorizontalRows = partsInDimension(
      remnantHeight -
        coalesce(horizontalMargins[0].top) -
        coalesce(horizontalMargins[0].bottom),
      firstPart.height,
      gapY,
    );

    for (
      let firstRows = 1;
      firstRows <= maxFirstHorizontalRows && horizontalColumnsFirst > 0;
      firstRows += 1
    ) {
      const firstGroup = packedGroupForGrid(
        firstPart,
        horizontalColumnsFirst,
        firstRows,
        gapX,
        gapY,
      );
      const firstHeight =
        coalesce(horizontalMargins[0].top) +
        firstGroup.boundingBox.height +
        coalesce(horizontalMargins[0].bottom);
      const secondAvailableHeight =
        remnantHeight -
        firstHeight -
        coalesce(horizontalMargins[1].top) -
        coalesce(horizontalMargins[1].bottom);
      const secondRows = partsInDimension(
        secondAvailableHeight,
        secondPart.height,
        gapY,
      );

      if (secondRows <= 0 || horizontalColumnsSecond <= 0) {
        continue;
      }

      const secondGroup = packedGroupForGrid(
        secondPart,
        horizontalColumnsSecond,
        secondRows,
        gapX,
        gapY,
      );
      const candidate = horizontalCandidate(
        firstGroup,
        secondGroup,
        remnantWidth,
        remnantHeight,
        horizontalMargins,
      );

      if (
        candidate &&
        candidateIsUseful(candidate, horizontalMargins, threshold) &&
        isBetterCandidate(candidate, best)
      ) {
        best = candidate;
      }
    }
  }

  return best;
}

export function calculateAutoNest(
  inputs: NestInputs,
  settings: AutoNestSettings,
): AutoNestResult {
  const margins = effectiveAutoNestMargins(settings);

  if (!hasUsableAutoNestInputs(inputs, margins, settings)) {
    const safeFallback = emptyNestResult();
    return {
      status: "fallback",
      reason: "insufficient-inputs",
      bestUniform: safeFallback,
      fallback: safeFallback,
    };
  }

  const bestUniform = calculateBestUniformNest(inputs, settings);

  // The two-group search checks one possible first-group split per loop.
  // 20,000 split candidates is well above practical shop remnant grids while
  // keeping pathological ratios out of the synchronous render path.
  if (
    estimateTwoGroupSearchCandidates(inputs, margins, settings) >
    TWO_GROUP_SEARCH_CANDIDATE_BUDGET
  ) {
    return {
      status: "fallback",
      reason: "search-budget-exceeded",
      bestUniform,
      fallback: bestUniform,
    };
  }

  const twoGroup = findBestTwoGroupCandidate(inputs, margins, settings);

  if (!twoGroup || twoGroup.totalParts <= bestUniform.totalParts) {
    return {
      status: "fallback",
      reason: "two-group-not-useful",
      bestUniform,
      fallback: bestUniform,
    };
  }

  return {
    status: "computed",
    bestUniform,
    twoGroup,
  };
}
