import path from "node:path";
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: __dirname,
  testMatch: "COMPOSITION-FLIPIT-radar.spec.ts",
  fullyParallel: false,
  reporter: [["list"]],
  use: {
    viewport: { width: 1440, height: 900 },
    screenshot: "only-on-failure",
  },
  outputDir: path.join(__dirname, "../../test-results/radar-host"),
});
