import { expect, test } from "@playwright/test";

// No support.ts import, account creation, database writes, credentials or external test services.
for (const viewport of [
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
]) {
  test(`public guide and skip link at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const response = await page.goto("/huong-dan");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: "Hướng dẫn sử dụng", exact: true })).toBeVisible();
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Bỏ qua menu, tới nội dung chính" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#noi-dung-chinh")).toBeFocused();
  });

  test(`homepage retains a geographic fallback without event data at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    // Existing explicit error path avoids requesting live event data in a fresh clone.
    await page.goto("/?__test_db_error=1");
    await expect(page.getByText("Chưa tải được dữ liệu sự kiện.", { exact: false })).toBeVisible();
    await expect(page.getByRole("button", { name: "Toàn cầu", exact: true })).toBeEnabled();
    await expect(page.getByTestId("cinematic-globe")).toHaveAttribute("data-state", "ready", { timeout: 30_000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    expect(errors).toEqual([]);
  });
}
