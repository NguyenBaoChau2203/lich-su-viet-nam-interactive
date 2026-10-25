import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { test as base } from "@playwright/test";
export { expect, type Page } from "@playwright/test";

/** Optional per-case diagnostics, including deliberate asset failures. Never records response bodies. */
export const test = base.extend<{ refinementDiagnostics: void }>({
  refinementDiagnostics: [async ({ page }, use, info) => {
    const directory = process.env.REFINEMENT_DIAGNOSTICS_DIR;
    if (!directory) { await use(); return; }
    const events: { kind: string; path?: string; status?: number; message?: string }[] = [];
    const location = (href: string) => {
      try { const u = new URL(href); return `${u.origin}${u.pathname}`; } catch { return "unparseable"; }
    };
    const safeMessage = (message: string) => message.replace(/https?:\/\/[^\s"'<>]+/g, location)
      .replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, "[redacted JWT]").slice(0, 700);
    page.on("pageerror", error => events.push({ kind: "pageerror", message: safeMessage(error.message) }));
    page.on("console", message => {
      if (["error", "warning"].includes(message.type())) events.push({ kind: `console-${message.type()}`, message: safeMessage(message.text()) });
    });
    page.on("response", response => {
      if (response.status() >= 400) events.push({ kind: "http", path: location(response.url()), status: response.status() });
    });
    page.on("requestfailed", request => events.push({ kind: "requestfailed", path: location(request.url()), message: request.failure()?.errorText }));
    await use();
    mkdirSync(directory, { recursive: true });
    // Parameterized cases share a source line, so include their title in the key.
    const title = info.title.replace(/[^a-zA-Z0-9-]+/g, "-").slice(-100);
    const filename = `${path.basename(info.file, ".spec.ts")}-${info.line}-${title}-${info.retry}.json`;
    writeFileSync(path.join(directory, filename), JSON.stringify({ title: info.title, status: info.status, expectedStatus: info.expectedStatus, events }, null, 2));
  }, { auto: true }],
});
