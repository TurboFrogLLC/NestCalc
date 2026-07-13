import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import {
  autoNestMarginOverrideInput,
  autoNestPart,
  autoNestPreview,
  autoNestPreviewGroup,
  autoNestGroupBounds,
  autoNestSettingsButton,
  autoNestSharedTrimClearanceInput,
  autoNestTrimPolicyGroup,
  autoNestTrimPolicyOption,
  autoNestTrimPolicySegment,
  autoNestTrimLine,
  autoNestTrimSummary,
  autoNestToggle,
  globalClampMarginInput,
  manualNestPreview,
  mainMarginInput,
  overrideGlobalMarginsCheckbox,
  rotatePartButton,
  rotateRemButton,
  visiblePartsSummary,
} from "./locators";

const authFile = path.join(__dirname, "../playwright/.clerk/user.json");
const hasRequiredEnv = Boolean(
  process.env.CLERK_SECRET_KEY &&
    process.env.CLERK_PUBLISHABLE_KEY &&
    process.env.E2E_CLERK_USER_EMAIL &&
    process.env.E2E_CLERK_USER_PASSWORD,
);

function clearNestStorage() {
  window.localStorage.removeItem("nestcalc-app-state-v3");
  window.localStorage.removeItem("nestcalc-state-v2");
  window.localStorage.removeItem("nestcalc-state-v1");
}

function seedComputedAutoNestState() {
  window.localStorage.removeItem("nestcalc-app-state-v3");
  window.localStorage.removeItem("nestcalc-state-v2");
  window.localStorage.removeItem("nestcalc-state-v1");
  window.localStorage.setItem(
    "nestcalc-app-state-v3",
    JSON.stringify({
      version: 3,
      mode: "autonest",
      manualInputs: {
        partWidth: 6,
        partHeight: 4,
        remnantWidth: 10,
        remnantHeight: 10,
        margins: { left: 0, right: 0, top: 0, bottom: 0 },
        gapX: 0,
        gapY: 0,
        partLinked: false,
        gapLinked: false,
        moveMarginsWithRotation: false,
        unit: "in",
      },
      autoNestSettings: {
        globalClampMargin: 0,
        trimEdgePolicy: "open",
        sharedTrimClearance: 0,
        overrideGlobalMargins: false,
        marginOverrides: {
          left: null,
          right: null,
          top: null,
          bottom: null,
        },
      },
    }),
  );
}

function seedTrimPolicyFixtureState() {
  window.localStorage.setItem(
    "nestcalc-app-state-v3",
    JSON.stringify({
      version: 3,
      mode: "autonest",
      manualInputs: {
        partWidth: 6,
        partHeight: 4,
        remnantWidth: 11.1,
        remnantHeight: 10,
        margins: { left: 0, right: 0, top: 0, bottom: 0 },
        gapX: 0,
        gapY: 0,
        partLinked: false,
        gapLinked: false,
        moveMarginsWithRotation: false,
        unit: "in",
      },
      autoNestSettings: {
        globalClampMargin: 0.53,
        overrideGlobalMargins: false,
        marginOverrides: {
          left: null,
          right: null,
          top: null,
          bottom: null,
        },
      },
    }),
  );
}

function seedOperatorPreviewState() {
  window.localStorage.setItem(
    "nestcalc-app-state-v3",
    JSON.stringify({
      version: 3,
      mode: "autonest",
      manualInputs: {
        partWidth: 2,
        partHeight: 6,
        remnantWidth: 12,
        remnantHeight: 11,
        margins: { left: 0.11, right: 0.22, top: 0.33, bottom: 0.44 },
        gapX: 0.125,
        gapY: 0.125,
        partLinked: false,
        gapLinked: false,
        moveMarginsWithRotation: false,
        unit: "in",
      },
      autoNestSettings: {
        globalClampMargin: 0.53,
        trimEdgePolicy: "open",
        sharedTrimClearance: 0.53,
        overrideGlobalMargins: false,
        marginOverrides: {
          left: 0.5,
          right: 0.25,
          top: 0.25,
          bottom: 0.25,
        },
      },
    }),
  );
}

function seedGlobalMarginState() {
  window.localStorage.setItem(
    "nestcalc-app-state-v3",
    JSON.stringify({
      version: 3,
      mode: "autonest",
      manualInputs: {
        partWidth: 2,
        partHeight: 6,
        remnantWidth: 12,
        remnantHeight: 11,
        margins: { left: 0.11, right: 0.22, top: 0.33, bottom: 0.44 },
        gapX: 0.125,
        gapY: 0.125,
        partLinked: false,
        gapLinked: false,
        moveMarginsWithRotation: false,
        unit: "in",
      },
      autoNestSettings: {
        globalClampMargin: 0.53,
        trimEdgePolicy: "open",
        sharedTrimClearance: 0.53,
        overrideGlobalMargins: false,
        marginOverrides: { left: 9, right: 8, top: 7, bottom: 6 },
      },
    }),
  );
}

function seedCappedPreviewState() {
  window.localStorage.setItem(
    "nestcalc-app-state-v3",
    JSON.stringify({
      version: 3,
      mode: "autonest",
      manualInputs: {
        partWidth: 6,
        partHeight: 4,
        remnantWidth: 122,
        remnantHeight: 100,
        margins: { left: 0, right: 0, top: 0, bottom: 0 },
        gapX: 0,
        gapY: 0,
        partLinked: false,
        gapLinked: false,
        moveMarginsWithRotation: false,
        unit: "in",
      },
      autoNestSettings: {
        globalClampMargin: 0,
        trimEdgePolicy: "open",
        sharedTrimClearance: 0,
        overrideGlobalMargins: false,
        marginOverrides: { left: null, right: null, top: null, bottom: null },
      },
    }),
  );
}

test.skip(
  !hasRequiredEnv,
  "Missing Clerk E2E env: CLERK_SECRET_KEY, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY or CLERK_PUBLISHABLE_KEY, E2E_CLERK_USER_EMAIL, and E2E_CLERK_USER_PASSWORD.",
);

test.use({ storageState: authFile });

test.beforeAll(() => {
  if (!fs.existsSync(authFile)) {
    throw new Error(
      "Clerk auth storage state was not created by the setup project.",
    );
  }
});

test("authenticated user reaches the NestCalc calculator shell", async ({
  page,
}) => {
  await page.addInitScript(clearNestStorage);
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "NestCalc" })).toBeVisible();
  await expect(page.getByLabel("X [PART]")).toBeVisible();
  await expect(page.getByLabel("Y [REM]")).toBeVisible();
  await expect(visiblePartsSummary(page)).toBeVisible();

  await expect(autoNestToggle(page)).toHaveAttribute("aria-pressed", "false");
  await expect(autoNestSettingsButton(page)).toBeHidden();
  await expect(rotatePartButton(page)).toBeEnabled();
  await expect(rotateRemButton(page)).toBeEnabled();

  await autoNestToggle(page).click();

  await expect(autoNestToggle(page)).toHaveAttribute("aria-pressed", "true");
  await expect(autoNestSettingsButton(page)).toBeVisible();
  await expect(
    page.getByText("AutoNest: Two groups (0° + 90°)"),
  ).toBeVisible();
  await expect(
    page.getByText(/Best uniform: \d+ \| AutoNest two-group:/),
  ).toBeVisible();
  await expect(rotatePartButton(page)).toBeDisabled();
  await expect(rotateRemButton(page)).toBeDisabled();

  await autoNestSettingsButton(page).click();

  await expect(globalClampMarginInput(page)).toBeVisible();
  await globalClampMarginInput(page).fill("0.75");
  await expect(globalClampMarginInput(page)).toHaveValue("0.75");

  await expect(overrideGlobalMarginsCheckbox(page)).not.toBeChecked();
  await expect(
    autoNestMarginOverrideInput(page, "Left margin override"),
  ).toBeHidden();

  await overrideGlobalMarginsCheckbox(page).check();

  await expect(
    autoNestMarginOverrideInput(page, "Left margin override"),
  ).toBeVisible();
  await expect(
    autoNestMarginOverrideInput(page, "Right margin override"),
  ).toBeVisible();
  await expect(
    autoNestMarginOverrideInput(page, "Top margin override"),
  ).toBeVisible();
  await expect(
    autoNestMarginOverrideInput(page, "Bottom margin override"),
  ).toBeVisible();

  await autoNestMarginOverrideInput(page, "Left margin override").fill("0.5");
  await expect(
    autoNestMarginOverrideInput(page, "Left margin override"),
  ).toHaveValue("0.5");

  await autoNestToggle(page).click();

  await expect(autoNestToggle(page)).toHaveAttribute("aria-pressed", "false");
  await expect(autoNestSettingsButton(page)).toBeHidden();
  await expect(
    page.getByText("AutoNest: Two groups (0° + 90°)"),
  ).toBeHidden();
  await expect(rotatePartButton(page)).toBeEnabled();
  await expect(rotateRemButton(page)).toBeEnabled();
});

test("authenticated user sees computed AutoNest preview and returns to manual preview", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.addInitScript(seedComputedAutoNestState);
  await page.goto("/");

  await expect(autoNestToggle(page)).toHaveAttribute("aria-pressed", "true");
  await expect(autoNestPreview(page)).toBeVisible();
  await expect(manualNestPreview(page)).toBeHidden();
  await expect(visiblePartsSummary(page)).toContainText("Parts = 3");
  await expect(autoNestPreviewGroup(page, "0deg")).toContainText("0deg x2");
  await expect(autoNestPreviewGroup(page, "90deg")).toContainText("90deg x1");
  await expect(autoNestTrimLine(page)).toBeAttached();
  await expect(autoNestTrimLine(page)).toHaveCSS("stroke-width", "4px");
  await expect(autoNestTrimSummary(page)).toContainText(/Trim vertical @ \d/);
  await expect(page.getByText(/Offset X\d/)).toBeVisible();
  await expect(
    page.getByText(/AutoNest two-group:\s*3\s*\(\+1\)/),
  ).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(autoNestPreview(page)).toBeVisible();
  await expect(autoNestPreviewGroup(page, "0deg")).toBeVisible();
  await expect(autoNestPreviewGroup(page, "90deg")).toBeVisible();
  await expect(autoNestTrimSummary(page)).toBeVisible();

  await autoNestToggle(page).click();

  await expect(autoNestToggle(page)).toHaveAttribute("aria-pressed", "false");
  await expect(autoNestPreview(page)).toBeHidden();
  await expect(manualNestPreview(page)).toBeVisible();
});

test("authenticated user controls the trim-edge policy for Fixture 2", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.addInitScript(seedTrimPolicyFixtureState);
  await page.goto("/");
  await autoNestSettingsButton(page).click();

  await expect(autoNestTrimPolicyGroup(page)).toBeVisible();
  await expect(autoNestTrimPolicyOption(page, "Open")).toBeChecked();
  await expect(autoNestSharedTrimClearanceInput(page)).toBeHidden();
  await expect(visiblePartsSummary(page)).toContainText("Parts = 3");

  await autoNestTrimPolicySegment(page, "Full").click();
  await expect(autoNestTrimPolicyOption(page, "Full")).toBeChecked();
  await expect(autoNestSharedTrimClearanceInput(page)).toBeHidden();
  await expect(visiblePartsSummary(page)).toContainText("Parts = 2");
  await expect(page.getByText(/Best uniform:\s*2\s*\| Using uniform:\s*2/)).toBeVisible();

  await autoNestTrimPolicySegment(page, "Open").click();
  await expect(visiblePartsSummary(page)).toContainText("Parts = 3");
  await expect(page.getByText(/AutoNest two-group:\s*3\s*\(\+1\)/)).toBeVisible();

  await autoNestTrimPolicySegment(page, "Shared").click();
  await expect(autoNestSharedTrimClearanceInput(page)).toBeVisible();
  await autoNestSharedTrimClearanceInput(page).fill("0.03");
  await expect(visiblePartsSummary(page)).toContainText("Parts = 3");
  await autoNestSharedTrimClearanceInput(page).fill("0.05");
  await expect(visiblePartsSummary(page)).toContainText("Parts = 2");
  await expect(rotatePartButton(page)).toBeDisabled();
  await expect(rotateRemButton(page)).toBeDisabled();

  await expect
    .poll(async () =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("nestcalc-app-state-v3");
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return [
          parsed.autoNestSettings.trimEdgePolicy,
          parsed.autoNestSettings.sharedTrimClearance,
        ];
      }),
    )
    .toEqual(["shared", 0.05]);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(autoNestTrimPolicyGroup(page)).toBeInViewport();
  await expect(autoNestSharedTrimClearanceInput(page)).toBeInViewport();
  await autoNestSharedTrimClearanceInput(page).fill("0.03");
  await expect(autoNestPreview(page)).toBeVisible();
  await expect(autoNestTrimSummary(page)).toBeVisible();
});

test("operator fixture renders six truthful parts and a literal non-scaling three-point trim", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.addInitScript(seedOperatorPreviewState);
  await page.goto("/");

  await expect(visiblePartsSummary(page)).toContainText("Parts = 6");
  await expect(autoNestPart(page, "90deg")).toHaveCount(4);
  await expect(autoNestPart(page, "0deg")).toHaveCount(2);

  await expect(autoNestGroupBounds(page, "90deg")).toHaveAttribute("x", "0.53");
  await expect(autoNestGroupBounds(page, "90deg")).toHaveAttribute("y", "0.53");
  await expect(autoNestGroupBounds(page, "90deg")).toHaveAttribute("width", "6");
  await expect(autoNestGroupBounds(page, "90deg")).toHaveAttribute("height", "8.375");
  await expect(autoNestGroupBounds(page, "0deg")).toHaveAttribute("x", "6.53");
  await expect(autoNestGroupBounds(page, "0deg")).toHaveAttribute("width", "4.125");

  const ninetyGeometry = await autoNestPart(page, "90deg").evaluateAll((parts) =>
    parts.map((part) => ({
      x: Number(Number(part.getAttribute("x")).toFixed(3)),
      y: Number(Number(part.getAttribute("y")).toFixed(3)),
      width: Number(Number(part.getAttribute("width")).toFixed(3)),
      height: Number(Number(part.getAttribute("height")).toFixed(3)),
    })),
  );
  expect(ninetyGeometry).toEqual([
    { x: 0.53, y: 0.53, width: 6, height: 2 },
    { x: 0.53, y: 2.655, width: 6, height: 2 },
    { x: 0.53, y: 4.78, width: 6, height: 2 },
    { x: 0.53, y: 6.905, width: 6, height: 2 },
  ]);
  const zeroGeometry = await autoNestPart(page, "0deg").evaluateAll((parts) =>
    parts.map((part) => ({
      x: Number(Number(part.getAttribute("x")).toFixed(3)),
      y: Number(Number(part.getAttribute("y")).toFixed(3)),
      width: Number(Number(part.getAttribute("width")).toFixed(3)),
      height: Number(Number(part.getAttribute("height")).toFixed(3)),
    })),
  );
  expect(zeroGeometry).toEqual([
    { x: 6.53, y: 0.53, width: 2, height: 6 },
    { x: 8.655, y: 0.53, width: 2, height: 6 },
  ]);

  const trimContract = await autoNestTrimLine(page).evaluate((line) => {
    let authoredStrokeWidth = "";
    for (const sheet of Array.from(document.styleSheets)) {
      for (const rule of Array.from(sheet.cssRules)) {
        if (
          rule instanceof CSSStyleRule &&
          rule.selectorText === ".autonest-preview-trim-line"
        ) {
          authoredStrokeWidth = rule.style.getPropertyValue("stroke-width");
        }
      }
    }

    return {
      tagName: line.tagName.toLowerCase(),
      vectorEffect: line.getAttribute("vector-effect"),
      authoredStrokeWidth,
      computedStrokeWidth: getComputedStyle(line).strokeWidth,
    };
  });
  expect(trimContract).toEqual({
    tagName: "line",
    vectorEffect: "non-scaling-stroke",
    authoredStrokeWidth: "3pt",
    computedStrokeWidth: "4px",
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  fs.mkdirSync(path.join(__dirname, "../output/playwright/autonest-preview-v1"), {
    recursive: true,
  });
  await page.screenshot({
    path: path.join(__dirname, "../output/playwright/autonest-preview-v1/desktop.png"),
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(autoNestPart(page, "90deg")).toHaveCount(4);
  await expect(autoNestPart(page, "0deg")).toHaveCount(2);
  await expect(autoNestTrimLine(page)).toHaveCSS("stroke-width", "4px");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({
    path: path.join(__dirname, "../output/playwright/autonest-preview-v1/mobile.png"),
    fullPage: true,
  });
});

test("main margins control active AutoNest settings and preserve Manual margins", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.addInitScript(seedGlobalMarginState);
  await page.goto("/");

  await expect(page.getByText("AutoNest Margins", { exact: true })).toBeVisible();
  for (const side of ["Left", "Right", "Top", "Bottom"] as const) {
    await expect(mainMarginInput(page, side)).toHaveValue("0.53");
  }
  await expect(autoNestGroupBounds(page, "90deg")).toHaveAttribute("x", "0.53");
  await expect(autoNestGroupBounds(page, "90deg")).toHaveAttribute("y", "0.53");

  await mainMarginInput(page, "Left").fill("0.5");
  await expect(autoNestGroupBounds(page, "90deg")).toHaveAttribute("x", "0.5");
  await expect(autoNestTrimLine(page)).toHaveAttribute("x1", "6.5");
  await mainMarginInput(page, "Top").fill("0.75");
  await expect(autoNestGroupBounds(page, "90deg")).toHaveAttribute("y", "0.75");
  await mainMarginInput(page, "Right").fill("0.25");
  await mainMarginInput(page, "Bottom").fill("0.25");
  await autoNestSettingsButton(page).click();
  await expect(overrideGlobalMarginsCheckbox(page)).toBeChecked();
  await expect(autoNestMarginOverrideInput(page, "Left margin override")).toHaveValue("0.5");
  await expect(autoNestMarginOverrideInput(page, "Right margin override")).toHaveValue("0.25");
  await expect(autoNestMarginOverrideInput(page, "Top margin override")).toHaveValue("0.75");
  await expect(autoNestMarginOverrideInput(page, "Bottom margin override")).toHaveValue("0.25");
  await expect(autoNestPreviewGroup(page, "90deg")).toContainText(
    "M L0.500 R0 T0.750 B1.875",
  );
  await expect(autoNestPreviewGroup(page, "0deg")).toContainText(
    "M L0 R1.375 T0.750 B4.250",
  );

  await expect
    .poll(() =>
      page.evaluate(() => {
        const raw = localStorage.getItem("nestcalc-app-state-v3");
        if (!raw) return null;
        const state = JSON.parse(raw);
        return {
          enabled: state.autoNestSettings.overrideGlobalMargins,
          overrides: state.autoNestSettings.marginOverrides,
          manual: state.manualInputs.margins,
        };
      }),
    )
    .toEqual({
      enabled: true,
      overrides: { left: 0.5, right: 0.25, top: 0.75, bottom: 0.25 },
      manual: { left: 0.11, right: 0.22, top: 0.33, bottom: 0.44 },
    });

  await overrideGlobalMarginsCheckbox(page).uncheck();
  for (const side of ["Left", "Right", "Top", "Bottom"] as const) {
    await expect(mainMarginInput(page, side)).toHaveValue("0.53");
  }
  await overrideGlobalMarginsCheckbox(page).check();
  await expect(mainMarginInput(page, "Left")).toHaveValue("0.5");
  await expect(mainMarginInput(page, "Top")).toHaveValue("0.75");

  await autoNestToggle(page).click();
  await expect(page.getByText("Margins", { exact: true })).toBeVisible();
  await expect(mainMarginInput(page, "Left")).toHaveValue("0.11");
  await expect(mainMarginInput(page, "Right")).toHaveValue("0.22");
  await expect(mainMarginInput(page, "Top")).toHaveValue("0.33");
  await expect(mainMarginInput(page, "Bottom")).toHaveValue("0.44");

  await autoNestToggle(page).click();
  await expect(mainMarginInput(page, "Left")).toHaveValue("0.5");
  const persistedPage = await page.context().newPage();
  await persistedPage.goto("/");
  await expect(mainMarginInput(persistedPage, "Top")).toHaveValue("0.75");
  await persistedPage.close();
});

test("AutoNest preview caps its SVG tree honestly at 500 parts", async ({ page }) => {
  await page.addInitScript(seedCappedPreviewState);
  await page.goto("/");

  await expect(page.getByTestId("autonest-preview-cap")).toContainText(
    "Showing first 500 of",
  );
  await expect(
    page.locator('[data-testid^="autonest-part-"]'),
  ).toHaveCount(500);
});
