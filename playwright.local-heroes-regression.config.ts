import { defineConfig } from "@playwright/test";
import feature from "./playwright.local-heroes.config";
const server = feature.webServer;
if (!server || Array.isArray(server)) throw new Error("Expected one isolated fixture server.");
// Only source-inspected public desktop cases; never collect legacy DB mutation suites.
export default defineConfig({
  ...feature, testMatch: ["home-globe.spec.ts", "home-journey-path.spec.ts", "home-timeline-coverage.spec.ts"],
  grep: /fresh entry can skip|a published event detail returns|a shared journey opens paused|unsupported WebGL keeps|authored journey supports|switch, clear, hidden and disposal|every year, overlap/,
  projects: [{ name: "legacy-desktop", use: { viewport: { width: 1280, height: 720 } } }],
  use: { ...feature.use, storageState: { cookies: [], origins: [{ origin: "http://127.0.0.1:3114", localStorage: [{ name: "ls12:da-xem-huong-dan", value: "1" }] }] } },
  webServer: { ...server, env: { ...server.env, LOCAL_HEROES_LEGACY_FIXTURE: "1" } },
  outputDir: "output/playwright/local-heroes/regressions", reporter: [["list"], ["json", { outputFile: "output/playwright/local-heroes/regressions.json" }]],
});
