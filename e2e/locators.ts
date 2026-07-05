import type { Page } from "@playwright/test";

/** Visible preview-header parts count; avoids strict-mode clash with hidden split summary. */
export function visiblePartsSummary(page: Page) {
  return page.locator(".nestcalc-split-preview-header").getByText("Parts =");
}

export function autoNestToggle(page: Page) {
  return page.getByRole("button", { name: "AutoNest", exact: true });
}

export function autoNestSettingsButton(page: Page) {
  return page.getByRole("button", { name: "AutoNest settings" });
}

export function globalClampMarginInput(page: Page) {
  return page.getByLabel("Global Clamp Margin");
}

export function overrideGlobalMarginsCheckbox(page: Page) {
  return page.getByRole("checkbox", { name: "Override global margins" });
}

export function autoNestMarginOverrideInput(
  page: Page,
  label:
    | "Left margin override"
    | "Right margin override"
    | "Top margin override"
    | "Bottom margin override",
) {
  return page.getByLabel(label);
}

export function rotatePartButton(page: Page) {
  return page.getByRole("button", { name: "Rotate Part 90°" });
}

export function rotateRemButton(page: Page) {
  return page.getByRole("button", { name: "Rotate Rem 90°" });
}
