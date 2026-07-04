import type { Page } from "@playwright/test";

// Scope the parts summary to the visible preview header in split layouts.
export function visiblePartsSummary(page: Page) {
  return page.locator(".nestcalc-split-preview-header").getByText("Parts =");
}
