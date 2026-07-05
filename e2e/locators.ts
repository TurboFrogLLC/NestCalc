import type { Page } from "@playwright/test";

/** Visible preview-header parts count; avoids strict-mode clash with hidden split summary. */
export function visiblePartsSummary(page: Page) {
  return page.locator(".nestcalc-split-preview-header").getByText("Parts =");
}

export function autoNestToggle(page: Page) {
  return page.getByRole("button", { name: "AutoNest" });
}

export function rotatePartButton(page: Page) {
  return page.getByRole("button", { name: "Rotate Part 90°" });
}

export function rotateRemButton(page: Page) {
  return page.getByRole("button", { name: "Rotate Rem 90°" });
}
