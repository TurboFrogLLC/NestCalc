export type Unit = "in" | "mm";

export type ThemeMode = "dark" | "light";

export type NestMode = "manual" | "autonest";

export interface Margins {
  left: number | null;
  right: number | null;
  top: number | null;
  bottom: number | null;
}

export interface NestInputs {
  partWidth: number | null;
  partHeight: number | null;
  remnantWidth: number | null;
  remnantHeight: number | null;
  margins: Margins;
  gapX: number | null;
  gapY: number | null;
  partLinked: boolean;
  gapLinked: boolean;
  moveMarginsWithRotation: boolean;
  unit: Unit;
}

export interface NestResult {
  usableWidth: number;
  usableHeight: number;
  partsAcross: number;
  partsDown: number;
  totalParts: number;
}

export interface AutoNestSettings {
  globalClampMargin: number | null;
  overrideGlobalMargins: boolean;
  marginOverrides: Margins;
}

export interface NestAppState {
  version: 3;
  mode: NestMode;
  manualInputs: NestInputs;
  autoNestSettings: AutoNestSettings;
}

export type TrimLineOrientation = "horizontal" | "vertical";
export type AutoNestGroupOrientation = "0deg" | "90deg";

export interface AutoNestOriginOffset {
  x: number;
  y: number;
}

export interface AutoNestBoundingBox {
  width: number;
  height: number;
}

export interface AutoNestGroupResult {
  orientation: AutoNestGroupOrientation;
  count: number;
  boundingBox: AutoNestBoundingBox;
}

export interface AutoNestBlankResult {
  width: number;
  height: number;
  achievedMargins: Margins;
  group: AutoNestGroupResult;
}

export interface AutoNestTwoGroupResult {
  totalParts: number;
  trimLine: {
    orientation: TrimLineOrientation;
    position: number;
  };
  blanks: [AutoNestBlankResult, AutoNestBlankResult];
  suggestedOriginOffset: AutoNestOriginOffset;
}

export type AutoNestResult =
  | {
      status: "not-ready";
      reason: "engine-not-implemented";
      bestUniform: NestResult;
    }
  | {
      status: "fallback";
      reason:
        | "engine-unavailable"
        | "insufficient-inputs"
        | "two-group-not-useful";
      bestUniform: NestResult;
      fallback: NestResult;
    }
  | {
      status: "computed";
      bestUniform: NestResult;
      twoGroup: AutoNestTwoGroupResult;
    };

export type NestSessionResult =
  | {
      mode: "manual";
      manual: NestResult;
    }
  | {
      mode: "autonest";
      autoNest: AutoNestResult;
    };
