import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

const authFile = path.join(__dirname, "../playwright/.clerk/user.json");
const hasRequiredEnv = Boolean(
  process.env.CLERK_SECRET_KEY &&
    process.env.CLERK_PUBLISHABLE_KEY &&
    process.env.E2E_CLERK_USER_EMAIL &&
    process.env.E2E_CLERK_USER_PASSWORD,
);

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
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "NestCalc" })).toBeVisible();
  await expect(page.getByLabel("X [PART]")).toBeVisible();
  await expect(page.getByLabel("Y [REM]")).toBeVisible();
  await expect(page.getByText("Parts =")).toBeVisible();
});
