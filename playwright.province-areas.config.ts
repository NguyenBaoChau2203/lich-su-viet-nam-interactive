import { defineConfig } from "@playwright/test";
import smoke from "./scripts/agent/smoke-env.json";

if (process.env.E2E_BASE_URL) throw new Error("Remote/existing-server overrides are forbidden.");

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: ["home-province-areas-national.spec.ts", "home-province-areas-lifecycle.spec.ts"],
  timeout: 900000,
  expect: { timeout: 20000 },
  workers: 1,
  outputDir: "output/playwright/province-areas/artifacts",
  reporter: [["list"], ["json", { outputFile: "output/playwright/province-areas/results.json" }]],
  use: {
    baseURL: "http://127.0.0.1:3114",
    channel: "msedge",
    screenshot: "on",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "1280x720", use: { viewport: { width: 1280, height: 720 } } },
    { name: "1366x768", use: { viewport: { width: 1366, height: 768 } } },
    { name: "1440x900", use: { viewport: { width: 1440, height: 900 } } },
    { name: "1920x1080", use: { viewport: { width: 1920, height: 1080 } } },
  ],
  webServer: {
    command: "node scripts/agent/local-heroes-e2e.mjs start",
    url: "http://127.0.0.1:3114",
    reuseExistingServer: false,
    timeout: 60000,
    env: {
      ...smoke,
      LOCAL_HEROES_E2E: "1",
      LOCAL_HEROES_ADMIN_E2E: "",
      SUPABASE_SERVICE_ROLE_KEY: "",
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54329",
      NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3114",
      NoDefaultCurrentDirectoryInExePath: "1",
    },
  },
});
