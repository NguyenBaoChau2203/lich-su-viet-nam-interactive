import sharp from "sharp";
import { expect, test } from "./refinement-test";

// Public, read-only P6 regressions. Screenshot pixels include the actual WebGL terrain.
test.use({ reducedMotion: "reduce", deviceScaleFactor: 1 });

const luminance = (rgb: readonly number[]) => rgb.map((value) => {
  const channel = value / 255;
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);

for (const size of [{ width: 1280, height: 720 }, { width: 1366, height: 768 }, { width: 1440, height: 900 }, { width: 1920, height: 1080 }]) {
  test(`projected text has readable composited contrast and named controls at ${size.width}x${size.height}`, async ({ page }) => {
    await page.setViewportSize(size);
    await page.goto("/");
    await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".globe-overlay-text:not(.globe-label-measure)").first()).toBeVisible();
    await expect.soft(page.getByRole("group", { name: "Điều khiển địa cầu", exact: true })).toBeVisible({ timeout: 1000 });
    await expect.soft(page.getByRole("group", { name: "Chọn một năm có sự kiện", exact: true })).toBeVisible({ timeout: 1000 });

    const labels = await page.locator(".globe-overlay-text:not(.globe-label-measure)").evaluateAll((elements) => elements.map((element) => {
      const range = document.createRange(); range.selectNodeContents(element);
      const rect = range.getBoundingClientRect();
      const color = getComputedStyle(element).color.match(/[\d.]+/g)!.slice(0, 3).map(Number);
      return { text: element.textContent, color, left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
    }));
    const dots = await page.locator(".home-event-marker:not(.is-cluster) > span").evaluateAll((elements) => elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { x: Math.floor(rect.left + rect.width / 2), y: Math.floor(rect.top + rect.height / 2) };
    }));
    const original = await page.screenshot({ scale: "css" });
    // Preserve layout, terrain and text shadow; remove only glyph fill to expose its real background.
    const style = await page.addStyleTag({ content: ".globe-overlay-text {-webkit-text-fill-color:transparent!important}" });
    let background: Buffer;
    try { background = await page.screenshot({ scale: "css" }); }
    finally { await style.evaluate((element) => element.parentNode?.removeChild(element)); }
    const ink = await sharp(original).removeAlpha().raw().toBuffer();
    const under = await sharp(background).removeAlpha().raw().toBuffer();
    const pixel = (x: number, y: number) => {
      const offset = (y * size.width + x) * 3;
      return [ink[offset], ink[offset + 1], ink[offset + 2]];
    };
    expect(dots.length).toBeGreaterThan(0);
    for (const dot of dots) {
      const a = luminance(pixel(dot.x, dot.y));
      for (const [dx, dy] of [[-5, 0], [5, 0], [0, -5], [0, 5]]) {
        const b = luminance(pixel(dot.x + dx, dot.y + dy));
        expect.soft((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05), "Event dot against its immediate edge").toBeGreaterThanOrEqual(3);
      }
    }
    for (const label of labels) {
      let minimum = Infinity;
      let sampled = 0;
      for (let y = Math.max(0, Math.floor(label.top)); y < Math.min(size.height, Math.ceil(label.bottom)); y++) {
        for (let x = Math.max(0, Math.floor(label.left)); x < Math.min(size.width, Math.ceil(label.right)); x++) {
          const offset = (y * size.width + x) * 3;
          const foreground = [ink[offset], ink[offset + 1], ink[offset + 2]];
          const behind = [under[offset], under[offset + 1], under[offset + 2]];
          if (foreground.reduce((sum, value, index) => sum + Math.abs(value - behind[index]), 0) < 30
            || foreground.reduce((sum, value, index) => sum + Math.abs(value - label.color[index]), 0) > 100) continue;
          sampled++;
          const a = luminance(label.color), b = luminance(behind);
          minimum = Math.min(minimum, (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05));
        }
      }
      expect(sampled, `${label.text}: real interior glyph pixels`).toBeGreaterThan(0);
      expect.soft(minimum, `${label.text}: contrast over rendered terrain`).toBeGreaterThanOrEqual(4.5);
    }
  });
}
