import { expect, test } from "@playwright/test";

test("shows the project starting point", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /khám phá lịch sử việt nam/i }),
  ).toBeVisible();
  const favicon = await page.request.get("/favicon.ico");
  expect(favicon.ok()).toBe(true);
  expect(consoleErrors).toEqual([]);
});
