import path from "node:path";
import { pathToFileURL } from "node:url";
import { expect, test } from "@playwright/test";

declare global {
  interface Window {
    __calcIsFloating?: () => boolean;
    __bedGetZoom?: () => number;
  }
}

const host = pathToFileURL(
  path.join(__dirname, "COMPOSITION-FLIPIT-radar.html"),
).href;
const sampleNc = path.join(__dirname, "fixtures/radar-sample.nc");

test.describe("FlipIt radar composition host", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.removeItem("howmany.flipit.radar.presets");
      } catch {
        /* ignore */
      }
    });
    await page.goto(host);
  });

  test("boot: every card visible and FlipIt accepts typed NC", async ({
    page,
  }) => {
    for (const sel of [
      "#hud",
      "#backplot",
      "#card-status",
      "#card-settings",
      "#card-autosize",
      "#card-bed",
      "#card-flipit",
    ]) {
      await expect(page.locator(sel)).toBeVisible();
    }
    const source = page.locator("#source");
    await expect(source).toBeVisible();
    await source.fill("G0 X1.0000 Y2.0000");
    await expect(source).toHaveValue(/G0 X1/);
    await expect(page.locator("#stage-status")).toHaveText("READY");
    await expect(page.locator("#gcode")).toHaveClass(/is-open/);
    await expect(page.locator("#gcode")).toHaveClass(/is-expanded/);
  });

  test("focus 1-up and 2-up with Escape close", async ({ page }) => {
    await page.locator('#hud [data-focus="hud"]').click();
    await expect(page.locator("#focus-modal")).toBeVisible();
    await expect(page.locator("#focus-label")).toHaveText(/1-up/);
    await page.locator('[data-focus-add="toolpath"]').click();
    await expect(page.locator("#focus-label")).toHaveText(/2-up/);
    await expect(page.locator(".focus-stage")).toHaveClass(/is-two/);
    await page.keyboard.press("Escape");
    await expect(page.locator("#focus-modal")).toBeHidden();
  });

  test("drawer pushes grid and closes cleanly", async ({ page }) => {
    const app = page.locator("#app");
    await expect(app).not.toHaveClass(/drawer-open/);
    await page.locator('[data-ticker-btn="blank"]').click();
    await expect(app).toHaveClass(/drawer-open/);
    await expect(page.locator("#hud-drawer")).toHaveAttribute(
      "aria-hidden",
      "false",
    );
    await expect(page.locator("#drawer-title")).toHaveText("Blank");
    await page.locator("#drawer-close").click();
    await expect(app).not.toHaveClass(/drawer-open/);
  });

  test("calculator floats and returns home", async ({ page }) => {
    await page.locator("#bt-calc").click();
    await expect(page.locator("#calc-float")).toBeVisible();
    await expect
      .poll(async () => page.evaluate(() => window.__calcIsFloating()))
      .toBe(true);
    await page.locator("#calc-home").click();
    await expect(page.locator("#calc-float")).toBeHidden({ timeout: 2000 });
    await expect
      .poll(async () => page.evaluate(() => window.__calcIsFloating()))
      .toBe(false);
  });

  test("blank resize via outside arc uses restrained green glow", async ({
    page,
  }) => {
    const blank = page.locator("#lb-blank");
    const before = await blank.getAttribute("width");
    const arc = page.locator("#lb-hit-corner");
    const box = await arc.boundingBox();
    expect(box).toBeTruthy();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.mouse.down();
    await expect(page.locator("body")).toHaveClass(/lb-dragging-xy/);
    await page.mouse.move(box!.x + 80, box!.y - 40);
    await page.mouse.up();
    const after = await blank.getAttribute("width");
    expect(after).not.toEqual(before);
    await expect(page.locator("body")).not.toHaveClass(/lb-dragging-xy/);
    await expect(page.locator('[data-ticker="blank"]')).not.toHaveText(
      "12.000 × 8.000",
    );
  });

  test("real .nc load and unload via Clear and name X", async ({ page }) => {
    await page.locator("#flipit-file-input").setInputFiles(sampleNc);
    await expect(page.locator("#source")).toHaveValue(/G21/);
    await expect(page.locator("#prog-name")).toHaveValue("radar-sample");
    await expect(page.locator("#gcode-toast")).toContainText(/PROGRAM LOADED/i);
    await page.locator("#btn-clear").click();
    await expect(page.locator("#source")).toHaveValue("");
    await expect(page.locator("#prog-name")).toHaveValue("");
    await page.locator("#flipit-file-input").setInputFiles(sampleNc);
    await expect(page.locator("#prog-name")).toHaveValue("radar-sample");
    await page.locator("#prog-clear").click();
    await expect(page.locator("#source")).toHaveValue("");
    await expect(page.locator("#output")).toHaveValue("");
    await expect(page.locator("#prog-name")).toHaveValue("");
  });

  test("preset chip loads; Edit→Confirm writes; Main OK never writes", async ({
    page,
  }) => {
    await page.locator('[data-ticker-btn="blank"]').click();
    const x = page.locator('#drawer-fields [data-blank="x"]');
    const y = page.locator('#drawer-fields [data-blank="y"]');
    await x.fill("9");
    await y.fill("7");
    await page.locator("[data-pre-edit]").click();
    await page.locator('[data-pre="A"]').click();
    await page.locator("[data-pre-ok]").click();
    await expect(page.locator(".pop-toast")).toHaveClass(/is-on/);
    await page.locator("[data-pop-save]").click();
    await expect(page.locator("#app")).not.toHaveClass(/drawer-open/);
    await expect(page.locator('[data-ticker="blank"]')).toHaveText(
      "9.000 × 7.000",
    );

    await page.locator('[data-ticker-btn="blank"]').click();
    await x.fill("5");
    await y.fill("4");
    await page.locator("[data-pop-save]").click();
    await expect(page.locator('[data-ticker="blank"]')).toHaveText(
      "5.000 × 4.000",
    );

    await page.locator('[data-ticker-btn="blank"]').click();
    await page.locator('[data-pre="A"]').click();
    await expect(page.locator('#drawer-fields [data-blank="x"]')).toHaveValue(
      "9.000",
    );
    await expect(page.locator('#drawer-fields [data-blank="y"]')).toHaveValue(
      "7.000",
    );
  });

  test("AUTO-SIZE / FLiPIT cycles match V3 R2–R4", async ({ page }) => {
    const gcode = page.locator("#gcode");
    await expect(gcode).toHaveClass(/is-open/);
    await expect(gcode).toHaveClass(/is-expanded/);

    await page.locator("#btn-auto-size").click();
    await expect(gcode).toHaveClass(/is-open/);
    await expect(gcode).not.toHaveClass(/is-expanded/);
    await expect(page.locator("#gcode-toast")).toContainText(/LOAD A PROGRAM/i);

    await page.locator("#btn-auto-size").click();
    await expect(gcode).not.toHaveClass(/is-open/);

    await page.locator("#btn-gcode").click();
    await expect(gcode).toHaveClass(/is-open/);
    await expect(gcode).toHaveClass(/is-expanded/);

    await page.locator("#btn-gcode").click();
    await expect(gcode).not.toHaveClass(/is-open/);

    await page.locator("#btn-gcode").click();
    await expect(gcode).toHaveClass(/is-expanded/);
    await page.locator("#source").fill("G0 X1");
    await page.locator("#btn-auto-size").click();
    await expect(gcode).toHaveClass(/is-open/);
    await expect(gcode).not.toHaveClass(/is-expanded/);
    await page.locator("#btn-gcode").click();
    await expect(gcode).toHaveClass(/is-expanded/);
  });

  test("zoom in / out / fit live", async ({ page }) => {
    const z0 = await page.evaluate(() => window.__bedGetZoom());
    await page.locator("#lb-zoom-in").click();
    const z1 = await page.evaluate(() => window.__bedGetZoom());
    expect(z1).toBeGreaterThan(z0);
    await page.locator("#lb-zoom-out").click();
    const z2 = await page.evaluate(() => window.__bedGetZoom());
    expect(z2).toBeLessThan(z1);
    await page.locator("#lb-fit").click();
    const z3 = await page.evaluate(() => window.__bedGetZoom());
    expect(z3).toBe(1);
    await expect(page.locator("#lb-blank")).toHaveAttribute("width", "12");
  });

  test("prefers-reduced-motion yields instant transitions", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    const instant = await page.evaluate(() => {
      const style = getComputedStyle(document.getElementById("app")!);
      return parseFloat(style.transitionDuration) <= 0.01;
    });
    expect(instant).toBe(true);
    await page.locator('#hud [data-focus="hud"]').click();
    await expect(page.locator("#focus-modal")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#focus-modal")).toBeHidden();
  });

  test("output is never gated and Flip IT writes output", async ({ page }) => {
    await page.locator("#tab-output").click();
    await expect(page.locator('#output')).toBeVisible();
    await page.locator("#output").fill("; manual");
    await expect(page.locator("#output")).toHaveValue("; manual");
    await page.locator("#tab-source").click();
    await page.locator("#source").fill("G1 X2.0000 Y3.0000");
    await page.locator("#stage-action").click();
    await expect(page.locator("#output")).toHaveValue(/rotation 0/);
    await expect(page.locator("#stage-status")).toHaveText("DONE");
  });
});
