import fs from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
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
  calculatorTab,
  gcodeAngleInput,
  gcodeCopyButton,
  gcodeDiagnostics,
  gcodeDownloadButton,
  gcodeGenerateButton,
  gcodeOutput,
  gcodePreview,
  gcodePreviewStatus,
  gcodeRegion,
  gcodeSourceInput,
  gcodeTab,
  globalClampMarginInput,
  managePresetsButton,
  manualNestPreview,
  mainMarginInput,
  namedPresetsRegion,
  overrideGlobalMarginsCheckbox,
  presetChip,
  presetManager,
  presetOrder,
  presetRow,
  rotatePartButton,
  rotateRemButton,
  savedPresetChips,
  savePresetButton,
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

const fullPresetState = {
  version: 3,
  mode: "autonest",
  manualInputs: {
    partWidth: 2.75,
    partHeight: 1.125,
    remnantWidth: 48.5,
    remnantHeight: 19.25,
    margins: { left: 0.11, right: 0.22, top: 0.33, bottom: 0.44 },
    gapX: 0.0625,
    gapY: 0.125,
    partLinked: false,
    gapLinked: false,
    moveMarginsWithRotation: true,
    unit: "in",
  },
  autoNestSettings: {
    globalClampMargin: 0.625,
    trimEdgePolicy: "shared",
    sharedTrimClearance: 0.1875,
    overrideGlobalMargins: true,
    marginOverrides: { left: 0.5, right: 0.4, top: 0.3, bottom: 0.2 },
  },
} as const;

const supportedArcFixture =
  "G90 G21 G17\nG00 X1 Y0\nG03 X0 Y1 I-1";
const supportedArcFixtureAt90 =
  "G90 G21 G17\n" +
  "G00 X0.0000 Y1.0000\n" +
  "G03 X-1.0000 Y0.0000 I0.0000 J-1.0000";

async function waitForPresetStorage(page: Page) {
  await expect(namedPresetsRegion(page)).toHaveAttribute("aria-busy", "false", {
    timeout: 15_000,
  });
  await expect(savePresetButton(page)).toBeEnabled();
}

async function deletePresetDatabase(page: Page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase("nestcalc-presets");
      request.onsuccess = () => resolve();
      request.onerror = () =>
        reject(request.error ?? new Error("IndexedDB cleanup failed"));
      request.onblocked = () =>
        reject(new Error("IndexedDB cleanup was blocked by an open connection"));
    });
  });
}

async function openCleanAuthenticatedApp(
  page: Page,
  options: {
    path?: string;
    state?: unknown;
    theme?: "dark" | "light";
  } = {},
) {
  await page.goto("/");
  await waitForPresetStorage(page);
  await deletePresetDatabase(page);
  await page.evaluate(
    ({ state, theme }) => {
      window.localStorage.removeItem("nestcalc-app-state-v3");
      window.localStorage.removeItem("nestcalc-state-v2");
      window.localStorage.removeItem("nestcalc-state-v1");
      window.localStorage.removeItem("nestcalc-theme");
      if (state !== undefined) {
        window.localStorage.setItem(
          "nestcalc-app-state-v3",
          JSON.stringify(state),
        );
      }
      if (theme !== undefined) {
        window.localStorage.setItem("nestcalc-theme", theme);
      }
    },
    { state: options.state, theme: options.theme },
  );

  await page.goto(options.path ?? "/");
  await page.reload();
  if ((options.path ?? "").includes("#g-code")) {
    await expect(gcodeRegion(page)).toBeVisible();
  } else {
    await waitForPresetStorage(page);
  }
}

async function saveNamedPreset(
  page: Page,
  name: string,
  source: "rail" | "manager" = "rail",
) {
  if (source === "rail") {
    await savePresetButton(page).click();
  } else {
    await presetManager(page)
      .getByRole("button", { name: "Save As New", exact: true })
      .click();
  }

  const dialog = page.getByRole("dialog", { name: "Save Preset" });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Preset name", { exact: true }).fill(name);
  await dialog
    .getByRole("button", { name: "Save Preset", exact: true })
    .click();
  await expect(dialog).toBeHidden();
  await expect(presetChip(page, name)).toBeVisible();
  await waitForPresetStorage(page);
}

async function assertNoHorizontalOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
}

async function expectSelectedModuleTabVisual(
  page: Page,
  selectedName: "Calculator" | "G-code",
) {
  const selectedTab = page.getByRole("tab", {
    name: selectedName,
    exact: true,
  });
  const inactiveTab = page.getByRole("tab", {
    name: selectedName === "Calculator" ? "G-code" : "Calculator",
    exact: true,
  });

  await expect
    .poll(() =>
      selectedTab.evaluate((element) => {
        const probe = document.createElement("span");
        probe.style.backgroundColor = "var(--accent)";
        probe.style.color = "var(--background)";
        document.body.append(probe);
        const tabStyle = getComputedStyle(element);
        const probeStyle = getComputedStyle(probe);
        const matches =
          tabStyle.backgroundColor === probeStyle.backgroundColor &&
          tabStyle.color === probeStyle.color;
        probe.remove();
        return matches;
      }),
    )
    .toBe(true);
  await expect
    .poll(() =>
      inactiveTab.evaluate((element) => {
        const probe = document.createElement("span");
        probe.style.backgroundColor = "var(--accent)";
        document.body.append(probe);
        const matches =
          getComputedStyle(element).backgroundColor ===
          getComputedStyle(probe).backgroundColor;
        probe.remove();
        return matches;
      }),
    )
    .toBe(false);
}

async function captureShopHelpersScreenshot(page: Page, filename: string) {
  const outputDirectory = path.join(
    __dirname,
    "../output/playwright/shop-helpers-v1",
  );
  fs.mkdirSync(outputDirectory, { recursive: true });
  await page.screenshot({
    animations: "disabled",
    path: path.join(outputDirectory, filename),
    fullPage: true,
  });
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

test("named presets restore a complete version-3 state without changing theme and support overwrite", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await openCleanAuthenticatedApp(page, {
    state: fullPresetState,
    theme: "light",
  });

  await expect(namedPresetsRegion(page)).toHaveAccessibleDescription(
    /this browser or installed-app storage container/i,
  );
  await expect(
    namedPresetsRegion(page).getByText("Saved on this device only", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await saveNamedPreset(page, "Full Shop State");

  const storedPreset = await page.evaluate(async () => {
    function requestResult<T>(request: IDBRequest<T>): Promise<T> {
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () =>
          reject(request.error ?? new Error("IndexedDB request failed"));
      });
    }

    const database = await requestResult(indexedDB.open("nestcalc-presets", 1));
    const transaction = database.transaction("presets", "readonly");
    const records = (await requestResult(
      transaction.objectStore("presets").getAll(),
    )) as Array<Record<string, unknown>>;
    database.close();
    const record = records[0];
    const snapshot = record.snapshot as Record<string, unknown>;

    return {
      count: records.length,
      keys: Object.keys(record).sort(),
      ownerPresent:
        typeof record.ownerClerkUserId === "string" &&
        record.ownerClerkUserId.length > 0,
      snapshot,
      snapshotKeys: Object.keys(snapshot).sort(),
    };
  });

  expect(storedPreset).toEqual({
    count: 1,
    keys: [
      "createdAt",
      "name",
      "ownerClerkUserId",
      "presetId",
      "schemaVersion",
      "snapshot",
      "sortOrder",
      "updatedAt",
    ],
    ownerPresent: true,
    snapshot: fullPresetState,
    snapshotKeys: ["autoNestSettings", "manualInputs", "mode", "version"],
  });

  await autoNestSettingsButton(page).click();
  await globalClampMarginInput(page).fill("9");
  await autoNestTrimPolicySegment(page, "Full").click();
  await page.getByRole("button", { name: "Clear all fields" }).click();
  await autoNestToggle(page).click();
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await presetChip(page, "Full Shop State").click();
  await expect(autoNestToggle(page)).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel("X [PART]")).toHaveValue("2.75");
  await expect(page.getByLabel("Y [REM]")).toHaveValue("19.25");
  await expect(
    page.getByRole("checkbox", { name: "Move margins with rotation" }),
  ).toBeChecked();
  await expect
    .poll(() =>
      page.evaluate(() => {
        const raw = localStorage.getItem("nestcalc-app-state-v3");
        return raw ? JSON.parse(raw) : null;
      }),
    )
    .toEqual(fullPresetState);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(
    await page.evaluate(() => localStorage.getItem("nestcalc-theme")),
  ).toBe("dark");

  await autoNestSettingsButton(page).click();
  await expect(globalClampMarginInput(page)).toHaveValue("0.625");
  await expect(autoNestTrimPolicyOption(page, "Shared")).toBeChecked();
  await expect(autoNestSharedTrimClearanceInput(page)).toHaveValue("0.1875");
  await expect(overrideGlobalMarginsCheckbox(page)).toBeChecked();

  await page.getByLabel("X [PART]").fill("8.5");
  await managePresetsButton(page).click();
  await presetRow(page, "Full Shop State")
    .getByRole("button", { name: "Overwrite", exact: true })
    .click();
  await expect(presetManager(page).getByRole("status")).toContainText(
    "overwritten",
  );
  await presetManager(page)
    .getByRole("button", { name: "Close preset manager" })
    .click();
  await page.getByLabel("X [PART]").fill("1");
  await presetChip(page, "Full Shop State").click();
  await expect(page.getByLabel("X [PART]")).toHaveValue("8.5");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("preset manager renames, confirms deletion, reorders, reloads, and excludes a foreign owner", async ({
  page,
}) => {
  const alpha = "Alpha Long Shop Fixture";
  const bravo = "Bravo Long Shop Fixture";
  const charlie = "Charlie Long Shop Fixture";
  const renamedAlpha = "Alpha Renamed Fixture";

  await openCleanAuthenticatedApp(page);
  await saveNamedPreset(page, alpha);
  await managePresetsButton(page).click();
  await expect(
    presetManager(page).getByRole("button", { name: "Close preset manager" }),
  ).toBeFocused();
  await saveNamedPreset(page, bravo, "manager");
  await saveNamedPreset(page, charlie, "manager");

  await presetRow(page, alpha)
    .getByRole("button", { name: "Rename", exact: true })
    .click();
  const renameDialog = page.getByRole("dialog", { name: "Rename Preset" });
  await renameDialog.getByLabel("Preset name", { exact: true }).fill(renamedAlpha);
  await renameDialog
    .getByRole("button", { name: "Rename Preset", exact: true })
    .click();
  await expect(renameDialog).toBeHidden();
  await expect(presetRow(page, renamedAlpha)).toBeVisible();

  await presetRow(page, charlie)
    .getByRole("button", { name: `Move ${charlie} up`, exact: true })
    .click();
  await expect
    .poll(() =>
      presetOrder(page)
        .getByRole("button", { name: /^Load preset / })
        .allTextContents(),
    )
    .toEqual([renamedAlpha, charlie, bravo]);
  await presetRow(page, charlie)
    .getByRole("button", { name: `Move ${charlie} up`, exact: true })
    .click();
  await expect
    .poll(() =>
      presetOrder(page)
        .getByRole("button", { name: /^Load preset / })
        .allTextContents(),
    )
    .toEqual([charlie, renamedAlpha, bravo]);

  await presetRow(page, bravo)
    .getByRole("button", { name: "Delete", exact: true })
    .click();
  const deleteDialog = page.getByRole("dialog", { name: "Delete preset?" });
  await expect(deleteDialog).toContainText(bravo);
  await deleteDialog
    .getByRole("button", { name: "Confirm Delete", exact: true })
    .click();
  await expect(deleteDialog).toBeHidden();
  await expect(presetChip(page, bravo)).toHaveCount(0);

  await page.evaluate(async (foreignName) => {
    function requestResult<T>(request: IDBRequest<T>): Promise<T> {
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () =>
          reject(request.error ?? new Error("IndexedDB request failed"));
      });
    }

    const database = await requestResult(indexedDB.open("nestcalc-presets", 1));
    const readTransaction = database.transaction("presets", "readonly");
    const records = (await requestResult(
      readTransaction.objectStore("presets").getAll(),
    )) as Array<Record<string, unknown>>;
    const template = records[0];
    const foreignRecord = {
      ...structuredClone(template),
      ownerClerkUserId: `${String(template.ownerClerkUserId)}-foreign-e2e`,
      presetId: crypto.randomUUID(),
      name: foreignName,
      sortOrder: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const writeTransaction = database.transaction("presets", "readwrite");
    const completion = new Promise<void>((resolve, reject) => {
      writeTransaction.oncomplete = () => resolve();
      writeTransaction.onerror = () =>
        reject(
          writeTransaction.error ?? new Error("IndexedDB transaction failed"),
        );
      writeTransaction.onabort = () =>
        reject(writeTransaction.error ?? new Error("IndexedDB transaction aborted"));
    });
    writeTransaction.objectStore("presets").put(foreignRecord);
    await completion;
    database.close();
  }, "Foreign Owner Only");

  await page.reload();
  await waitForPresetStorage(page);
  await expect(presetChip(page, "Foreign Owner Only")).toHaveCount(0);
  await expect
    .poll(() =>
      savedPresetChips(page)
        .getByRole("button", { name: /^Load preset / })
        .allTextContents(),
    )
    .toEqual([charlie, renamedAlpha]);

  const allStoredNames = await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("nestcalc-presets", 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject(request.error ?? new Error("IndexedDB open failed"));
    });
    const names = await new Promise<string[]>((resolve, reject) => {
      const request = database.transaction("presets", "readonly")
        .objectStore("presets")
        .getAll();
      request.onsuccess = () =>
        resolve(
          (request.result as Array<{ name: string }>).map(
            (record) => record.name,
          ),
        );
      request.onerror = () =>
        reject(request.error ?? new Error("IndexedDB read failed"));
    });
    database.close();
    return names;
  });
  expect(allStoredNames).toContain("Foreign Owner Only");

  await page.setViewportSize({ width: 390, height: 844 });
  const railMetrics = await savedPresetChips(page).evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(railMetrics.scrollWidth).toBeGreaterThan(railMetrics.clientWidth);
  await assertNoHorizontalOverflow(page);
  await managePresetsButton(page).click();
  const closeManager = presetManager(page).getByRole("button", {
    name: "Close preset manager",
  });
  await expect(closeManager).toBeFocused();
  const managerBounds = await presetManager(page).boundingBox();
  expect(managerBounds).not.toBeNull();
  expect(managerBounds?.x).toBeGreaterThanOrEqual(0);
  expect((managerBounds?.x ?? 0) + (managerBounds?.width ?? 0)).toBeLessThanOrEqual(
    390,
  );
  expect((managerBounds?.y ?? 0) + (managerBounds?.height ?? 0)).toBeLessThanOrEqual(
    844,
  );
  await assertNoHorizontalOverflow(page);
});

test("an in-flight preset load cannot commit stale state across a sign-out generation", async ({
  page,
}) => {
  await openCleanAuthenticatedApp(page);
  await page.getByLabel("X [PART]").fill("12");
  await saveNamedPreset(page, "Generation Guard");
  await page.getByLabel("X [PART]").fill("99");

  await page.evaluate(() => {
    type DelayProbe = {
      delayNextGet: boolean;
      delayedGetCompleted: boolean;
    };
    const probeWindow = window as Window & {
      __nestcalcPresetDelayProbe?: DelayProbe;
    };
    const probe: DelayProbe = {
      delayNextGet: true,
      delayedGetCompleted: false,
    };
    const originalGet = IDBObjectStore.prototype.get;

    Object.defineProperty(IDBObjectStore.prototype, "get", {
      configurable: true,
      value: function delayedPresetGet(
        this: IDBObjectStore,
        query: IDBValidKey | IDBKeyRange,
      ) {
        const request = originalGet.call(this, query);
        if (this.name !== "presets" || !probe.delayNextGet) return request;
        probe.delayNextGet = false;

        return new Proxy(request, {
          get(target, property) {
            return Reflect.get(target, property, target);
          },
          set(target, property, value) {
            if (property === "onsuccess" && typeof value === "function") {
              const delayedSuccess = (event: Event) => {
                window.setTimeout(() => {
                  probe.delayedGetCompleted = true;
                  Reflect.apply(value, target, [event]);
                }, 2_000);
              };
              return Reflect.set(target, property, delayedSuccess, target);
            }
            return Reflect.set(target, property, value, target);
          },
        });
      },
    });
    probeWindow.__nestcalcPresetDelayProbe = probe;
  });

  await presetChip(page, "Generation Guard").click();
  await expect(namedPresetsRegion(page)).toHaveAttribute("aria-busy", "true");

  const originalSessionId = await page.evaluate(async () => {
    type ClerkSession = { id: string };
    type ClerkClient = {
      session: ClerkSession | null;
      setActive(options: { session: ClerkSession | null }): Promise<void>;
    };
    const sessionWindow = window as Window & {
      Clerk: ClerkClient;
      __nestcalcOriginalClerkSession?: ClerkSession;
    };
    const session = sessionWindow.Clerk.session;
    if (!session) throw new Error("Authenticated Clerk session unavailable");
    sessionWindow.__nestcalcOriginalClerkSession = session;
    await sessionWindow.Clerk.setActive({ session: null });
    return session.id;
  });
  await expect(savePresetButton(page)).toBeDisabled();

  await page.evaluate(async () => {
    type ClerkSession = { id: string };
    type ClerkClient = {
      setActive(options: { session: ClerkSession | null }): Promise<void>;
    };
    const sessionWindow = window as Window & {
      Clerk: ClerkClient;
      __nestcalcOriginalClerkSession?: ClerkSession;
    };
    const session = sessionWindow.__nestcalcOriginalClerkSession;
    if (!session) throw new Error("Original Clerk session unavailable");
    await sessionWindow.Clerk.setActive({ session });
  });
  await expect
    .poll(() =>
      page.evaluate(() => {
        const sessionWindow = window as Window & {
          Clerk: { session: { id: string } | null };
        };
        return sessionWindow.Clerk.session?.id ?? null;
      }),
    )
    .toBe(originalSessionId);
  await waitForPresetStorage(page);

  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as Window & {
              __nestcalcPresetDelayProbe?: {
                delayedGetCompleted: boolean;
              };
            }
          ).__nestcalcPresetDelayProbe?.delayedGetCompleted ?? false,
      ),
    )
    .toBe(true);
  await expect(page.getByLabel("X [PART]")).toHaveValue("99");
  await expect(namedPresetsRegion(page)).toHaveAttribute("aria-busy", "false");
  await expect(savePresetButton(page)).toBeEnabled();
  await expect(namedPresetsRegion(page).getByRole("status")).toHaveText(
    "1 saved preset loaded.",
  );

  await presetChip(page, "Generation Guard").click();
  await expect(page.getByLabel("X [PART]")).toHaveValue("12");
  await expect(namedPresetsRegion(page).getByRole("status")).toContainText(
    "Generation Guard",
  );
});

test("preset storage open failures are surfaced without claiming persistence", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const originalOpen = IDBFactory.prototype.open;
    Object.defineProperty(IDBFactory.prototype, "open", {
      configurable: true,
      value: function openWithPresetFailure(
        this: IDBFactory,
        name: string,
        version?: number,
      ) {
        if (name === "nestcalc-presets") {
          throw new DOMException("Blocked for E2E proof", "UnknownError");
        }
        return version === undefined
          ? originalOpen.call(this, name)
          : originalOpen.call(this, name, version);
      },
    });
  });
  await page.goto("/");

  await expect(namedPresetsRegion(page).getByRole("alert")).toContainText(
    "Preset storage could not be opened.",
  );
  await expect(namedPresetsRegion(page)).toHaveAttribute("aria-busy", "false");
  await savePresetButton(page).click();
  const dialog = page.getByRole("dialog", { name: "Save Preset" });
  await dialog.getByLabel("Preset name", { exact: true }).fill("Will Not Persist");
  await dialog
    .getByRole("button", { name: "Save Preset", exact: true })
    .click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("alert")).toContainText(
    "Preset storage could not be opened.",
  );
  await expect(presetChip(page, "Will Not Persist")).toHaveCount(0);
  await expect(namedPresetsRegion(page).getByRole("status")).toBeEmpty();
});

test("module tabs honor deep links, keyboard and history while preserving calculator state", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await openCleanAuthenticatedApp(page);

  await expect(calculatorTab(page)).toHaveAttribute("aria-selected", "true");
  await expect(calculatorTab(page)).toHaveAttribute("tabindex", "0");
  await page.getByLabel("X [PART]").fill("7.25");
  await autoNestToggle(page).click();
  await assertNoHorizontalOverflow(page);
  await expectSelectedModuleTabVisual(page, "Calculator");
  await captureShopHelpersScreenshot(page, "calculator-desktop.png");

  await gcodeTab(page).click();
  await expect(page).toHaveURL(/\/#g-code$/);
  await expect(gcodeTab(page)).toHaveAttribute("aria-selected", "true");
  await expect(gcodeRegion(page)).toBeVisible();
  await expect(autoNestToggle(page)).toBeHidden();
  await expect(page.getByRole("button", { name: "Clear all fields" })).toHaveCount(
    0,
  );
  await expect(
    page.getByRole("button", { name: /Switch to (?:millimeters|inches)/ }),
  ).toHaveCount(0);
  await gcodeSourceInput(page).fill(supportedArcFixture);
  await gcodeAngleInput(page).fill("90");
  await expect(gcodePreviewStatus(page)).toHaveText("Preview ready.");
  await assertNoHorizontalOverflow(page);
  await expectSelectedModuleTabVisual(page, "G-code");
  await captureShopHelpersScreenshot(page, "gcode-desktop.png");

  await page.goBack();
  await expect(page).not.toHaveURL(/#g-code$/);
  await expect(calculatorTab(page)).toHaveAttribute("aria-selected", "true");
  await expect(page.getByLabel("X [PART]")).toHaveValue("7.25");
  await expect(autoNestToggle(page)).toHaveAttribute("aria-pressed", "true");

  await page.goForward();
  await expect(page).toHaveURL(/\/#g-code$/);
  await expect(gcodeTab(page)).toHaveAttribute("aria-selected", "true");
  await gcodeTab(page).focus();
  await gcodeTab(page).press("Home");
  await expect(calculatorTab(page)).toBeFocused();
  await expect(calculatorTab(page)).toHaveAttribute("aria-selected", "true");
  await expect(page).not.toHaveURL(/#g-code$/);
  await expect(page.getByLabel("X [PART]")).toHaveValue("7.25");

  const deepLinkPage = await page.context().newPage();
  await deepLinkPage.goto("/#g-code");
  await expect(gcodeTab(deepLinkPage)).toHaveAttribute("aria-selected", "true");
  await expect(gcodeRegion(deepLinkPage)).toBeVisible();
  await deepLinkPage.close();

  await page.setViewportSize({ width: 390, height: 844 });
  await assertNoHorizontalOverflow(page);
  await expectSelectedModuleTabVisual(page, "Calculator");
  await captureShopHelpersScreenshot(page, "calculator-mobile.png");
  await gcodeTab(page).click();
  await expect(gcodeRegion(page)).toBeVisible();
  await assertNoHorizontalOverflow(page);
  await expectSelectedModuleTabVisual(page, "G-code");
  await captureShopHelpersScreenshot(page, "gcode-mobile.png");
});

test("supported G-code generates exact output, previews bounds, copies, downloads, and blocks stale output", async ({
  page,
}) => {
  await openCleanAuthenticatedApp(page, { path: "/#g-code" });
  await expect(gcodeTab(page)).toHaveAttribute("aria-selected", "true");
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"], {
    origin: new URL(page.url()).origin,
  });

  await gcodeSourceInput(page).fill(supportedArcFixture);
  await gcodeAngleInput(page).fill("90");
  await expect(gcodePreviewStatus(page)).toHaveText("Preview ready.", {
    timeout: 2_000,
  });
  await expect(
    page.getByRole("heading", { name: "Conservative bounds preview" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Rotated input bounds; may be larger than the actual toolpath.",
      { exact: true },
    ),
  ).toBeVisible();
  const preview = gcodePreview(page);
  await expect(
    preview.locator("dl > div").filter({ hasText: "Min X" }).locator("dd"),
  ).toHaveText("-1.000");
  await expect(
    preview.locator("dl > div").filter({ hasText: "Max X" }).locator("dd"),
  ).toHaveText("0.000");
  await expect(
    preview.locator("dl > div").filter({ hasText: "Min Y" }).locator("dd"),
  ).toHaveText("0.000");
  await expect(
    preview.locator("dl > div").filter({ hasText: "Max Y" }).locator("dd"),
  ).toHaveText("1.000");

  await gcodeGenerateButton(page).click();
  await expect(gcodeOutput(page)).toHaveValue(supportedArcFixtureAt90);
  await expect(gcodeCopyButton(page)).toBeEnabled();
  await expect(gcodeDownloadButton(page)).toBeEnabled();

  await gcodeCopyButton(page).click();
  await expect(page.getByTestId("gcode-output-status")).toHaveText("Copied.");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    supportedArcFixtureAt90,
  );

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    gcodeDownloadButton(page).click(),
  ]);
  expect(download.suggestedFilename()).toBe("nestcalc-rotated.nc");
  const downloadedPath = await download.path();
  expect(downloadedPath).not.toBeNull();
  expect(await fs.promises.readFile(downloadedPath as string, "utf8")).toBe(
    supportedArcFixtureAt90,
  );
  await expect(page.getByTestId("gcode-output-status")).toHaveText(
    "Downloaded nestcalc-rotated.nc.",
  );

  await gcodeAngleInput(page).fill("45");
  await expect(page.getByTestId("gcode-output-stale")).toHaveText(
    "Output out of date — Generate again.",
  );
  await expect(gcodeOutput(page)).toHaveValue(supportedArcFixtureAt90);
  await expect(gcodeCopyButton(page)).toBeDisabled();
  await expect(gcodeDownloadButton(page)).toBeDisabled();
  await gcodeGenerateButton(page).click();
  await expect(gcodeOutput(page)).toHaveValue(
    "G90 G21 G17\n" +
      "G00 X0.7071 Y0.7071\n" +
      "G03 X-0.7071 Y0.7071 I-0.7071 J-0.7071",
  );
  await expect(gcodeCopyButton(page)).toBeEnabled();

  await gcodeSourceInput(page).fill(`${supportedArcFixture}\n; newest source`);
  await expect(page.getByTestId("gcode-output-stale")).toHaveText(
    "Output out of date — Generate again.",
  );
  await expect(gcodeCopyButton(page)).toBeDisabled();
  await expect(gcodeDownloadButton(page)).toBeDisabled();

  const omittedAxisInches =
    "G90 G20\n" +
    "G00 X10 Y20 (home)\n" +
    "G01 X12.345678 F200 ; keep feed";
  const omittedAxisInchesOutput =
    "G90 G20\n" +
    "G00 X10.00000 Y20.00000 (home)\n" +
    "G01 X12.34568 F200 Y20.00000 ; keep feed";
  await gcodeSourceInput(page).fill(omittedAxisInches);
  await gcodeAngleInput(page).fill("0");
  await gcodeGenerateButton(page).click();
  await expect(gcodeOutput(page)).toHaveValue(omittedAxisInchesOutput);
  await expect(gcodeOutput(page)).not.toHaveValue(/X12\.3457(?:\s|$)/);
  await expect(gcodeCopyButton(page)).toBeEnabled();
  await expect(gcodeDownloadButton(page)).toBeEnabled();
});

test("live G-code scheduling keeps only the newest source and one angle-preview frame", async ({
  page,
}) => {
  await openCleanAuthenticatedApp(page, { path: "/#g-code" });

  await page.evaluate(() => {
    type SchedulingProbe = {
      captureSourceTimers: boolean;
      sourceTimersScheduled: number;
      sourceTimersCancelled: number;
      sourceTimersExecuted: number;
      captureRafs: boolean;
      rafScheduled: number;
      rafCancelled: number;
      rafExecuted: number;
      rafOutstanding: number;
      rafMaxOutstanding: number;
    };
    const probeWindow = window as Window & {
      __nestcalcSchedulingProbe?: SchedulingProbe;
    };
    const probe: SchedulingProbe = {
      captureSourceTimers: false,
      sourceTimersScheduled: 0,
      sourceTimersCancelled: 0,
      sourceTimersExecuted: 0,
      captureRafs: false,
      rafScheduled: 0,
      rafCancelled: 0,
      rafExecuted: 0,
      rafOutstanding: 0,
      rafMaxOutstanding: 0,
    };
    const trackedSourceTimers = new Set<number>();
    const trackedRafs = new Set<number>();
    const originalSetTimeout = window.setTimeout.bind(window);
    const originalClearTimeout = window.clearTimeout.bind(window);
    const originalRequestAnimationFrame =
      window.requestAnimationFrame.bind(window);
    const originalCancelAnimationFrame =
      window.cancelAnimationFrame.bind(window);

    window.setTimeout = ((
      handler: TimerHandler,
      timeout?: number,
      ...handlerArguments: unknown[]
    ) => {
      if (
        probe.captureSourceTimers &&
        timeout === 50 &&
        typeof handler === "function"
      ) {
        probe.sourceTimersScheduled += 1;
        let timerId = 0;
        timerId = originalSetTimeout(() => {
          trackedSourceTimers.delete(timerId);
          probe.sourceTimersExecuted += 1;
          (handler as (...args: unknown[]) => void)(...handlerArguments);
        }, timeout);
        trackedSourceTimers.add(timerId);
        return timerId;
      }

      return originalSetTimeout(handler, timeout, ...handlerArguments);
    }) as typeof window.setTimeout;

    window.clearTimeout = ((timerId?: number) => {
      if (timerId !== undefined && trackedSourceTimers.delete(timerId)) {
        probe.sourceTimersCancelled += 1;
      }
      originalClearTimeout(timerId);
    }) as typeof window.clearTimeout;

    window.requestAnimationFrame = ((callback: FrameRequestCallback) => {
      if (!probe.captureRafs) return originalRequestAnimationFrame(callback);

      probe.rafScheduled += 1;
      probe.rafOutstanding += 1;
      probe.rafMaxOutstanding = Math.max(
        probe.rafMaxOutstanding,
        probe.rafOutstanding,
      );
      let frameId = 0;
      frameId = originalRequestAnimationFrame((timestamp) => {
        if (trackedRafs.delete(frameId)) probe.rafOutstanding -= 1;
        probe.rafExecuted += 1;
        callback(timestamp);
      });
      trackedRafs.add(frameId);
      return frameId;
    }) as typeof window.requestAnimationFrame;

    window.cancelAnimationFrame = ((frameId: number) => {
      if (trackedRafs.delete(frameId)) {
        probe.rafOutstanding -= 1;
        probe.rafCancelled += 1;
      }
      originalCancelAnimationFrame(frameId);
    }) as typeof window.cancelAnimationFrame;

    probeWindow.__nestcalcSchedulingProbe = probe;
  });

  await gcodeSourceInput(page).evaluate(
    (element, sourceRevisions) => {
      const textarea = element as HTMLTextAreaElement;
      const valueSetter = Object.getOwnPropertyDescriptor(
        HTMLTextAreaElement.prototype,
        "value",
      )?.set;
      const probeWindow = window as Window & {
        __nestcalcSchedulingProbe?: { captureSourceTimers: boolean };
      };
      const probe = probeWindow.__nestcalcSchedulingProbe;
      if (!valueSetter || !probe) throw new Error("Scheduling probe unavailable");

      probe.captureSourceTimers = true;
      try {
        for (const sourceRevision of sourceRevisions) {
          valueSetter.call(textarea, sourceRevision);
          textarea.dispatchEvent(new Event("input", { bubbles: true }));
        }
      } finally {
        probe.captureSourceTimers = false;
      }
    },
    [
      "G90 G21\nG00 Xbad Y1",
      "G90 G21\nG00 X2 Y3",
      "G90 G21\nG00 X4 Y5",
    ],
  );

  await expect(gcodeSourceInput(page)).toHaveValue("G90 G21\nG00 X4 Y5");
  await expect(gcodePreviewStatus(page)).toHaveText("Preview ready.");
  await expect(gcodeDiagnostics(page)).toHaveCount(0);
  await expect(
    gcodePreview(page).locator("dl > div").filter({ hasText: "Min X" }).locator("dd"),
  ).toHaveText("4.000");

  const sourceTimerProof = await page.evaluate(() => {
    const probe = (
      window as Window & {
        __nestcalcSchedulingProbe?: {
          sourceTimersScheduled: number;
          sourceTimersCancelled: number;
          sourceTimersExecuted: number;
        };
      }
    ).__nestcalcSchedulingProbe;
    if (!probe) throw new Error("Scheduling probe unavailable");
    return {
      scheduled: probe.sourceTimersScheduled,
      cancelled: probe.sourceTimersCancelled,
      executed: probe.sourceTimersExecuted,
    };
  });
  expect(sourceTimerProof).toEqual({ scheduled: 3, cancelled: 2, executed: 1 });

  await gcodeGenerateButton(page).click();
  const zeroDegreeOutput = "G90 G21\nG00 X4.0000 Y5.0000";
  await expect(gcodeOutput(page)).toHaveValue(zeroDegreeOutput);

  await page.evaluate(() => {
    const probe = (
      window as Window & {
        __nestcalcSchedulingProbe?: {
          captureRafs: boolean;
          rafScheduled: number;
          rafCancelled: number;
          rafExecuted: number;
          rafOutstanding: number;
          rafMaxOutstanding: number;
        };
      }
    ).__nestcalcSchedulingProbe;
    if (!probe) throw new Error("Scheduling probe unavailable");
    probe.rafScheduled = 0;
    probe.rafCancelled = 0;
    probe.rafExecuted = 0;
    probe.rafOutstanding = 0;
    probe.rafMaxOutstanding = 0;
    probe.captureRafs = true;
  });

  await gcodeAngleInput(page).evaluate((element, angleRevisions) => {
    const input = element as HTMLInputElement;
    const valueSetter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )?.set;
    if (!valueSetter) throw new Error("Native input value setter unavailable");

    for (const angleRevision of angleRevisions) {
      valueSetter.call(input, angleRevision);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }, ["15", "45", "90"]);

  await expect(gcodeAngleInput(page)).toHaveValue("90");
  await expect(
    gcodePreview(page).locator("dl > div").filter({ hasText: "Min X" }).locator("dd"),
  ).toHaveText("-5.000");
  await expect(
    gcodePreview(page).locator("dl > div").filter({ hasText: "Min Y" }).locator("dd"),
  ).toHaveText("4.000");

  const frameProof = await page.evaluate(() => {
    const probe = (
      window as Window & {
        __nestcalcSchedulingProbe?: {
          captureRafs: boolean;
          rafScheduled: number;
          rafCancelled: number;
          rafExecuted: number;
          rafOutstanding: number;
          rafMaxOutstanding: number;
        };
      }
    ).__nestcalcSchedulingProbe;
    if (!probe) throw new Error("Scheduling probe unavailable");
    probe.captureRafs = false;
    return {
      scheduled: probe.rafScheduled,
      cancelled: probe.rafCancelled,
      executed: probe.rafExecuted,
      outstanding: probe.rafOutstanding,
      maxOutstanding: probe.rafMaxOutstanding,
    };
  });
  expect(frameProof).toEqual({
    scheduled: 1,
    cancelled: 0,
    executed: 1,
    outstanding: 0,
    maxOutstanding: 1,
  });

  await expect(gcodeOutput(page)).toHaveValue(zeroDegreeOutput);
  await expect(page.getByTestId("gcode-output-stale")).toHaveText(
    "Output out of date — Generate again.",
  );
  await expect(gcodeCopyButton(page)).toBeDisabled();
  await expect(gcodeDownloadButton(page)).toBeDisabled();
});

test("G-code generation fails closed with every required line-specific diagnostic", async ({
  page,
}) => {
  test.slow();
  await openCleanAuthenticatedApp(page, { path: "/#g-code" });

  const cases = [
    {
      name: "unterminated parenthesized comment",
      source: "G90 G21\nG00 X1 Y1 (unfinished",
      line: 2,
      reason: "Unterminated parenthesized comment",
    },
    {
      name: "malformed numeric word",
      source: "G90 G21\nG00 Xnope Y1",
      line: 2,
      reason: "Malformed numeric word X",
    },
    {
      name: "non-finite exponent",
      source: "G90 G21\nG00 X1e309 Y1",
      line: 2,
      reason: "must be finite",
    },
    {
      name: "Infinity numeric word",
      source: "G90 G21\nG00 XInfinity Y1",
      line: 2,
      reason: "must be finite",
    },
    {
      name: "NaN numeric word",
      source: "G90 G21\nG00 XNaN Y1",
      line: 2,
      reason: "must be finite",
    },
    {
      name: "macro variable",
      source: "G90 G21\n#1=2",
      line: 2,
      reason: "Unsupported executable token",
    },
    {
      name: "ACSPL ARC1",
      source: "G90 G21\nARC1 X1 Y1",
      line: 2,
      reason: "Malformed numeric word A",
    },
    {
      name: "ACSPL ARC2",
      source: "G90 G21\nARC2 X1 Y1",
      line: 2,
      reason: "Malformed numeric word A",
    },
    {
      name: "ACSPL CONNECT",
      source: "G90 G21\nCONNECT X1 Y1",
      line: 2,
      reason: "Malformed numeric word C",
    },
    {
      name: "subprogram label",
      source: "G90 G21\nO1000",
      line: 2,
      reason: "O-word",
    },
    {
      name: "M97 subprogram execution",
      source: "G90 G21\nM97 P1000",
      line: 2,
      reason: "M97",
    },
    {
      name: "M98 subprogram execution",
      source: "G90 G21\nM98 P1000",
      line: 2,
      reason: "M98",
    },
    {
      name: "M99 subprogram execution",
      source: "G90 G21\nM99",
      line: 2,
      reason: "M99",
    },
    {
      name: "M198 subprogram execution",
      source: "G90 G21\nM198 P1000",
      line: 2,
      reason: "M198",
    },
    {
      name: "incremental distance mode",
      source: "G90 G21\nG91 G01 X1 Y1",
      line: 2,
      reason: "G91",
    },
    {
      name: "motion before units",
      source: "G90 G00 X1 Y1",
      line: 1,
      reason: "G20 or G21",
    },
    {
      name: "motion before absolute mode",
      source: "G20 G00 X1 Y1",
      line: 1,
      reason: "G90",
    },
    {
      name: "coordinate block before motion mode",
      source: "G90 G21\nX1 Y1",
      line: 2,
      reason: "Motion mode",
    },
    {
      name: "non-XY coordinate before motion mode",
      source: "G90 G21\nZ1\nG00 X0 Y0",
      line: 2,
      reason: "Motion mode",
    },
    {
      name: "non-XY coordinate before absolute mode",
      source: "G21 G00 Z1\nG00 X0 Y0",
      line: 1,
      reason: "G90",
    },
    {
      name: "non-XY coordinate before unit mode",
      source: "G90 G00 Z1\nG00 X0 Y0",
      line: 1,
      reason: "G20 or G21",
    },
    {
      name: "unknown initial X",
      source: "G90 G21\nG00 Y1",
      line: 2,
      reason: "X position",
    },
    {
      name: "unknown initial Y",
      source: "G90 G21\nG00 X1",
      line: 2,
      reason: "Y position",
    },
    {
      name: "arc before XY plane",
      source: "G90 G21\nG00 X0 Y0\nG02 X1 Y0 I0.5 J0",
      line: 3,
      reason: "G17",
    },
    {
      name: "arc before a known start",
      source: "G90 G21 G17\nG02 X1 Y0 I0.5 J0",
      line: 2,
      reason: "Arc start",
    },
    {
      name: "input arc radius mismatch",
      source: "G90 G21 G17\nG00 X0 Y0\nG02 X2 Y0 I0.5 J0",
      line: 3,
      reason: "radii differ",
    },
    {
      name: "R-word arc",
      source: "G90 G21 G17\nG00 X0 Y0\nG02 X1 Y1 R1",
      line: 3,
      reason: "R-word",
    },
    {
      name: "helical arc",
      source: "G90 G21 G17\nG00 X0 Y0\nG02 X1 Y0 Z1 I0.5 J0",
      line: 3,
      reason: "non-XY axis",
    },
    {
      name: "non-finite derived arc geometry",
      source: "G90 G21 G17\nG00 X0 Y0\nG03 X0 Y0 I1.7e308 J1.7e308",
      line: 3,
      reason: "Derived arc geometry must remain finite",
    },
    {
      name: "non-finite derived arc bounds",
      source: "G90 G21 G17\nG00 X1e308 Y0\nG03 X1e308 Y0 I5e307 J0",
      line: 3,
      reason: "Derived arc bounds must remain finite",
    },
    {
      name: "arc word outside an arc",
      source: "G90 G21\nG00 X0 Y0\nG01 X1 Y1 I0.5",
      line: 3,
      reason: "supported only for G02/G03 arcs",
    },
    {
      name: "duplicate coordinate",
      source: "G90 G21\nG00 X1 X2 Y0",
      line: 2,
      reason: "Multiple X",
    },
    {
      name: "duplicate Y coordinate",
      source: "G90 G21\nG00 X1 Y0 Y2",
      line: 2,
      reason: "Multiple Y",
    },
    {
      name: "duplicate I offset",
      source: "G90 G21 G17\nG00 X0 Y0\nG02 X1 Y0 I0.5 I0.5 J0",
      line: 3,
      reason: "Multiple I",
    },
    {
      name: "duplicate J offset",
      source: "G90 G21 G17\nG00 X0 Y0\nG02 X1 Y0 I0.5 J0 J0",
      line: 3,
      reason: "Multiple J",
    },
    {
      name: "duplicate R radius",
      source: "G90 G21 G17\nG00 X0 Y0\nG02 X1 Y0 R1 R2",
      line: 3,
      reason: "Multiple R",
    },
    {
      name: "conflicting motion modes",
      source: "G90 G21\nG00 G01 X1 Y1",
      line: 2,
      reason: "Conflicting modal motion",
    },
    {
      name: "conflicting distance modes",
      source: "G90 G91 G21 G00 X1 Y1",
      line: 1,
      reason: "Conflicting distance",
    },
    {
      name: "conflicting unit modes",
      source: "G90 G20 G21 G00 X1 Y1",
      line: 1,
      reason: "Conflicting unit",
    },
    {
      name: "conflicting planes",
      source: "G90 G21 G17 G18",
      line: 1,
      reason: "Conflicting plane",
    },
    {
      name: "G18 plane",
      source: "G90 G21\nG18",
      line: 2,
      reason: "G18",
    },
    {
      name: "G19 plane",
      source: "G90 G21\nG19",
      line: 2,
      reason: "G19",
    },
    {
      name: "G53 machine coordinates",
      source: "G90 G21\nG53 G00 X1 Y1",
      line: 2,
      reason: "G53",
    },
    {
      name: "G52 local coordinates",
      source: "G90 G21\nG52 X1 Y1",
      line: 2,
      reason: "G52",
    },
    {
      name: "G68 coordinate rotation",
      source: "G90 G21\nG68 X0 Y0 R45",
      line: 2,
      reason: "G68",
    },
    {
      name: "G69 coordinate rotation cancel",
      source: "G90 G21\nG69",
      line: 2,
      reason: "G69",
    },
    {
      name: "G92 coordinate offset",
      source: "G90 G21\nG92 X0 Y0",
      line: 2,
      reason: "G92",
    },
    {
      name: "G28 reference return",
      source: "G90 G21\nG28 X0 Y0",
      line: 2,
      reason: "G28",
    },
    {
      name: "G30 reference return",
      source: "G90 G21\nG30 X0 Y0",
      line: 2,
      reason: "G30",
    },
    {
      name: "canned cycle",
      source: "G90 G21\nG81 X1 Y1",
      line: 2,
      reason: "G81",
    },
    {
      name: "unit switch after motion",
      source: "G90 G20\nG00 X1 Y2\nG21\nG01 Y25.4",
      line: 3,
      reason: "Unit changes after motion",
    },
    {
      name: "unit switch after non-XY motion",
      source: "G90 G20 G00 Z1\nG21\nG00 X0 Y0",
      line: 2,
      reason: "Unit changes after motion",
    },
    {
      name: "non-finite derived toolpath span",
      source: "G90 G21\nG00 X-1.7e308 Y0\nG01 X1.7e308 Y0",
      line: 3,
      reason: "Derived toolpath bounds span must remain finite",
    },
    {
      name: "non-finite derived preview bounds",
      source: "G90 G21\nG00 X1.7e308 Y1.7e308",
      line: 2,
      reason: "Derived preview bounds must remain finite",
    },
    {
      name: "program without supported motion",
      source: "G90 G21\nM03 S12000",
      line: 1,
      reason: "No supported XY motion",
    },
    {
      name: "formatted output arc radius mismatch",
      source: "G90 G20 G17\nG00 X0 Y0\nG02 X2.000184 Y0 I1 J0",
      angle: "24.57",
      line: 3,
      reason: "radii differ",
      previewStatus: "Preview ready.",
    },
    {
      name: "formatted output arc topology change",
      source: "G90 G21 G17\nG00 X1 Y0\nG03 X1 Y0.00001 I-1 J0",
      line: 3,
      reason: "arc topology",
      previewStatus: "Preview ready.",
    },
  ];

  for (const diagnosticCase of cases) {
    await test.step(diagnosticCase.name, async () => {
      await gcodeSourceInput(page).fill(diagnosticCase.source);
      await gcodeAngleInput(page).fill(diagnosticCase.angle ?? "0");
      await gcodeGenerateButton(page).click();
      await expect(gcodeDiagnostics(page)).toContainText(
        `Line ${diagnosticCase.line}:`,
      );
      await expect(gcodeDiagnostics(page)).toContainText(diagnosticCase.reason);
      await expect(gcodePreviewStatus(page)).toHaveText(
        diagnosticCase.previewStatus ??
          "Preview unavailable — fix G-code errors.",
      );
      await expect(gcodeOutput(page)).toHaveValue("");
      await expect(gcodeCopyButton(page)).toBeDisabled();
      await expect(gcodeDownloadButton(page)).toBeDisabled();
    });
  }

  await test.step("non-finite rotation angle", async () => {
    await gcodeSourceInput(page).fill("G90 G21\nG00 X1 Y1");
    await gcodeAngleInput(page).fill("");
    await gcodeGenerateButton(page).click();
    await expect(page.locator("#gcode-angle-error")).toHaveText(
      "Enter a finite rotation angle.",
    );
    await expect(gcodePreviewStatus(page)).toHaveText(
      "Preview unavailable — enter a finite angle.",
    );
    await expect(gcodeOutput(page)).toHaveValue("");
    await expect(gcodeCopyButton(page)).toBeDisabled();
    await expect(gcodeDownloadButton(page)).toBeDisabled();
  });
});

test("a 300-line supported program stays responsive without an observed long task", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openCleanAuthenticatedApp(page, { path: "/#g-code" });
  const supportsLongTasks = await page.evaluate(() =>
    PerformanceObserver.supportedEntryTypes.includes("longtask"),
  );
  expect(
    supportsLongTasks,
    "The proof browser must expose PerformanceObserver long-task entries.",
  ).toBe(true);

  await page.evaluate(() => {
    type LongTaskProbe = {
      durations: number[];
      inputEvents: number;
      inputTypes: string[];
      observer: PerformanceObserver;
    };
    const probeWindow = window as Window & {
      __nestcalcLongTaskProbe?: LongTaskProbe;
    };
    const durations: number[] = [];
    const observer = new PerformanceObserver((list) => {
      durations.push(...list.getEntries().map((entry) => entry.duration));
    });
    observer.observe({ type: "longtask", buffered: false });
    const source = document.querySelector("#gcode-source");
    if (!(source instanceof HTMLTextAreaElement)) {
      throw new Error("G-code source editor unavailable");
    }
    const probe: LongTaskProbe = {
      durations,
      inputEvents: 0,
      inputTypes: [],
      observer,
    };
    source.addEventListener("input", (event) => {
      probe.inputEvents += 1;
      probe.inputTypes.push(
        event instanceof InputEvent ? event.inputType : "non-InputEvent",
      );
    });
    probeWindow.__nestcalcLongTaskProbe = probe;
  });

  const fixtureLines = ["G90 G21 G17"];
  for (let index = 0; index < 299; index += 1) {
    const motion = index === 0 ? "G00" : "G01";
    fixtureLines.push(`${motion} X${index + 1} Y${(index % 17) + 1}`);
  }
  expect(fixtureLines).toHaveLength(300);

  const fixtureSource = fixtureLines.join("\n");
  await gcodeSourceInput(page).evaluate((element, source) => {
    const textarea = element as HTMLTextAreaElement;
    const valueSetter = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      "value",
    )?.set;
    if (!valueSetter) throw new Error("Native textarea value setter unavailable");
    valueSetter.call(textarea, source);
    textarea.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        data: source,
        inputType: "insertFromPaste",
      }),
    );
  }, fixtureSource);
  await expect(gcodePreviewStatus(page)).toHaveText("Preview ready.", {
    timeout: 2_000,
  });
  await gcodeAngleInput(page).fill("15");
  await gcodeAngleInput(page).fill("90");
  await expect(gcodeAngleInput(page)).toHaveValue("90");
  await expect(gcodePreviewStatus(page)).toHaveText("Preview ready.", {
    timeout: 1_000,
  });
  await expect(gcodePreview(page)).toBeVisible();
  await assertNoHorizontalOverflow(page);

  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );
  const performanceProof = await page.evaluate(() => {
    type LongTaskProbe = {
      durations: number[];
      inputEvents: number;
      inputTypes: string[];
      observer: PerformanceObserver;
    };
    const probeWindow = window as Window & {
      __nestcalcLongTaskProbe?: LongTaskProbe;
    };
    const probe = probeWindow.__nestcalcLongTaskProbe;
    if (!probe) throw new Error("Long-task observer was not installed");
    probe.durations.push(
      ...probe.observer.takeRecords().map((entry) => entry.duration),
    );
    probe.observer.disconnect();
    return {
      durations: probe.durations,
      inputEvents: probe.inputEvents,
      inputTypes: probe.inputTypes,
    };
  });
  expect(performanceProof.inputEvents).toBe(1);
  expect(performanceProof.inputTypes).toEqual(["insertFromPaste"]);
  expect(
    performanceProof.durations,
    "A long task was observed while editing/parsing the 300-line fixture.",
  ).toEqual([]);
});
