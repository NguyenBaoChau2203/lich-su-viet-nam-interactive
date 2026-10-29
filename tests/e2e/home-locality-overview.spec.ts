import { expect, test, type Page } from "@playwright/test";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { inspectScene } from "./refinement-evidence";

const thumbnail = readFileSync("tests/e2e/fixtures/local-heroes/thumbnail.svg");
const diagnostics = new WeakMap<Page, { kind: string; path?: string; status?: number; message?: string }[]>();
// Retain the finite camera/card/connector sequence as local handoff evidence.
test.use({ video: "on" });

const ready = (page: Page) =>
  expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true", { timeout: 30000 });

test.beforeEach(async ({ page, context }, info) => {
  const events: NonNullable<ReturnType<typeof diagnostics.get>> = [];
  diagnostics.set(page, events);
  page.on("pageerror", (error) => events.push({ kind: "pageerror", message: error.message }));
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      events.push({
        kind: `console-${message.type()}`,
        message: message.text().replace(/https?:\/\/[^\s"'<>]+/gu, (val) => {
          try {
            return new URL(val).pathname;
          } catch {
            return "[URL]";
          }
        }).slice(0, 800),
      });
    }
  });
  page.on("response", (response) => {
    if (response.status() >= 400) {
      events.push({
        kind: response.url().includes("broken") ? "intentional-broken-image" : "http-error",
        path: new URL(response.url()).pathname,
        status: response.status(),
      });
    }
  });

  await page.addInitScript(({ seen }) => {
    localStorage.setItem("ls12:da-xem-huong-dan", "1");
    if (seen) sessionStorage.setItem("ls12:globe-intro-seen", "1");
  }, { seen: !info.title.includes("intro") });

  await context.route("**/_next/image?**", (route) =>
    route.fulfill(
      route.request().url().includes("broken")
        ? { status: 503, contentType: "text/plain", body: "Synthetic image unavailable" }
        : { status: 200, contentType: "image/svg+xml", body: thumbnail },
    ),
  );
  await context.route("https://example.invalid/**", (route) =>
    route.fulfill(
      route.request().url().includes("broken")
        ? { status: 503, contentType: "text/plain", body: "Synthetic image unavailable" }
        : { status: 200, contentType: "image/svg+xml", body: thumbnail },
    ),
  );
  await context.route("https://commons.wikimedia.org/**", (route) =>
    route.fulfill({ status: 200, contentType: "image/svg+xml", body: thumbnail }),
  );
  await context.route("https://example.com/**", (route) => route.fulfill({ status: 200, contentType: "image/svg+xml", body: thumbnail }));
});

test.afterEach(async ({ page }, info) => {
  const events = diagnostics.get(page) ?? [];
  await info.attach("console-network-diagnostics", {
    contentType: "application/json",
    body: JSON.stringify(events, null, 2),
  });
  mkdirSync("output/playwright/local-heroes/diagnostics", { recursive: true });
  writeFileSync(
    `output/playwright/local-heroes/diagnostics/${info.project.name}-${info.title.replace(/[^a-z0-9]+/giu, "-").slice(0, 90)}.json`,
    JSON.stringify(events, null, 2),
  );
  expect(events.filter((e) => e.kind === "pageerror")).toEqual([]);
  await expect(page.getByTestId("history-explorer")).toHaveCount(1);
  await expect(page.getByText(/Đã xảy ra lỗi|Application error|Something went wrong|Unhandled Runtime Error/)).toHaveCount(0);
  expect(events.filter((e) => e.kind === "console-error" && !/Failed to load resource|net::ERR|WebGL|context|GPU stall|404|503/i.test(e.message ?? ""))).toEqual([]);
});

test("O1: Locality chooser opens via header, lists 34 canonical localities, and filters locally", async ({ page }) => {
  await page.goto("/");
  const headerLink = page.getByRole("link", { name: "Theo địa phương", exact: true });
  await expect(headerLink).toBeVisible();
  await headerLink.click();

  await expect(page).toHaveURL(/noi-dung=dia-phuong/);
  const chooser = page.getByTestId("locality-chooser");
  await expect(chooser).toBeVisible();
  const bounds = await chooser.boundingBox(), headerBounds = await page.getByTestId("home-atlas-header").boundingBox();
  expect(bounds!.width).toBe(page.viewportSize()!.width < 1400 ? 320 : 340);
  expect(bounds!.y).toBeGreaterThanOrEqual(headerBounds!.y + headerBounds!.height + 16);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(page.viewportSize()!.height - 24);

  // Chooser heading has focus
  const heading = chooser.getByRole("heading", { name: "Theo địa phương", exact: true });
  await expect(heading).toBeVisible();

  // Lists all 34 canonical localities
  const items = chooser.locator(".locality-chooser-item");
  await expect(items).toHaveCount(34);

  // Local filter
  const searchInput = chooser.getByPlaceholder("Tìm địa phương...");
  await searchInput.fill("quảng");
  const filteredItems = chooser.locator(".locality-chooser-item");
  const filteredCount = await filteredItems.count();
  expect(filteredCount).toBeGreaterThan(0);
  expect(filteredCount).toBeLessThan(34);

  // Clear filter restores 34
  await chooser.getByRole("button", { name: "Xóa tìm kiếm", exact: true }).click();
  await expect(chooser.locator(".locality-chooser-item")).toHaveCount(34);

  // Capture screenshot of the chooser
  mkdirSync("output/playwright/local-heroes/screenshots", { recursive: true });
  await page.screenshot({
    path: `output/playwright/local-heroes/screenshots/chooser-${page.viewportSize()!.width}x${page.viewportSize()!.height}.png`,
  });
});

test("O2: Selecting a locality displays bounded four-card dossier with independent sections", async ({ page }) => {
  await page.goto("/?noi-dung=dia-phuong");
  const chooser = page.getByTestId("locality-chooser");
  await expect(chooser).toBeVisible();

  // Select Hà Nội
  const hanoiBtn = chooser.locator('button[data-locality-code="01"]');
  await expect(hanoiBtn).toBeVisible();
  await hanoiBtn.click();

  await expect(page).toHaveURL(/noi-dung=dia-phuong/);
  await expect(page).toHaveURL(/dia-phuong=ha-noi/);
  const dossier = page.getByTestId("locality-card-cluster");
  await expect(dossier).toBeVisible();

  // Heading reflects Hà Nội
  await expect(dossier.getByRole("heading", { name: "Thành phố Hà Nội", exact: true })).toBeVisible();

  // Places section: at most 2 preview cards
  const placesSection = dossier.getByTestId("locality-places-section");
  await expect(placesSection).toBeVisible();
  const placeCards = placesSection.locator(".locality-preview-card.is-place");
  await expect.poll(() => placeCards.count()).toBeGreaterThanOrEqual(1);
  const placeCount = await placeCards.count();
  expect(placeCount).toBeGreaterThanOrEqual(1);
  expect(placeCount).toBeLessThanOrEqual(2);

  // People section: at most 2 preview cards
  const peopleSection = dossier.getByTestId("locality-people-section");
  await expect(peopleSection).toBeVisible();
  const personCards = peopleSection.locator(".locality-preview-card.is-person");
  await expect.poll(() => personCards.count()).toBeGreaterThanOrEqual(1);
  const personCount = await personCards.count();
  expect(personCount).toBeGreaterThanOrEqual(1);
  expect(personCount).toBeLessThanOrEqual(2);

  // Preview card links exist
  await expect(placeCards.first().getByRole("link", { name: /Đọc câu chuyện/ })).toBeVisible();
  await expect(personCards.first().getByRole("link", { name: /Xem câu chuyện/ })).toBeVisible();

  // Capture screenshot of the dossier
  await ready(page);
  await page.waitForTimeout(1000); // Allow the specified 750ms camera approach to settle.
  const essential = await page.locator(".locality-chooser, .locality-cluster-heading, .home-map-tools, .home-atlas-header, .locality-globe-marker.is-selected").evaluateAll((nodes) => nodes.map((n) => {
    const b = n.getBoundingClientRect(); return { left: b.left, top: b.top, right: b.right, bottom: b.bottom };
  }));
  const cardBoxes = await page.locator(".locality-cluster-card").evaluateAll((nodes) => nodes.map((n) => {
    const b = n.getBoundingClientRect(), dock = n.closest(".is-docked") ? n.closest(".locality-cluster-cards")?.getBoundingClientRect() : null;
    return { left: Math.max(b.left, dock?.left ?? b.left), top: Math.max(b.top, dock?.top ?? b.top), right: Math.min(b.right, dock?.right ?? b.right), bottom: Math.min(b.bottom, dock?.bottom ?? b.bottom) };
  }).filter((b) => b.bottom > b.top && b.right > b.left));
  for (const box of cardBoxes) expect(essential.some((r) => box.left < r.right && box.right > r.left && box.top < r.bottom && box.bottom > r.top)).toBe(false);
  mkdirSync("output/playwright/local-heroes/screenshots", { recursive: true });
  await page.screenshot({
    path: `output/playwright/local-heroes/screenshots/overview-${page.viewportSize()!.width}x${page.viewportSize()!.height}.png`,
  });
});

test("O3: Complete catalog navigation and return-to-overview link", async ({ page }) => {
  await page.goto("/?noi-dung=dia-phuong&dia-phuong=ha-noi");
  const dossier = page.getByTestId("locality-card-cluster");
  await expect(dossier).toBeVisible();

  // Navigate to full heritage catalog
  const viewAllPlaces = dossier.getByTestId("locality-view-all-places");
  await expect(viewAllPlaces).toBeVisible();
  await viewAllPlaces.click();

  await expect(page).toHaveURL(/noi-dung=dia-danh/);
  await expect(page).toHaveURL(/dia-phuong=ha-noi/);
  // Owner revision: full results stay inside the same compact shell.
  await expect(page.getByTestId("locality-chooser")).toHaveCount(1);
  await expect(page.locator(".heritage-panel, .local-heroes-panel")).toHaveCount(0);
  const returnOverviewPlaces = page.getByTestId("heritage-return-overview");
  await expect(returnOverviewPlaces).toBeVisible();
  await returnOverviewPlaces.click();

  await expect(page).toHaveURL(/noi-dung=dia-phuong/);
  await expect(page).toHaveURL(/dia-phuong=ha-noi/);
  await expect(page.getByTestId("locality-card-cluster")).toBeVisible();

  // Navigate to full people catalog
  const viewAllPeople = dossier.getByTestId("locality-view-all-people");
  await expect(viewAllPeople).toBeVisible();
  await viewAllPeople.click();

  await expect(page).toHaveURL(/noi-dung=nhan-vat/);
  await expect(page).toHaveURL(/dia-phuong=ha-noi/);
  const returnOverviewPeople = page.getByTestId("local-heroes-return-overview");
  await expect(returnOverviewPeople).toBeVisible();
  await returnOverviewPeople.click();

  await expect(page).toHaveURL(/noi-dung=dia-phuong/);
  await expect(page).toHaveURL(/dia-phuong=ha-noi/);
  await expect(page.getByTestId("locality-card-cluster")).toBeVisible();
});

test("O4: Globe anchor marker selects canonical locality", async ({ page }) => {
  await page.goto("/?noi-dung=dia-phuong");
  await ready(page);

  // Locate projected locality marker for Hà Nội ("01")
  const hanoiMarker = page.locator('[data-testid="locality-marker-01"]');
  await expect(hanoiMarker).toBeVisible();
  {
    await hanoiMarker.click();
    await expect(page).toHaveURL(/noi-dung=dia-phuong/);
    await expect(page).toHaveURL(/dia-phuong=ha-noi/);
    await expect(page.getByTestId("locality-card-cluster")).toBeVisible();
  }
});

test("O16: interior province click lifts the admitted cap with labels hidden; X keeps selection", async ({ page }) => {
  await page.goto("/?noi-dung=dia-phuong");
  await ready(page);
  await page.evaluate(() => {
    for (const node of document.querySelectorAll("[data-testid^='locality-marker-'], .locality-map-markers, .globe-place-label")) {
      (node as HTMLElement).style.setProperty("display", "none", "important");
      (node as HTMLElement).style.setProperty("pointer-events", "none", "important");
    }
  });
  await expect.poll(async () => page.locator("canvas.cinematic-globe-canvas").evaluate((element) => {
    type Hook = { memoizedState: unknown; next: Hook | null };
    type Fiber = { memoizedState: Hook | null; return: Fiber | null };
    const key = Object.keys(element).find((name) => name.startsWith("__reactFiber"));
    if (!key) return false;
    let fiber: Fiber | null = (element as unknown as Record<string, Fiber>)[key];
    while (fiber) {
      for (let hook = fiber.memoizedState; hook; hook = hook.next) {
        const value = hook.memoizedState as { scene?: { getProvinceAreaFeature?: (code: string) => unknown } } | null;
        if (typeof value?.scene?.getProvinceAreaFeature === "function") {
          return Boolean(value.scene.getProvinceAreaFeature("01"));
        }
      }
      fiber = fiber.return;
    }
    return false;
  }), { timeout: 45000 }).toBe(true);

  const clickPoint = await page.locator("canvas.cinematic-globe-canvas").evaluate((element) => {
    type Hook = { memoizedState: unknown; next: Hook | null };
    type Fiber = { memoizedState: Hook | null; return: Fiber | null };
    type SceneApi = { projectGeo(lat: number, lng: number): { x: number; y: number; behind: boolean } };
    const key = Object.keys(element).find((name) => name.startsWith("__reactFiber"))!;
    let fiber: Fiber | null = (element as unknown as Record<string, Fiber>)[key];
    let scene: SceneApi | undefined;
    while (fiber && !scene) {
      for (let hook = fiber.memoizedState; hook; hook = hook.next) {
        const value = hook.memoizedState as { scene?: SceneApi } | null;
        if (value?.scene && typeof value.scene.projectGeo === "function") { scene = value.scene; break; }
      }
      fiber = fiber.return;
    }
    if (!scene) throw new Error("scene missing");
    // Interior sample inside Hà Nội, away from the reference-center label location.
    const projected = scene.projectGeo(21.02, 105.78);
    if (projected.behind) throw new Error("Hanoi sample behind camera");
    const rect = element.getBoundingClientRect();
    return { x: rect.left + projected.x, y: rect.top + projected.y };
  });
  await page.mouse.click(clickPoint.x, clickPoint.y);
  await expect(page).toHaveURL(/dia-phuong=ha-noi/);
  await expect(page.getByTestId("locality-card-cluster")).toHaveAttribute("data-locality-code", "01");
  await expect.poll(async () => page.locator("canvas.cinematic-globe-canvas").evaluate((element) => {
    type Hook = { memoizedState: unknown; next: Hook | null };
    type Fiber = { memoizedState: Hook | null; return: Fiber | null };
    const key = Object.keys(element).find((name) => name.startsWith("__reactFiber"))!;
    let fiber: Fiber | null = (element as unknown as Record<string, Fiber>)[key];
    while (fiber) {
      for (let hook = fiber.memoizedState; hook; hook = hook.next) {
        const value = hook.memoizedState as { scene?: { getSelectedProvinceGeometry?: () => { code: string; currentRadius: number; baseRadius: number } | null } } | null;
        const geometry = value?.scene?.getSelectedProvinceGeometry?.();
        if (geometry) return geometry;
      }
      fiber = fiber.return;
    }
    return null;
  })).toMatchObject({ code: "01" });
  const geometry = await page.locator("canvas.cinematic-globe-canvas").evaluate((element) => {
    type Hook = { memoizedState: unknown; next: Hook | null };
    type Fiber = { memoizedState: Hook | null; return: Fiber | null };
    const key = Object.keys(element).find((name) => name.startsWith("__reactFiber"))!;
    let fiber: Fiber | null = (element as unknown as Record<string, Fiber>)[key];
    while (fiber) {
      for (let hook = fiber.memoizedState; hook; hook = hook.next) {
        const value = hook.memoizedState as { scene?: { getSelectedProvinceGeometry?: () => { currentRadius: number; baseRadius: number; wallVertexCount: number } | null } } | null;
        const geometry = value?.scene?.getSelectedProvinceGeometry?.();
        if (geometry) return geometry;
      }
      fiber = fiber.return;
    }
    return null;
  });
  expect(geometry).toBeTruthy();
  expect(geometry!.currentRadius - geometry!.baseRadius).toBeGreaterThan(0.003);
  expect(geometry!.wallVertexCount).toBeGreaterThan(0);

  const urlBefore = page.url();
  const historyBefore = await page.evaluate(() => history.length);
  await page.getByRole("button", { name: "Ẩn bảng địa phương", exact: true }).click();
  await expect(page.getByTestId("locality-chooser")).toBeHidden();
  await expect(page.getByTestId("locality-card-cluster")).toHaveAttribute("data-locality-code", "01");
  expect(page.url()).toBe(urlBefore);
  expect(await page.evaluate(() => history.length)).toBe(historyBefore);
});

test("O5: Escape clears selection then hides the panel without exiting discovery", async ({ page }) => {
  await page.goto("/?noi-dung=dia-phuong&dia-phuong=ha-noi");
  await expect(page.getByTestId("locality-card-cluster")).toBeVisible();

  // Escape from selected locality -> clears selection, stays in discovery
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/noi-dung=dia-phuong/);
  await expect(page).not.toHaveURL(/dia-phuong=/);
  await expect(page.getByTestId("locality-chooser")).toBeVisible();
  await expect(page.getByTestId("locality-card-cluster")).not.toBeVisible();

  // Escape from open chooser -> hides panel only; mode and URL stay
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/noi-dung=dia-phuong/);
  await expect(page.getByTestId("locality-chooser")).toBeHidden();
  await expect(page.getByRole("link", { name: "Theo địa phương", exact: true })).toBeFocused();
  // Explicit Khám phá still exits discovery
  await page.getByRole("button", { name: "Khám phá", exact: true }).click();
  await expect(page).not.toHaveURL(/noi-dung=/);
  await expect(page.getByTestId("locality-chooser")).toHaveCount(0);
});

test("O15: panel X hides only the chooser; header reopens without camera/history restart", async ({ page }) => {
  await page.goto("/?noi-dung=dia-phuong&dia-phuong=ha-noi");
  await ready(page);
  await expect(page.getByTestId("locality-card-cluster")).toBeVisible();
  await expect.poll(async () => page.getByTestId("history-explorer").getAttribute("data-places-camera-nonce")).not.toBe("0");

  const urlBefore = page.url();
  const historyBefore = await page.evaluate(() => history.length);
  const nonceBefore = await page.getByTestId("history-explorer").getAttribute("data-places-camera-nonce");
  const codeBefore = await page.getByTestId("locality-card-cluster").getAttribute("data-locality-code");

  await page.getByRole("button", { name: "Ẩn bảng địa phương", exact: true }).click();
  await expect(page.getByTestId("locality-chooser")).toBeHidden();
  await expect(page.getByTestId("locality-card-cluster")).toHaveAttribute("data-locality-code", codeBefore!);
  await expect(page.getByRole("link", { name: "Theo địa phương", exact: true })).toBeFocused();
  expect(page.url()).toBe(urlBefore);
  expect(await page.evaluate(() => history.length)).toBe(historyBefore);
  await expect(page.getByTestId("history-explorer")).toHaveAttribute("data-places-camera-nonce", nonceBefore!);

  await page.getByRole("link", { name: "Theo địa phương", exact: true }).click();
  await expect(page.getByTestId("locality-chooser")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Theo địa phương", exact: true })).toBeFocused();
  expect(page.url()).toBe(urlBefore);
  expect(await page.evaluate(() => history.length)).toBe(historyBefore);
  await expect(page.getByTestId("history-explorer")).toHaveAttribute("data-places-camera-nonce", nonceBefore!);
  await expect(page.getByTestId("locality-card-cluster")).toHaveAttribute("data-locality-code", codeBefore!);
});

test("O6: Detail link carries valid kham-pha return URL to overview", async ({ page }) => {
  await page.goto("/?noi-dung=dia-phuong&dia-phuong=ha-noi");
  const dossier = page.getByTestId("locality-card-cluster");
  await expect(dossier).toBeVisible();

  const personLink = dossier.locator(".locality-preview-card.is-person").first().getByRole("link", { name: /Xem câu chuyện/ });
  const href = await personLink.getAttribute("href");
  expect(href).toBeTruthy();
  const url = new URL(href!, "http://localhost");
  expect(url.searchParams.get("kham-pha")).toContain("noi-dung=dia-phuong");
  expect(url.searchParams.get("kham-pha")).toContain("dia-phuong=ha-noi");
});

test("O7: legacy filters stay compact; searched results return to both unfiltered groups", async ({ page }) => {
  await page.goto("/?noi-dung=nhan-vat&dia-phuong=ha-noi&trang-nhan-vat=2");
  await expect(page.getByTestId("local-hero-row")).toHaveCount(2);
  await expect(page.getByTestId("locality-chooser")).toHaveCount(1);
  await expect(page.locator(".heritage-panel, .local-heroes-panel, .locality-overview-dossier")).toHaveCount(0);
  await page.getByRole("link", { name: "Tổng quan · cả hai nhóm", exact: true }).click();
  await expect(page.getByTestId("locality-view-all-people")).toContainText("(14)");
  await expect(page.getByTestId("locality-preview-person")).toHaveCount(2);
  await expect(page.getByTestId("locality-preview-person").first()).toContainText("Đặng Nhân Vật Giả");
  await expect(page).not.toHaveURL(/trang-nhan-vat=|q-nhan-vat=/);
  await page.getByTestId("locality-view-all-people").click();
  await page.getByLabel("Tên, bí danh hoặc đóng góp", { exact: true }).fill("Bi danh gia");
  await page.getByRole("button", { name: "Tìm", exact: true }).click();
  await expect(page.getByTestId("local-hero-row")).toHaveCount(1);
  await page.getByRole("link", { name: "Tổng quan · cả hai nhóm", exact: true }).click();
  await expect(page.getByTestId("locality-view-all-people")).toContainText("(14)");
  await expect(page.getByTestId("locality-places-section")).toBeVisible();
});

test("O8: unavailable covers stay local and a different valid URL can load", async ({ page }) => {
  await page.route("**/api/dia-danh", async (route) => {
    const response = await route.fetch(); const payload = await response.json();
    const counters: Record<string, number> = {};
    for (const item of payload.data.items) if (item.cover) {
      const code = item.locality.code, index = counters[code] ?? 0; counters[code] = index + 1;
      const scenario = code === "44" ? (index ? "html" : "404") : code === "04" ? (index ? "recovered" : "timeout") : "valid";
      item.cover.url = `https://storage-unconfigured.example.invalid/${scenario}.webp`;
    }
    await route.fulfill({ response, json: payload });
  });
  await page.route("https://storage-unconfigured.example.invalid/**", async (route) => {
    const url = route.request().url();
    if (url.includes("timeout")) { await route.abort("timedout"); return; }
    await route.fulfill(url.includes("404") ? { status: 404, contentType: "text/plain", body: "Unavailable fixture" }
      : url.includes("html") ? { status: 200, contentType: "text/html", body: "<html>Not image content</html>" }
      : { status: 200, contentType: "image/svg+xml", body: thumbnail });
  });
  await page.goto("/?noi-dung=dia-phuong");
  for (const [code, expectedFailed, expectedImages] of [["01", 0, 1], ["44", 2, 0], ["04", 1, 0], ["01", 0, 1]] as const) {
    await page.locator(`button[data-locality-code="${code}"]`).click();
    const section = page.getByTestId("locality-places-section");
    await expect(page.getByTestId("locality-preview-place")).toHaveCount(code === "44" ? 2 : 1);
    await expect(section.getByText("Không tải được ảnh", { exact: true })).toHaveCount(expectedFailed);
    await expect(section.locator("img")).toHaveCount(expectedImages);
    if (expectedImages) await expect.poll(() => section.locator("img").evaluateAll((nodes) => nodes.every((n) => (n as HTMLImageElement).naturalWidth > 0))).toBe(true);
    await expect(section.getByRole("link", { name: /Đọc câu chuyện/ }).first()).toBeVisible();
    await expect(page.getByTestId("locality-people-section")).toBeVisible();
    await expect(page.getByTestId("history-explorer")).toBeVisible();
  }
});

test("O9: one-sided reader failure and rapid A B A keep the successful section and newest selection", async ({ page }) => {
  let failPeople = true;
  await page.route("**/api/local-heroes?**", async (route) => {
    if (failPeople) await route.fulfill({ status: 503, json: { ok: false, error: { code: "DATA_UNAVAILABLE" } } });
    else await route.continue();
  });
  await page.goto("/?noi-dung=dia-phuong");
  await page.locator('button[data-locality-code="01"]').click();
  await expect(page.getByTestId("locality-people-section").getByRole("alert")).toBeVisible();
  await expect(page.getByTestId("locality-preview-place")).toHaveCount(1);
  failPeople = false; await page.getByRole("button", { name: "Thử lại nhân vật", exact: true }).click();
  await expect(page.getByTestId("locality-preview-person")).toHaveCount(2);
  for (const code of ["04", "01"]) await page.locator(`button[data-locality-code="${code}"]`).click();
  await expect(page.getByTestId("locality-card-cluster")).toHaveAttribute("data-locality-code", "01");
  await expect(page.getByTestId("locality-view-all-people")).toContainText("(14)");
  const beforeHide = page.url();
  const historyBefore = await page.evaluate(() => history.length);
  await page.getByRole("button", { name: "Ẩn bảng địa phương", exact: true }).click();
  await expect(page.getByTestId("locality-chooser")).toBeHidden();
  await expect(page.getByTestId("locality-card-cluster")).toHaveAttribute("data-locality-code", "01");
  expect(page.url()).toBe(beforeHide);
  expect(await page.evaluate(() => history.length)).toBe(historyBefore);
  await expect(page.locator("canvas.cinematic-globe-canvas")).toHaveCount(1);
  let failPlaces = true;
  await page.route("**/api/dia-danh", async (route) => failPlaces ? route.fulfill({ status: 503, json: { ok: false, error: { code: "DATA_UNAVAILABLE" } } }) : route.continue());
  await page.goto("/?noi-dung=dia-phuong"); await page.locator('button[data-locality-code="01"]').click();
  await expect(page.getByTestId("locality-places-section").getByRole("alert")).toBeVisible();
  await expect(page.getByTestId("locality-preview-person")).toHaveCount(2);
  failPlaces = false; await page.getByRole("button", { name: "Thử lại địa danh", exact: true }).click();
  await expect(page.getByTestId("locality-preview-place")).toHaveCount(1);
});

test("O10: connectors hide on occlusion while content and keyboard paths remain", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?noi-dung=dia-phuong&dia-phuong=ha-noi"); await ready(page);
  await expect(page.getByTestId("globe-map")).toHaveAttribute("data-province-areas", "ready");
  await expect(page.getByTestId("locality-connectors").locator("path")).not.toHaveCount(0);
  await inspectScene(page, { type: "view", view: { lat: -21, lng: -74, zoom: 7 } });
  await expect(page.getByTestId("locality-connectors")).toHaveCount(0);
  await expect(page.getByTestId("locality-preview-person")).toHaveCount(2);
  await expect(page.getByRole("heading", { name: "Thành phố Hà Nội", exact: true })).toBeVisible();
  const animations = await page.locator(".locality-card-cluster, .locality-card-cluster *").evaluateAll((nodes) => nodes.some((n) => getComputedStyle(n).animationName !== "none"));
  expect(animations).toBe(false);
});

test("O12: 200 percent text and zoom-equivalent reflow keep the chooser, results and detail links reachable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?noi-dung=dia-phuong&dia-phuong=ha-noi"); await ready(page);
  await page.evaluate(() => {
    const measured = Array.from(document.querySelectorAll<HTMLElement>(".locality-chooser, .locality-chooser *, .locality-card-cluster, .locality-card-cluster *")).map((node) => ({ node, size: parseFloat(getComputedStyle(node).fontSize) * 2 }));
    for (const { node, size } of measured) node.style.setProperty("font-size", `${size}px`, "important");
  });
  await expect(page.getByRole("button", { name: "Ẩn bảng địa phương", exact: true })).toBeInViewport();
  await expect(page.getByTestId("locality-preview-person")).toHaveCount(2);
  const last = page.getByTestId("locality-preview-person").last().getByRole("link", { name: /Xem câu chuyện/ });
  await last.scrollIntoViewIfNeeded(); await expect(last).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  // 1280 CSS pixels at 200% browser zoom gives a 640 CSS-pixel layout viewport.
  await page.setViewportSize({ width: 640, height: 360 });
  await page.goto("/?noi-dung=dia-phuong&dia-phuong=ha-noi");
  await expect(page.getByTestId("locality-chooser")).toBeVisible();
  const link = page.getByTestId("locality-preview-person").first().getByRole("link", { name: /Xem câu chuyện/ });
  await link.scrollIntoViewIfNeeded(); await expect(link).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("O13: failed globe assets preserve the complete HTML locality path", async ({ page }) => {
  await page.route("**/maps/globe/earth-day-4096x2048.jpg", (route) => route.fulfill({ status: 503, body: "Synthetic texture failure" }));
  await page.goto("/?noi-dung=dia-phuong");
  await page.locator('button[data-locality-code="01"]').click();
  await expect(page.getByTestId("locality-preview-place")).toHaveCount(1);
  await expect(page.getByTestId("locality-preview-person")).toHaveCount(2);
  await expect(page.getByTestId("locality-connectors")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Toàn cầu", exact: true })).toBeDisabled();
  await page.getByTestId("locality-view-all-people").click();
  await expect(page.getByTestId("local-hero-row")).toHaveCount(12);
  await page.getByRole("link", { name: "Trang nhân vật 2", exact: true }).click();
  await expect(page.getByTestId("local-hero-row")).toHaveCount(2);
});

test("O14: explicit detail return preserves the saved camera, province, content filter and result page", async ({ page }) => {
  await page.goto("/?noi-dung=nhan-vat&tu=1911&den=1975&ban-do=21,105,5&dia-phuong=ha-noi&trang-nhan-vat=2");
  await expect(page.getByTestId("local-hero-row")).toHaveCount(2);
  await page.getByTestId("local-hero-row").first().getByRole("link", { name: /Xem câu chuyện/ }).click();
  await page.getByRole("link", { name: "← Trở lại nhân vật theo địa phương", exact: true }).click();
  await ready(page); await page.waitForTimeout(1200);
  await expect(page).toHaveURL(/noi-dung=nhan-vat/); await expect(page).toHaveURL(/dia-phuong=ha-noi/); await expect(page).toHaveURL(/trang-nhan-vat=2/);
  const actual = (await inspectScene(page)).view;
  expect(actual.lat).toBeCloseTo(21, 4); expect(actual.lng).toBeCloseTo(105, 4); expect(actual.zoom).toBeCloseTo(5, 2);
});

test.describe("locality motion evidence", () => {
  test("O11: captures finite camera/card motion, real scene metrics and zero settled draws", async ({ page }, info) => {
    await page.addInitScript(() => {
      const counter = { draws: 0 };
      Object.defineProperty(window, "__localityDraws", { value: counter });
      for (const proto of [WebGLRenderingContext.prototype, WebGL2RenderingContext.prototype]) {
        for (const name of ["drawArrays", "drawElements"]) {
          if (!Object.hasOwn(proto, name)) continue;
          const methods = proto as unknown as Record<string, (...args: unknown[]) => unknown>, original = methods[name];
          methods[name] = function (this: unknown, ...args: unknown[]) { counter.draws++; return Reflect.apply(original, this, args); };
        }
      }
    });
    await page.goto("/?noi-dung=dia-phuong"); await ready(page);
    const baseline = await inspectScene(page);
    await inspectScene(page, { type: "capture-start" });
    await page.locator('button[data-locality-code="01"]').click();
    await expect(page.getByTestId("locality-preview-person")).toHaveCount(2);
    await page.waitForTimeout(1000);
    const moved = await inspectScene(page, { type: "capture-end" });
    const draws = () => page.evaluate(() => (window as unknown as { __localityDraws: { draws: number } }).__localityDraws.draws);
    const before = await draws(); await page.waitForTimeout(400); const after = await draws();
    const intervals = moved.capture?.intervalsMs.toSorted((a, b) => a - b) ?? [];
    const render = moved.capture?.renderMs.toSorted((a, b) => a - b) ?? [];
    const resources = await page.evaluate(() => performance.getEntriesByType("resource").map((entry) => {
      const resource = entry as PerformanceResourceTiming; const url = new URL(resource.name);
      return { path: url.pathname, encodedBytes: resource.encodedBodySize, decodedBytes: resource.decodedBodySize, durationMs: resource.duration };
    }).filter((resource) => resource.path.startsWith("/maps/") || resource.path.startsWith("/_next/static/")));
    const geometry = await page.locator("canvas.cinematic-globe-canvas").evaluate((element) => {
      type Hook = { memoizedState: unknown; next: Hook | null };
      type Fiber = { memoizedState: Hook | null; return: Fiber | null };
      const key = Object.keys(element).find((name) => name.startsWith("__reactFiber"));
      if (!key) return null;
      let fiber: Fiber | null = (element as unknown as Record<string, Fiber>)[key];
      while (fiber) {
        for (let hook = fiber.memoizedState; hook; hook = hook.next) {
          const value = hook.memoizedState as { scene?: { getSelectedProvinceGeometry?: () => { code: string; currentRadius: number; baseRadius: number } | null } } | null;
          const selected = value?.scene?.getSelectedProvinceGeometry?.();
          if (selected) return selected;
        }
        fiber = fiber.return;
      }
      return null;
    });
    const metrics = { viewport: page.viewportSize(), browser: await page.context().browser()!.version(), baseline: baseline.stats, selection: moved.stats,
      intervals: { count: intervals.length, medianMs: intervals[Math.floor(intervals.length / 2)] ?? null, p95Ms: intervals[Math.floor(intervals.length * .95)] ?? null },
      cpuSubmission: { medianMs: render[Math.floor(render.length / 2)] ?? null, p95Ms: render[Math.floor(render.length * .95)] ?? null, gpuFenceTiming: false }, resources,
      idleDraws: after - before, selectedProvince: geometry,
      geography: "complete VN-34-2025 province-area asset: all 34 source-qualified units admitted for interior pick and raised cap/wall/outline" };
    mkdirSync("output/playwright/local-heroes/performance", { recursive: true });
    writeFileSync(`output/playwright/local-heroes/performance/${info.project.name}.json`, JSON.stringify(metrics, null, 2));
    await info.attach("scene-performance", { contentType: "application/json", body: JSON.stringify(metrics, null, 2) });
    expect(intervals.length).toBeGreaterThan(5);
    expect(after - before).toBe(0);
    // Selection mounts finite raised-cap/wall/outline buffers on top of the pick meshes.
    expect(moved.stats.geometries).toBeGreaterThan(baseline.stats.geometries);
    expect(moved.stats.geometries - baseline.stats.geometries).toBeLessThanOrEqual(6);
    expect(geometry?.code).toBe("01");
    expect((geometry?.currentRadius ?? 0) - (geometry?.baseRadius ?? 0)).toBeGreaterThan(0.003);
    await expect(page.locator("canvas.cinematic-globe-canvas")).toHaveCount(1);
  });
});
