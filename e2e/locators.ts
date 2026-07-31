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

export function autoNestTrimPolicyGroup(page: Page) {
  return page.getByRole("group", {
    name: "Internal trim edge margin policy",
  });
}

export function autoNestTrimPolicyOption(
  page: Page,
  label: "Open" | "Shared" | "Full",
) {
  return autoNestTrimPolicyGroup(page).getByRole("radio", {
    name: label,
    exact: true,
  });
}

export function autoNestTrimPolicySegment(
  page: Page,
  label: "Open" | "Shared" | "Full",
) {
  return autoNestTrimPolicyGroup(page).getByText(label, { exact: true });
}

export function autoNestSharedTrimClearanceInput(page: Page) {
  return page.getByLabel("Shared trim clearance");
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

export function manualNestPreview(page: Page) {
  return page.locator('[aria-label="Nest preview"]');
}

export function autoNestPreview(page: Page) {
  return page.getByRole("img", { name: "AutoNest computed preview" });
}

export function autoNestPreviewGroup(
  page: Page,
  orientation: "0deg" | "90deg",
) {
  return page.getByTestId(`autonest-preview-group-${orientation}`);
}

export function autoNestTrimLine(page: Page) {
  return page.getByTestId("autonest-trim-line");
}

export function autoNestTrimSummary(page: Page) {
  return page.getByTestId("autonest-preview-trim-summary");
}

export function mainMarginInput(
  page: Page,
  label: "Left" | "Right" | "Top" | "Bottom",
) {
  return page.getByRole("textbox", {
    name: new RegExp(`^${label} (?:in|mm)$`),
  });
}

export function autoNestPart(
  page: Page,
  orientation: "0deg" | "90deg",
) {
  return page.getByTestId(`autonest-part-${orientation}`);
}

export function autoNestGroupBounds(
  page: Page,
  orientation: "0deg" | "90deg",
) {
  return page.getByTestId(`autonest-group-bounds-${orientation}`);
}

export function namedPresetsRegion(page: Page) {
  return page.getByRole("region", { name: "Named presets" });
}

export function savedPresetChips(page: Page) {
  return namedPresetsRegion(page).getByRole("list", {
    name: "Saved preset chips",
  });
}

export function savePresetButton(page: Page) {
  return namedPresetsRegion(page).getByRole("button", {
    name: "Save Preset",
    exact: true,
  });
}

export function managePresetsButton(page: Page) {
  return namedPresetsRegion(page).getByRole("button", {
    name: "Manage",
    exact: true,
  });
}

export function presetChip(page: Page, name: string) {
  return savedPresetChips(page).getByRole("button", {
    name: `Load preset ${name}`,
    exact: true,
  });
}

export function presetManager(page: Page) {
  return page.getByRole("complementary", { name: "Manage Presets" });
}

export function presetOrder(page: Page) {
  return presetManager(page).getByRole("list", { name: "Preset order" });
}

export function presetRow(page: Page, name: string) {
  return presetOrder(page).getByRole("listitem").filter({
    has: page.getByRole("button", {
      name: `Load preset ${name}`,
      exact: true,
    }),
  });
}

export function calculatorTab(page: Page) {
  return page.getByRole("tab", { name: "Calculator", exact: true });
}

export function gcodeTab(page: Page) {
  return page.getByRole("tab", { name: "G-code", exact: true });
}

export function gcodeRegion(page: Page) {
  return page.getByRole("region", { name: "G-code rotation" });
}

export function gcodeSourceInput(page: Page) {
  return page.getByLabel("Source G-code", { exact: true });
}

export function gcodeAngleInput(page: Page) {
  return page.getByLabel("Counterclockwise angle", { exact: true });
}

export function gcodeGenerateButton(page: Page) {
  return page.getByRole("button", { name: "Generate", exact: true });
}

export function gcodeDiagnostics(page: Page) {
  return page.getByTestId("gcode-diagnostics");
}

export function gcodePreview(page: Page) {
  return page.getByTestId("gcode-preview");
}

export function gcodePreviewStatus(page: Page) {
  return page.getByTestId("gcode-preview-status");
}

export function gcodeOutput(page: Page) {
  return page.getByLabel("Generated G-code output", { exact: true });
}

export function gcodeCopyButton(page: Page) {
  return page.getByRole("button", { name: "Copy generated G-code" });
}

export function gcodeDownloadButton(page: Page) {
  return page.getByRole("button", {
    name: "Download generated G-code as an NC file",
  });
}
