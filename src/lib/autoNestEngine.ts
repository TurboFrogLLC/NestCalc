import { calculateNest, coalesce, partsInDimension } from "./nestcalc";
import type {
  AutoNestBlankResult,
  AutoNestGroupOrientation,
  AutoNestGroupResult,
  AutoNestResult,
  AutoNestSettings,
  Margins,
  NestInputs,
  NestResult,
  TrimLineOrientation,
} from "./types";

const FIT_EPSILON = 1e-9;

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

function effectiveAutoNestMargins(settings: AutoNestSettings): Margins {
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

function hasUsableAutoNestInputs(
  inputs: NestInputs,
  margins: Margins,
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

  return (
    finitePositive(inputs.partWidth) &&
    finitePositive(inputs.partHeight) &&
    finitePositive(inputs.remnantWidth) &&
    finitePositive(inputs.remnantHeight) &&
    gapsAreValid &&
    marginsAreValid
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
): number {
  const partMin = Math.min(coalesce(inputs.partWidth), coalesce(inputs.partHeight));
  const largestMargin = Math.max(
    coalesce(margins.left),
    coalesce(margins.right),
    coalesce(margins.top),
    coalesce(margins.bottom),
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
  margins: Margins,
  threshold: number,
): boolean {
  return candidate.blanks.every(
    (blank) =>
      blankIsUseful(blank, threshold) && achievedMarginsAreValid(blank, margins),
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
  margins: Margins,
): Candidate | null {
  const firstWidth =
    coalesce(margins.left) + first.boundingBox.width + coalesce(margins.right);
  const secondMinimumWidth =
    coalesce(margins.left) + second.boundingBox.width + coalesce(margins.right);

  if (firstWidth + secondMinimumWidth > remnantWidth + FIT_EPSILON) {
    return null;
  }

  const secondWidth = remnantWidth - firstWidth;
  const firstBlank = makeBlank(firstWidth, remnantHeight, margins, first);
  const secondBlank = makeBlank(secondWidth, remnantHeight, margins, second);

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
  margins: Margins,
): Candidate | null {
  const firstHeight =
    coalesce(margins.top) + first.boundingBox.height + coalesce(margins.bottom);
  const secondMinimumHeight =
    coalesce(margins.top) + second.boundingBox.height + coalesce(margins.bottom);

  if (firstHeight + secondMinimumHeight > remnantHeight + FIT_EPSILON) {
    return null;
  }

  const secondHeight = remnantHeight - firstHeight;
  const firstBlank = makeBlank(remnantWidth, firstHeight, margins, first);
  const secondBlank = makeBlank(remnantWidth, secondHeight, margins, second);

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
  };
}

function findBestTwoGroupCandidate(
  inputs: NestInputs,
  margins: Margins,
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
  const threshold = usefulBlankThreshold(inputs, margins);
  let best: Candidate | null = null;

  for (const [firstPart, secondPart] of [
    parts,
    [parts[1], parts[0]] as [OrientedPart, OrientedPart],
  ]) {
    const verticalRowsFirst = partsInDimension(
      remnantHeight - coalesce(margins.top) - coalesce(margins.bottom),
      firstPart.height,
      gapY,
    );
    const verticalRowsSecond = partsInDimension(
      remnantHeight - coalesce(margins.top) - coalesce(margins.bottom),
      secondPart.height,
      gapY,
    );
    const maxFirstVerticalColumns = partsInDimension(
      remnantWidth - coalesce(margins.left) - coalesce(margins.right),
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
        coalesce(margins.left) +
        firstGroup.boundingBox.width +
        coalesce(margins.right);
      const secondAvailableWidth =
        remnantWidth -
        firstWidth -
        coalesce(margins.left) -
        coalesce(margins.right);
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
        margins,
      );

      if (
        candidate &&
        candidateIsUseful(candidate, margins, threshold) &&
        isBetterCandidate(candidate, best)
      ) {
        best = candidate;
      }
    }

    const horizontalColumnsFirst = partsInDimension(
      remnantWidth - coalesce(margins.left) - coalesce(margins.right),
      firstPart.width,
      gapX,
    );
    const horizontalColumnsSecond = partsInDimension(
      remnantWidth - coalesce(margins.left) - coalesce(margins.right),
      secondPart.width,
      gapX,
    );
    const maxFirstHorizontalRows = partsInDimension(
      remnantHeight - coalesce(margins.top) - coalesce(margins.bottom),
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
        coalesce(margins.top) +
        firstGroup.boundingBox.height +
        coalesce(margins.bottom);
      const secondAvailableHeight =
        remnantHeight -
        firstHeight -
        coalesce(margins.top) -
        coalesce(margins.bottom);
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
        margins,
      );

      if (
        candidate &&
        candidateIsUseful(candidate, margins, threshold) &&
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

  if (!hasUsableAutoNestInputs(inputs, margins)) {
    const safeFallback = emptyNestResult();
    return {
      status: "fallback",
      reason: "insufficient-inputs",
      bestUniform: safeFallback,
      fallback: safeFallback,
    };
  }

  const bestUniform = calculateBestUniformNest(inputs, settings);

  const twoGroup = findBestTwoGroupCandidate(inputs, margins);

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
