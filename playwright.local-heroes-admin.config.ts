import { defineConfig } from "@playwright/test";
import { localAdminEnvironment } from "./scripts/agent/local-heroes-admin-e2e.mjs";

/**
 * Disposable-local admin E2E configuration (owned by Phase 03).
 * Excluded from public fixture runs; requires disposable environment with test staff accounts.
 */
const env = localAdminEnvironment();
Object.assign(process.env, env);
export default defineConfig({
  testDir: "./tests/e2e", testMatch: "admin-local-heroes.spec.ts", globalSetup: "./tests/e2e/local-heroes-admin-setup.ts",
  timeout: 60000, expect: { timeout: 15000 }, workers: 1,
  reporter: [["list"], ["json", { outputFile: "output/playwright/local-heroes-admin/results.json" }]],
  outputDir: "output/playwright/local-heroes-admin/artifacts",
  use: { baseURL: "http://127.0.0.1:3115", channel: "msedge", viewport: { width: 1280, height: 720 }, reducedMotion: "reduce", trace: "off", screenshot: "only-on-failure" },
  webServer: { command: "node scripts/agent/local-heroes-admin-e2e.mjs start", url: "http://127.0.0.1:3115/quan-tri/dang-nhap", reuseExistingServer: false, timeout: 60000, env },
});
