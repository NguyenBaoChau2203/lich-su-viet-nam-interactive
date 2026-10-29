import { defineConfig } from "@playwright/test";
import smoke from "./scripts/agent/smoke-env.json";

const port = 3116;
const fixturePort = 54331;
const baseURL = `http://127.0.0.1:${port}`;

/** Isolated read-only catalog. Does not reuse the owner's dev server or a live database. */
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: ["home-explorer-map-availability.spec.ts", "home-total-journey.spec.ts"],
  timeout: 120_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  outputDir: "output/playwright/explorer-map-total-journey/artifacts",
  reporter: [["list"], ["json", { outputFile: "output/playwright/explorer-map-total-journey/results.json" }]],
  use: {
    baseURL,
    channel: process.env.E2E_CHANNEL ?? "msedge",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    storageState: {
      cookies: [],
      origins: [{ origin: baseURL, localStorage: [
        { name: "ls12:da-xem-huong-dan", value: "1" },
        { name: "ls12:globe-intro-seen", value: "1" },
      ] }],
    },
  },
  projects: [
    { name: "1280x720", use: { viewport: { width: 1280, height: 720 } } },
    { name: "1366x768", use: { viewport: { width: 1366, height: 768 } } },
    { name: "1440x900", use: { viewport: { width: 1440, height: 900 } } },
    { name: "1920x1080", use: { viewport: { width: 1920, height: 1080 } } },
    {
      name: "legacy-chooser",
      testMatch: "home-journey-choices.spec.ts",
      grep: /users can select each registered journey from the compact chooser/,
      use: { viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    command: "node tests/e2e/journey-catalog-server.mjs",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 240_000,
    env: {
      ...smoke,
      JOURNEY_UI_DEV: "1",
      MAP_AVAILABILITY_FIXTURE: "1",
      EXPLORER_MAP_E2E: "1",
      JOURNEY_FIXTURE_PORT: String(fixturePort),
      JOURNEY_APP_PORT: String(port),
      JOURNEY_APP_ORIGIN: baseURL,
      NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${fixturePort}`,
      NEXT_PUBLIC_SITE_URL: baseURL,
      NoDefaultCurrentDirectoryInExePath: "1",
    },
  },
});
