import { round3 } from "./units";

export const QUICK_VALUES = [0.125, 0.25, 0.375, 0.5, 0.625, 0.75] as const;

/** Allow digits and at most one decimal point with up to 3 fractional digits. */
export function sanitizeNumericInput(text: string): string {
  let cleaned = text.replace(/[^0-9.]/g, "");
  const dotIndex = cleaned.indexOf(".");
  if (dotIndex !== -1) {
    const before = cleaned.slice(0, dotIndex + 1);
    const after = cleaned.slice(dotIndex + 1).replace(/\./g, "");
    cleaned = before + after.slice(0, 3);
  }
  return cleaned;
}

export function parseNumericInput(text: string): number | null {
  const trimmed = text.trim();
  if (!trimmed || trimmed === ".") return null;
  const normalized = trimmed.endsWith(".") ? trimmed.slice(0, -1) : trimmed;
  if (!normalized) return null;
  const next = parseFloat(normalized);
  return Number.isFinite(next) ? round3(Math.max(0, next)) : null;
}

/** Normalize draft text on blur (strip trailing dot). */
export function finalizeNumericDraft(text: string): string {
  const trimmed = text.trim();
  if (!trimmed || trimmed === ".") return "";
  if (trimmed.endsWith(".")) return trimmed.slice(0, -1);
  return trimmed;
}