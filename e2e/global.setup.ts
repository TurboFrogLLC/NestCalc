import { createClerkClient } from "@clerk/backend";
import { clerk, clerkSetup } from "@clerk/testing/playwright";
import { expect, test as setup } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const authFile = path.join(__dirname, "../playwright/.clerk/user.json");

function hasClerkE2EEnv() {
  return Boolean(
    process.env.CLERK_SECRET_KEY &&
      process.env.CLERK_PUBLISHABLE_KEY &&
      process.env.E2E_CLERK_USER_EMAIL &&
      process.env.E2E_CLERK_USER_PASSWORD,
  );
}

setup.describe.configure({ mode: "serial" });

setup("create Clerk test user and save auth state", async ({ page }) => {
  setup.skip(
    !hasClerkE2EEnv(),
    "Missing Clerk E2E env: CLERK_SECRET_KEY, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY or CLERK_PUBLISHABLE_KEY, E2E_CLERK_USER_EMAIL, and E2E_CLERK_USER_PASSWORD.",
  );

  await clerkSetup({ dotenv: false });

  const secretKey = process.env.CLERK_SECRET_KEY;
  const emailAddress = process.env.E2E_CLERK_USER_EMAIL;
  const password = process.env.E2E_CLERK_USER_PASSWORD;

  if (!secretKey || !emailAddress || !password) {
    throw new Error("Missing Clerk E2E environment after setup skip check.");
  }
  if (!emailAddress.includes("+clerk_test")) {
    throw new Error("E2E_CLERK_USER_EMAIL must be a Clerk test email.");
  }

  const client = createClerkClient({ secretKey });
  const { data: users } = await client.users.getUserList({
    emailAddress: [emailAddress],
  });

  if (users.length === 0) {
    await client.users.createUser({
      emailAddress: [emailAddress],
      password,
      firstName: "NestCalc",
      lastName: "Test",
    });
  } else {
    await client.users.updateUser(users[0].id, { password });
  }

  await page.goto("/sign-in");
  await clerk.loaded({ page });
  await clerk.signIn({ page, emailAddress });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "NestCalc" })).toBeVisible();
  await expect(page.getByText("Parts =")).toBeVisible();

  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
});
