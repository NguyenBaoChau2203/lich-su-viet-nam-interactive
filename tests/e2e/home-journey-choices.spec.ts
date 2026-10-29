import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "./refinement-test";
import AxeBuilder from "@axe-core/playwright";
import { JOURNEY_REGISTRY } from "@/lib/explorer/journeys/registry";
import { inspectScene, pixelDifference } from "./refinement-evidence";

// Task 03 foundation & Task 08 chooser/reader integration.
test.use({ reducedMotion: "no-preference", viewport: { width: 1440, height: 900 } });
const output = path.resolve("output/playwright/explorer-refinement/task-03");
const task08Output = path.resolve("output/playwright/explorer-refinement/task-08");
const journey = "ho-chi-minh-1911-1941";
const task09Output = path.resolve("output/playwright/explorer-refinement/task-09");
test.beforeAll(() => mkdirSync(task09Output, { recursive: true }));
const href = (stop: string) => `/?tu=1954&den=1954&hanh-trinh=${journey}&moc=${stop}`;
const current = (page: Page) => new URL(page.url()).searchParams.get("moc");
const panel = (page: Page) => page.getByTestId("journey-panel");
const play = (page: Page) => page.getByRole("button", { name: "Phát hành trình", exact: true });
async function ready(page: Page, stop = "paris-1919") {
  await page.goto(href(stop));
  await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
  await expect(panel(page)).toContainText("Đang tạm dừng");
}

test("actual intercontinental arrival precedes the full two-second dwell", async ({ page }) => {
  await ready(page, "sai-gon-1911");
  await page.evaluate(() => {
    const observer = new MutationObserver(() => {
      const selected = document.querySelector('.journey-timeline [aria-current="step"]')?.textContent ?? "";
      const status = document.querySelector('.journey-playback [role="status"]')?.textContent ?? "";
      if (selected.includes("Marseille") && status.includes("Tự chuyển sau ít nhất 2 giây") && !performance.getEntriesByName("task03-arrival").length)
        performance.mark("task03-arrival");
      if (selected.includes("London") && performance.getEntriesByName("task03-arrival").length) {
        performance.mark("task03-advance"); observer.disconnect();
      }
    });
    observer.observe(document.querySelector('[data-testid="history-explorer"]')!, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-current"] });
    document.addEventListener("click", (event) => {
      if ((event.target as Element)?.closest('[aria-label="Phát hành trình"]')) performance.mark("task03-start");
    }, { capture: true, once: false });
  });
  await page.getByTestId("journey-timeline").getByRole("link", { name: /Marseille/ }).click();
  await play(page).click();
  await expect(panel(page)).toContainText("Đang chuyển tới địa điểm");
  await expect(panel(page)).toContainText("Tự chuyển sau ít nhất 2 giây đọc");
  await page.waitForTimeout(1500);
  expect(current(page)).toBe("marseille-1911");
  await expect.poll(() => current(page)).toBe("london-1913");
  await page.getByRole("button", { name: "Tạm dừng hành trình", exact: true }).click();
  const timing = await page.evaluate(() => {
    const mark = (name: string) => performance.getEntriesByName(name)[0].startTime;
    return { flightMs: mark("task03-arrival") - mark("task03-start"), dwellMs: mark("task03-advance") - mark("task03-arrival") };
  });
  expect(timing.flightMs).toBeGreaterThan(2500);
  expect(timing.dwellMs).toBeGreaterThanOrEqual(1990); // DOM observation can lag the callback by one task.
  expect(timing.dwellMs).toBeLessThan(3000);
  await page.waitForTimeout(2400);
  expect(current(page)).toBe("london-1913");
  mkdirSync(output, { recursive: true });
  writeFileSync(path.join(output, "arrival-dwell-timing.json"), JSON.stringify({ ...timing, method: "real Three flight, DOM arrival/selected-step performance marks; exact 1999/2000 boundary separately unit-clock tested" }, null, 2));
});

test("reader keyboard focus and expanded sources pause playback until an explicit restart", async ({ page }) => {
  await ready(page);
  await play(page).click();
  await expect(panel(page)).toContainText("Tự chuyển sau ít nhất 2 giây đọc");
  await page.getByRole("region", { name: "Nội dung mốc hành trình" }).focus();
  await expect(play(page)).toBeVisible();
  await expect(panel(page)).toContainText("Đang tạm dừng để đọc");
  await page.waitForTimeout(2400);
  expect(current(page)).toBe("paris-1919");
  const summary = panel(page).locator(".journey-sources summary");
  await summary.focus(); await page.keyboard.press("Enter");
  await expect(panel(page).locator(".journey-sources")).toHaveAttribute("open", "");
  await play(page).click();
  await expect(play(page)).toBeVisible();
  await page.waitForTimeout(2400);
  expect(current(page)).toBe("paris-1919");
  await summary.click();
  await play(page).click();
  await expect(panel(page)).toContainText("Tự chuyển sau ít nhất 2 giây đọc");
  await expect.poll(() => current(page)).toBe("tours-1920");
});

test("the final milestone ends playback without a loop", async ({ page }) => {
  await ready(page, "moscow-1923");
  await play(page).click();
  await expect.poll(() => current(page), { timeout: 10_000 }).toBe("pac-bo-1941");
  await expect(page.getByRole("button", { name: "Tạm dừng hành trình", exact: true })).toBeEnabled();
  await expect(play(page)).toBeDisabled();
  await expect(page.getByRole("button", { name: "Mốc tiếp", exact: true })).toBeDisabled();
  await expect(panel(page)).toContainText("Đang tạm dừng");
  await page.waitForTimeout(2400);
  expect(current(page)).toBe("pac-bo-1941");
});

test("manual camera controls during journey travel retain the newest camera intent", async ({ page }) => {
  await ready(page, "sai-gon-1911");
  await page.getByTestId("journey-timeline").getByRole("link", { name: /Marseille/ }).click();
  await expect(panel(page)).toContainText("Đang chuyển tới địa điểm");
  await page.getByRole("button", { name: "Toàn cầu", exact: true }).click();
  await expect.poll(() => Number(new URL(page.url()).searchParams.get("ban-do")?.split(",")[2]), { timeout: 6000 }).toBeLessThan(3);
  const manual = new URL(page.url()).searchParams.get("ban-do");
  await page.waitForTimeout(4200);
  expect(new URL(page.url()).searchParams.get("ban-do")).toBe(manual);
  expect(current(page)).toBe("marseille-1911");
  await expect(play(page)).toBeVisible();
});

test("malformed shared pairs recover with a notice and remain paused after reload", async ({ page }) => {
  await page.goto(href("unknown-stop"));
  await expect(panel(page)).toContainText("Rời Tổ quốc");
  await expect(page.getByTestId("journey-notice")).toContainText("Đã mở mốc đầu tiên");
  await expect.poll(() => current(page)).toBe("sai-gon-1911");
  await page.reload();
  await expect(panel(page)).toContainText("Đang tạm dừng");
  await page.waitForTimeout(2400);
  expect(current(page)).toBe("sai-gon-1911");
  await page.goto("/?hanh-trinh=unknown&moc=paris-1919");
  await expect(panel(page)).toHaveCount(0);
  await expect(page.getByTestId("journey-notice")).toContainText("Hành trình không khả dụng");
});

test("a queued dwell cannot navigate while an outgoing detail response is held", async ({ page }) => {
  let release = () => {};
  const held = new Promise<void>((resolve) => { release = resolve; });
  let requested = false;
  await page.route("**/su-kien/**", async route => { requested = true; await held; await route.continue(); });
  await ready(page, "sai-gon-1911");
  await play(page).click();
  await expect(panel(page)).toContainText("Tự chuyển sau ít nhất 2 giây đọc");
  const detail = panel(page).getByRole("link", { name: /Xem chi tiết sự kiện/ });
  await detail.click();
  try {
    await expect.poll(() => requested).toBe(true);
    const url = page.url();
    const canvas = page.getByTestId("globe-map").locator("canvas");
    const image = await canvas.screenshot();
    await page.waitForTimeout(2600);
    expect(page.url()).toBe(url);
    expect((await canvas.screenshot()).equals(image)).toBe(true);
    await expect(panel(page)).toContainText("Rời Tổ quốc");
  } finally { release(); }
  await expect(page).toHaveURL(/\/su-kien\/nguyen-tat-thanh-ra-di-tim-duong-cuu-nuoc/);
});

test("users can select each registered journey from the compact chooser and see updated titles, counts, and stops", async ({ page }) => {
  await ready(page, "sai-gon-1911");
  const chooser = page.getByTestId("journey-chooser");
  await expect(chooser).toBeVisible();

  const select = page.getByTestId("journey-select");
  await expect(select).toBeVisible();
  const options = select.locator("option");
  await expect(options).toHaveCount(5);

  // Switch to Mùa thu độc lập 1945
  await select.selectOption("mua-thu-doc-lap-1945");
  await expect(page.locator(".globe-description")).toContainText("Mùa thu độc lập 1945");
  await expect(page.getByTestId("journey-timeline")).toContainText("19/08 — 02/09/1945");
  await expect(page.getByTestId("journey-timeline").getByRole("link")).toHaveCount(4);
  await expect(page.getByTestId("journey-stop-count")).toContainText("4 mốc");
  await expect(panel(page)).toContainText("Đang tạm dừng");
  expect(new URL(page.url()).searchParams.get("hanh-trinh")).toBe("mua-thu-doc-lap-1945");
  expect(new URL(page.url()).searchParams.get("moc")).toBe("ha-noi-1945");

  // Switch to Kháng chiến chống Pháp via quick-choice links
  const navLink = page.getByTestId("journey-choices-nav").locator('[data-journey-id="khang-chien-chong-phap-1946-1954"]');
  await navLink.click();
  await expect(page.locator(".globe-description")).toContainText("Những mốc kháng chiến chống Pháp");
  await expect(page.getByTestId("journey-timeline")).toContainText("1946 — 1954");
  await expect(page.getByTestId("journey-timeline").getByRole("link")).toHaveCount(5);
  await expect(page.getByTestId("journey-stop-count")).toContainText("5 mốc");
  await expect(navLink).toHaveAttribute("aria-current", "true");
  await expect(panel(page)).toContainText("Đang tạm dừng");
  expect(new URL(page.url()).searchParams.get("hanh-trinh")).toBe("khang-chien-chong-phap-1946-1954");
  expect(new URL(page.url()).searchParams.get("moc")).toBe("ha-noi-1946");

  // Switch to Mùa Xuân 1975
  await select.selectOption("mua-xuan-1975");
  await expect(page.locator(".globe-description")).toContainText("Mùa Xuân 1975");
  await expect(page.getByTestId("journey-timeline")).toContainText("10/03 — 30/04/1975");
  await expect(page.getByTestId("journey-timeline").getByRole("link")).toHaveCount(4);
  await expect(panel(page).getByRole("heading", { name: "Tiến công Buôn Ma Thuột" })).toBeVisible();
  await expect(panel(page)).toContainText("Đang tạm dừng");
  expect(new URL(page.url()).searchParams.get("hanh-trinh")).toBe("mua-xuan-1975");
  expect(new URL(page.url()).searchParams.get("moc")).toBe("buon-ma-thuot-1975");

  // The derived total is a fifth choice; the four authored sequences stay intact.
  await select.selectOption("hanh-trinh-tong-hop");
  await expect(page.locator(".globe-description")).toContainText("Hành trình tổng hợp");
  await expect(page.getByTestId("journey-timeline").getByRole("link")).toHaveCount(20);
  await expect(page.getByTestId("journey-stop-count")).toContainText("20 mốc");
  await expect(panel(page).getByRole("heading", { name: "Rời Tổ quốc", exact: true })).toBeVisible();
  expect(new URL(page.url()).searchParams.get("hanh-trinh")).toBe("hanh-trinh-tong-hop");

  // Switch back to Hồ Chí Minh
  await select.selectOption("ho-chi-minh-1911-1941");
  await expect(page.locator(".globe-description")).toContainText("Hành trình của Chủ tịch Hồ Chí Minh");
  await expect(page.getByTestId("journey-timeline")).toContainText("1911 — 1941");
  await expect(page.getByTestId("journey-timeline").getByRole("link")).toHaveCount(7);
});

test("keyboard selection in the native chooser triggers the state owner and remains paused", async ({ page }) => {
  await ready(page, "sai-gon-1911");
  const select = page.getByTestId("journey-select");
  await select.focus();
  await page.keyboard.press("ArrowDown");
  await expect.poll(() => new URL(page.url()).searchParams.get("hanh-trinh")).toBe("mua-thu-doc-lap-1945");
  await expect(page.locator(".globe-description")).toContainText("Mùa thu độc lập 1945");
  await expect(panel(page)).toContainText("Đang tạm dừng");
});

test("exiting journey mode restores original exploration snapshot and returns focus", async ({ page }) => {
  await page.goto("/?tu=1920&den=1930");
  await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
  await page.getByRole("button", { name: "Hành trình", exact: true }).click();
  await expect(page.getByTestId("journey-chooser")).toBeVisible();
  await page.getByTestId("journey-select").selectOption("mua-xuan-1975");
  await expect(page.locator(".globe-description")).toContainText("Mùa Xuân 1975");

  // Exit back to exploration
  await page.getByRole("button", { name: "Thoát hành trình", exact: true }).click();
  await expect(page.getByTestId("journey-panel")).toHaveCount(0);
  await expect.poll(() => new URL(page.url()).searchParams.get("hanh-trinh")).toBeNull();
  expect(new URL(page.url()).searchParams.get("tu")).toBe("1920");
  expect(new URL(page.url()).searchParams.get("den")).toBe("1930");
  await expect(page.getByRole("button", { name: "Hành trình", exact: true })).toBeFocused();
});

test("browser history back and forward restores previously selected journey", async ({ page }) => {
  await ready(page, "sai-gon-1911");
  await expect(page.locator(".globe-description")).toContainText("Hành trình của Chủ tịch Hồ Chí Minh");

  // Push history entry for Autumn 1945 and dispatch popstate
  await page.evaluate(() => {
    history.pushState(null, "", "/?hanh-trinh=mua-thu-doc-lap-1945&moc=ha-noi-1945");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect(page.locator(".globe-description")).toContainText("Mùa thu độc lập 1945");
  await expect(panel(page)).toContainText("Đang tạm dừng");

  // Push history entry for Spring 1975
  await page.evaluate(() => {
    history.pushState(null, "", "/?hanh-trinh=mua-xuan-1975&moc=buon-ma-thuot-1975");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect(page.locator(".globe-description")).toContainText("Mùa Xuân 1975");

  // Go back to Autumn 1945
  await page.goBack();
  await expect(page.locator(".globe-description")).toContainText("Mùa thu độc lập 1945");
  await expect(panel(page)).toContainText("Đang tạm dừng");

  // Go back to HCM 1911
  await page.goBack();
  await expect(page.locator(".globe-description")).toContainText("Hành trình của Chủ tịch Hồ Chí Minh");
  await expect(panel(page)).toContainText("Đang tạm dừng");

  // Go forward to Autumn 1945
  await page.goForward();
  await expect(page.locator(".globe-description")).toContainText("Mùa thu độc lập 1945");
});

test("HTML fallback without JavaScript allows browsing all four journeys", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const noJsPage = await context.newPage();
  try {
    // 1. Visit autumn 1945
    await noJsPage.goto("/?hanh-trinh=mua-thu-doc-lap-1945&moc=ha-noi-1945");
    await expect(noJsPage.locator(".globe-description")).toContainText("Mùa thu độc lập 1945");
    await expect(noJsPage.locator(".journey-timeline-caption")).toContainText("19/08 — 02/09/1945");
    const timelineLinks = noJsPage.getByTestId("journey-timeline").getByRole("link");
    await expect(timelineLinks).toHaveCount(4);

    // Form has GET method and action
    const form = noJsPage.getByTestId("journey-chooser-form");
    await expect(form).toHaveAttribute("method", "get");
    await expect(form).toHaveAttribute("action", "/");

    // Published detail link is present for Hanoi
    const detailLink = noJsPage.getByTestId("journey-panel").getByRole("link", { name: /Xem chi tiết sự kiện/ });
    await expect(detailLink).toHaveCount(1);
    const detailHref = await detailLink.getAttribute("href");
    expect(detailHref).toContain("/su-kien/tong-khoi-nghia-gianh-chinh-quyen-o-ha-noi");

    // 2. Source-only stop (Hue) has no detail link
    await noJsPage.goto("/?hanh-trinh=mua-thu-doc-lap-1945&moc=hue-1945");
    await expect(noJsPage.getByTestId("journey-panel").getByRole("link", { name: /Xem chi tiết sự kiện/ })).toHaveCount(0);
    // Sources details summary exists
    await expect(noJsPage.getByTestId("journey-panel").locator(".journey-sources summary")).toBeVisible();
  } finally {
    await context.close();
  }
});

for (const size of [{ width: 1280, height: 720 }, { width: 1366, height: 768 }, { width: 1440, height: 900 }, { width: 1920, height: 1080 }]) {
  test(`selected journey period, reading controls and published-only links fit ${size.width}x${size.height}`, async ({ page }) => {
    await page.setViewportSize(size);
    await ready(page);
    await expect(page.locator(".globe-description")).toContainText("Hành trình của Chủ tịch Hồ Chí Minh");
    await expect(page.locator(".journey-timeline-caption")).toContainText("1911 — 1941");
    await expect(panel(page)).toContainText("Mốc 4 / 7");
    await expect(page.getByTestId("journey-timeline").getByRole("link")).toHaveCount(7);
    await expect(panel(page)).toBeVisible();
    await expect(page.getByTestId("journey-chooser")).toBeVisible();
    await expect(panel(page).getByRole("link", { name: /Xem chi tiết sự kiện/ })).toHaveCount(0); // This source-backed stop has no current published detail event.
    await panel(page).locator(".journey-sources summary").click();
    await expect(panel(page).getByRole("link", { name: "Cổng thông tin Hồ Chí Minh", exact: true })).toBeVisible();

    const reader = (await page.getByTestId("journey-popup").boundingBox())!, timeline = (await page.getByTestId("journey-timeline").boundingBox())!;
    expect(reader.y + reader.height).toBeLessThanOrEqual(timeline.y);

    const intro = (await page.locator(".home-map-intro").boundingBox())!;
    expect(intro.y + intro.height).toBeLessThanOrEqual(timeline.y);

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    mkdirSync(output, { recursive: true });
    await page.screenshot({ path: path.join(output, `reader-sources-${size.width}x${size.height}.png`), scale: "css" });

    mkdirSync(task08Output, { recursive: true });
    await page.screenshot({ path: path.join(task08Output, `journey-chooser-${size.width}x${size.height}.png`), scale: "css" });

    await page.getByTestId("journey-timeline").getByRole("link", { name: /Bến Nhà Rồng/ }).click();
    await expect(panel(page).getByRole("link", { name: /Xem chi tiết sự kiện/ })).toHaveCount(1); // Published inventory, outside the exploration's 1954 filter.
    await page.getByTestId("journey-timeline").getByRole("link", { name: /Tours/ }).click();
    await expect(panel(page).getByRole("link", { name: /Xem chi tiết sự kiện/ })).toHaveCount(0);
  });
}

for (const size of [{ width: 1280, height: 720 }, { width: 1366, height: 768 }, { width: 1440, height: 900 }, { width: 1920, height: 1080 }]) {
  test(`Task 09 all four journeys, manual stops, source reading and actual paths at ${size.width}x${size.height}`, async ({ page }) => {
    await page.setViewportSize(size);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(href("sai-gon-1911"));
    await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true");
    await expect(panel(page)).toContainText("Giảm chuyển động");
    const evidence = [];
    const authoredJourneys = JOURNEY_REGISTRY.journeys.filter((journey) => journey.id !== "hanh-trinh-tong-hop");
    for (const selected of authoredJourneys) {
      await page.getByTestId("journey-select").selectOption(selected.id);
      await expect(page.getByTestId("journey-select")).toHaveValue(selected.id);
      await expect(page.getByRole("button", { name: "Mốc trước", exact: true })).toBeDisabled();
      await expect(play(page)).toBeDisabled();
      for (const [index, stop] of selected.stops.entries()) {
        await expect(panel(page).getByRole("heading", { name: stop.title, exact: true })).toBeVisible();
        await expect(page.getByTestId("journey-timeline").locator('[aria-current="step"]')).toHaveAttribute("href", new RegExp(`moc=${stop.id}`));
        if (index < selected.stops.length - 1) await page.getByRole("button", { name: "Mốc tiếp", exact: true }).click();
      }
      await expect(page.getByRole("button", { name: "Mốc tiếp", exact: true })).toBeDisabled();
      const details = panel(page).locator(".journey-sources");
      await details.locator("summary").focus(); await page.keyboard.press("Enter");
      await expect(details).toHaveAttribute("open", "");
      await expect(details.getByRole("link").first()).toBeVisible();
      await details.getByRole("link").first().focus();
      expect(await details.getByRole("link").first().evaluate(element => element === document.activeElement)).toBe(true);
      const stops = page.getByTestId("journey-stops-list");
      await stops.locator("summary").focus(); await page.keyboard.press("Enter");
      await expect(stops).toHaveAttribute("open", "");
      await stops.locator("a").last().focus(); await page.keyboard.press("Escape");
      await expect(stops).not.toHaveAttribute("open", "");
      await expect(stops.locator("summary")).toBeFocused();
      for (const control of [page.getByTestId("journey-select"), page.getByRole("button", { name: "Thoát hành trình", exact: true }), page.getByRole("button", { name: "Mốc trước", exact: true })]) {
        await expect(control).toBeInViewport();
        expect(await control.evaluate(element => {
          const r = element.getBoundingClientRect();
          return document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)?.closest("button,select") === element;
        })).toBe(true);
      }
      const reader = (await page.getByTestId("journey-popup").boundingBox())!, timeline = (await page.getByTestId("journey-timeline").boundingBox())!;
      const chooser = (await page.locator(".home-map-intro").boundingBox())!;
      expect(reader.y + reader.height).toBeLessThanOrEqual(timeline.y);
      expect(chooser.y + chooser.height).toBeLessThanOrEqual(timeline.y);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const actual = await inspectScene(page);
      expect(actual.stats.journeyPath).toMatchObject({ request: { journeyId: selected.id, stopId: selected.stops.at(-1)!.id }, active: false, reveal: selected.stops.length - 1 });
      await page.screenshot({ path: path.join(task09Output, `${selected.id}-${size.width}x${size.height}.png`), scale: "css" });
      await inspectScene(page, { type: "view", view: { lat: 22, lng: 106, zoom: 3.8 } });
      const canvas = page.locator("canvas.cinematic-globe-canvas");
      const withPath = await canvas.screenshot({ path: path.join(task09Output, `${selected.id}-path-${size.width}x${size.height}.png`) });
      await inspectScene(page, { type: "clear-path" });
      const pixels = await pixelDifference(withPath, await canvas.screenshot(), 35);
      expect(pixels, `${selected.id} must draw its real authored path`).toBeGreaterThan(40);
      evidence.push({ journeyId: selected.id, stops: selected.stops.length, pixels, actual });
      if (size.width === 1280) {
        const a11y = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
        expect(a11y.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }))).toEqual([]);
      }
      // Camera inspection can put the point offstage and replace the popup with
      // a closed native reader. Reveal it before targeting its source summary;
      // focusing hidden content otherwise leaves Enter on the stop-list summary.
      const fallback = page.getByTestId("journey-reader-fallback");
      if (await fallback.count() && await fallback.getAttribute("open") === null) {
        await fallback.locator(":scope > summary").focus();
        await page.keyboard.press("Enter");
      }
      await expect(details.locator("summary")).toBeVisible();
      if (await details.getAttribute("open") !== null) {
        await details.locator("summary").focus();
        await expect(details.locator("summary")).toBeFocused();
        await page.keyboard.press("Enter");
      }
      await expect(stops).not.toHaveAttribute("open", "");
    }
    writeFileSync(path.join(task09Output, `four-journeys-${size.width}x${size.height}.json`), JSON.stringify(evidence, null, 2));
  });
}

test("Task 09 rapid journey switch, seek, hidden resume, popstate and exit retain the exploration snapshot", async ({ page }) => {
  const original = "/?tu=1945&den=1945&su-kien=tuyen-ngon-doc-lap&ban-do=21.03,105.84,10";
  await page.goto(original);
  await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true");
  await expect(page.getByTestId("map-event-card")).toBeVisible();
  const saved = new URL(page.url()).searchParams;
  await page.getByRole("button", { name: "Hành trình", exact: true }).click();
  await page.getByTestId("journey-timeline").getByRole("link", { name: /Marseille/ }).click();
  const old = (await inspectScene(page)).stats.journeyPath!.request!;
  await page.getByTestId("journey-select").selectOption("khang-chien-chong-phap-1946-1954");
  await page.getByRole("button", { name: "Mốc tiếp", exact: true }).click();
  await page.getByTestId("journey-select").selectOption("mua-thu-doc-lap-1945");
  await page.getByTestId("journey-timeline").getByRole("link", { name: /Ba Đình/ }).click();
  const chosen = (await inspectScene(page)).stats.journeyPath!.request!;
  expect(chosen.journeyId).toBe("mua-thu-doc-lap-1945");
  expect(chosen.nonce).toBeGreaterThan(old.nonce);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.getByTestId("journey-select").selectOption("mua-xuan-1975");
  await page.getByRole("button", { name: "Mốc tiếp", exact: true }).click();
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: false });
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(panel(page)).toContainText("Đang tạm dừng");
  await expect.poll(() => current(page)).toBe("hue-1975");
  await page.evaluate(() => {
    history.pushState(null, "", "/?tu=1945&den=1945&hanh-trinh=khang-chien-chong-phap-1946-1954&moc=geneve-1954");
    dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect.poll(() => current(page)).toBe("geneve-1954");
  await page.waitForTimeout(4500); // Outlast the cancelled intercontinental flight and a full dwell.
  const latest = await inspectScene(page);
  expect(latest.stats.journeyPath!.request).toMatchObject({ journeyId: "khang-chien-chong-phap-1946-1954", stopId: "geneve-1954" });
  expect(latest.view.lat).toBeCloseTo(46.2044, 4);
  expect(latest.view.lng).toBeCloseTo(6.1432, 4);
  await page.getByRole("button", { name: "Thoát hành trình", exact: true }).click();
  await expect(page.getByTestId("map-event-card")).toBeVisible();
  await expect(page.locator("#map-event-heading")).toBeFocused(); // Restoring the selected card announces its content.
  for (const key of ["tu", "den", "su-kien", "ban-do"]) await expect.poll(() => new URL(page.url()).searchParams.get(key)).toBe(saved.get(key));
  await page.waitForTimeout(2400);
  expect((await inspectScene(page)).stats.journeyPath!.request).toBeNull();
  expect(current(page)).toBeNull();
  writeFileSync(path.join(task09Output, "cross-journey-race.json"), JSON.stringify({ old, chosen, latest, restored: page.url(), visibility: "DOM visibilitychange boundary simulation" }, null, 2));
});

test("Task 09 no-JS native GET chooser really submits and source-only reading remains navigable", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL, viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  try {
    await page.goto("/?hanh-trinh=mua-thu-doc-lap-1945&moc=hue-1945");
    for (const selected of JOURNEY_REGISTRY.journeys) {
      const form = page.getByTestId("journey-chooser-form");
      await form.locator("select").selectOption(selected.id);
      await form.getByRole("button", { name: "Xem hành trình", exact: true }).click();
      await expect(page.getByTestId("journey-title")).toHaveText(selected.title);
      await page.getByTestId("journey-timeline").getByRole("link").nth(1).click();
      await expect(panel(page).getByRole("heading")).toHaveText(selected.stops[1].title);
      await panel(page).locator(".journey-sources summary").focus(); await page.keyboard.press("Enter");
      await expect(panel(page).locator(".journey-sources")).toHaveAttribute("open", "");
      await expect(panel(page).locator(".journey-sources a").first()).toBeVisible();
    }
    await page.screenshot({ path: path.join(task09Output, "no-js-four-journey-reading.png"), scale: "css" });
  } finally { await context.close(); }
});
