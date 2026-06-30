export type Unit = "in" | "mm";

export type ThemeMode = "dark" | "light";

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