import type { Page } from "@playwright/test";

/** Visible preview-header parts count; avoids strict-mode clash with hidden split summary. */
export function visiblePartsSummary(page: Page) {
  return page.locator(".nestcalc-split-preview-header").getByText("Parts =");
}