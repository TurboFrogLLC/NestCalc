import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import {
  autoNestMarginOverrideInput,
  autoNestPreview,
  autoNestPreviewGroup,
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
  await expect(autoNestTrimLine(page)).toBeVisible();
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
