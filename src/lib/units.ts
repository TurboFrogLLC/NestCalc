import type { Unit } from "./types";

export const INCH_TO_MM = 25.4;

export function round3(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export function convertValue(value: number, from: Unit, to: Unit): number {
  if (from === to) return round3(value);
  if (from === "in" && to === "mm") return round3(value * INCH_TO_MM);
  return round3(value / INCH_TO_MM);
}

export function unitLabel(unit: Unit): string {
  return unit === "in" ? "in" : "mm";
}