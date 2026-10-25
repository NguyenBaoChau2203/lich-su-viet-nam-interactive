import { defineConfig } from "@playwright/test";
import base from "./playwright.config";
import publicSmokeEnvironment from "./scripts/agent/smoke-env.json";

// Collect only public, credential-free cases. Legacy specs may import live-DB helpers.
export default defineConfig({
  ...base,
  testMatch: "agent-smoke.spec.ts",
  use: { ...base.use, channel: process.env.E2E_CHANNEL },
  webServer: process.env.E2E_BASE_URL ? undefined : {
    command: "pnpm exec next start -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: false,
    env: publicSmokeEnvironment,
    timeout: 120_000,
  },
});
