export type Unit = "in" | "mm";

export interface Margins {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface NestInputs {
  partWidth: number;
  partHeight: number;
  remnantWidth: number;
  remnantHeight: number;
  margins: Margins;
  gap: number;
  unit: Unit;
}

export interface NestResult {
  usableWidth: number;
  usableHeight: number;
  partsAcross: number;
  partsDown: number;
  totalParts: number;
}