import { expect, test } from "@playwright/test";

test("public offline shell renders", async ({ page }) => {
  await page.goto("/~offline");

  await expect(page.getByRole("heading", { name: "NestCalc" })).toBeVisible();
  await expect(page.getByText("You are offline")).toBeVisible();
});

test("web app manifest keeps NestCalc install metadata", async ({ request }) => {
  const response = await request.get("/manifest.webmanifest");

  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("application/manifest");

  const manifest = await response.json();
  expect(manifest).toMatchObject({
    name: "NestCalc",
    short_name: "NestCalc",
    start_url: "/",
    display: "standalone",
  });
});
