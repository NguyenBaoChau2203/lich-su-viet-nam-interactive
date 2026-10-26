import fs from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";

const LESSON_SLUGS = [
  "cach-mang-thang-tam-1945",
  "chien-dich-dien-bien-phu",
  "duong-truong-son",
  "tet-mau-than-1968",
  "dien-bien-phu-tren-khong-1972",
  "chien-dich-ho-chi-minh-1975",
];

const FIXTURES_DIR = path.resolve(process.cwd(), "tests/e2e/fixtures/lesson-inventory");
const ALLOWED_CHANGES_FILE = path.join(FIXTURES_DIR, "allowed-changes.json");

type Inventory = {
  texts: string[];
  imgs: string[];
  links: string[];
  controls: string[];
};

type AllowedChange = {
  from: string;
  to: string;
  reason: string;
};

function normalizeString(str: string): string {
  const s = str.replace(/\s+/g, " ").trim();
  if (/^Bước \d+\/\d+$/.test(s)) {
    return "Bước #/#";
  }
  return s;
}

async function collectFromPage(page: Page): Promise<{
  texts: string[];
  imgs: string[];
  links: string[];
  controls: string[];
  fullMainText: string;
}> {
  return page.evaluate(() => {
    const root = document.querySelector("main");
    if (!root) {
      return { texts: [], imgs: [], links: [], controls: [], fullMainText: "" };
    }
    const texts = new Set<string>();
    const imgs = new Set<string>();
    const links = new Set<string>();
    const controls = new Set<string>();

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const p = n.parentElement;
      if (!p || p.closest("script,style,noscript")) continue;
      const t = n.textContent ? n.textContent.replace(/\s+/g, " ").trim() : "";
      if (t.length > 1) texts.add(t);
    }

    root.querySelectorAll("img").forEach((i) => {
      const src = i.getAttribute("src");
      if (src) imgs.add(src);
    });

    root.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href");
      const text = a.textContent ? a.textContent.replace(/\s+/g, " ").trim() : "";
      if (href) links.add(`${href}|${text}`);
    });

    root.querySelectorAll("button,[role=tab]").forEach((b) => {
      const label = b.getAttribute("aria-label") || b.textContent || "";
      const text = label.replace(/\s+/g, " ").trim();
      if (text) controls.add(text);
    });

    const fullMainText = (root.textContent || "").replace(/\s+/g, " ");

    return {
      texts: [...texts],
      imgs: [...imgs],
      links: [...links],
      controls: [...controls],
      fullMainText,
    };
  });
}

test.describe("Lesson content parity (zero content loss)", () => {
  test.use({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });

  for (const slug of LESSON_SLUGS) {
    test(`content parity: ${slug}`, async ({ page }) => {
      await page.goto(`/bai-hoc/${slug}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1000);

      const allTexts = new Set<string>();
      const allImgs = new Set<string>();
      const allLinks = new Set<string>();
      const allControls = new Set<string>();
      let fullMainText = "";

      const record = async () => {
        const snap = await collectFromPage(page);
        snap.texts.forEach((t) => allTexts.add(normalizeString(t)));
        snap.imgs.forEach((i) => allImgs.add(i));
        snap.links.forEach((l) => allLinks.add(l));
        snap.controls.forEach((c) => allControls.add(normalizeString(c)));
        fullMainText = snap.fullMainText;
      };

      // 1. Initial page view
      await record();

      // 2. Open map help
      const helpBtn = page.getByRole("button", { name: /Cách dùng bản đồ/i });
      if (await helpBtn.count() > 0) {
        await helpBtn.scrollIntoViewIfNeeded();
        await helpBtn.click();
        await page.waitForTimeout(300);
        await record();
      }

      // 3. Step buttons in 2D map
      const stepNav = page.getByRole("navigation", { name: "Các bước diễn biến" });
      if (await stepNav.count() > 0) {
        const stepBtns = stepNav.locator("button");
        const count = await stepBtns.count();
        for (let s = 0; s < count; s++) {
          await stepBtns.nth(s).click();
          await page.waitForTimeout(1200);
          await record();
        }
      }

      // 4. Tư liệu tabs
      const resourceTabs = page.locator("section[aria-labelledby='tu-lieu'] [role='tablist'] [role='tab']");
      const tabCount = await resourceTabs.count();
      for (let t = 0; t < tabCount; t++) {
        const tab = resourceTabs.nth(t);
        await tab.scrollIntoViewIfNeeded();
        await tab.click();
        await page.waitForTimeout(400);
        await record();

        // Inside the opened panel, check for photo3d-tab or model-tab
        const subTabs = page.locator("[data-testid='photo3d-tab'], [data-testid='model-tab']");
        const subCount = await subTabs.count();
        for (let st = 0; st < subCount; st++) {
          const sub = subTabs.nth(st);
          await sub.scrollIntoViewIfNeeded();
          await sub.click();
          await page.waitForTimeout(400);
          await record();

          // Check for exhibit mode toggle
          const photoModeBtn = page.locator("[data-testid='exhibit-mode-photo']");
          const scanModeBtn = page.locator("[data-testid='exhibit-mode-scan']");
          if (await photoModeBtn.count() > 0 && await scanModeBtn.count() > 0) {
            await scanModeBtn.click();
            await page.waitForTimeout(300);
            await record();
            await photoModeBtn.click();
            await page.waitForTimeout(300);
            await record();
          }

          // Click every hotspot chip in the current item
          const hotspotChips = page.locator("ul[aria-label*='chi tiết' i] button, [data-hotspot]");
          const chipCount = await hotspotChips.count();
          for (let hc = 0; hc < chipCount; hc++) {
            await hotspotChips.nth(hc).click();
            await page.waitForTimeout(200);
            await record();
          }
        }
      }

      const currentInventory: Inventory = {
        texts: [...allTexts].sort(),
        imgs: [...allImgs].sort(),
        links: [...allLinks].sort(),
        controls: [...allControls].sort(),
      };

      const fixtureFile = path.join(FIXTURES_DIR, `${slug}.json`);

      if (process.env.INVENTORY_WRITE === "1") {
        fs.writeFileSync(fixtureFile, JSON.stringify(currentInventory, null, 2), "utf8");
        console.log(`Wrote inventory fixture for ${slug}: ${currentInventory.texts.length} texts, ${currentInventory.imgs.length} images, ${currentInventory.links.length} links, ${currentInventory.controls.length} controls`);
        return;
      }

      // COMPARE MODE
      if (!fs.existsSync(fixtureFile)) {
        throw new Error(`Missing baseline fixture ${fixtureFile}. Run with INVENTORY_WRITE=1 first.`);
      }

      const baseline: Inventory = JSON.parse(fs.readFileSync(fixtureFile, "utf8"));
      let allowedChanges: AllowedChange[] = [];
      if (fs.existsSync(ALLOWED_CHANGES_FILE)) {
        allowedChanges = JSON.parse(fs.readFileSync(ALLOWED_CHANGES_FILE, "utf8"));
      }

      const currentTextSet = new Set(currentInventory.texts);
      const currentImgSet = new Set(currentInventory.imgs);
      const currentLinkSet = new Set(currentInventory.links);
      const currentControlSet = new Set(currentInventory.controls);

      const missingTexts: string[] = [];
      for (const t of baseline.texts) {
        if (currentTextSet.has(t)) continue;
        // Check allowed changes
        const allowed = allowedChanges.find((a) => a.from === t);
        if (allowed && currentTextSet.has(allowed.to)) continue;
        // Substring fallback check against full main text (tolerant to node splitting/joining)
        if (fullMainText.includes(t)) continue;
        missingTexts.push(t);
      }

      const missingImgs: string[] = [];
      for (const img of baseline.imgs) {
        if (currentImgSet.has(img)) continue;
        const allowed = allowedChanges.find((a) => a.from === img);
        if (allowed && currentImgSet.has(allowed.to)) continue;
        missingImgs.push(img);
      }

      const missingLinks: string[] = [];
      for (const l of baseline.links) {
        if (currentLinkSet.has(l)) continue;
        const allowed = allowedChanges.find((a) => a.from === l);
        if (allowed && currentLinkSet.has(allowed.to)) continue;
        missingLinks.push(l);
      }

      const missingControls: string[] = [];
      for (const c of baseline.controls) {
        if (currentControlSet.has(c)) continue;
        const allowed = allowedChanges.find((a) => a.from === c);
        if (allowed && currentControlSet.has(allowed.to)) continue;
        missingControls.push(c);
      }

      if (missingTexts.length > 0 || missingImgs.length > 0 || missingLinks.length > 0 || missingControls.length > 0) {
        const report = [
          `FAILED CONTENT PARITY FOR ${slug}:`,
          missingTexts.length > 0 ? `Missing texts (${missingTexts.length}):\n  ${missingTexts.slice(0, 20).join("\n  ")}` : "",
          missingImgs.length > 0 ? `Missing images (${missingImgs.length}):\n  ${missingImgs.join("\n  ")}` : "",
          missingLinks.length > 0 ? `Missing links (${missingLinks.length}):\n  ${missingLinks.join("\n  ")}` : "",
          missingControls.length > 0 ? `Missing controls (${missingControls.length}):\n  ${missingControls.join("\n  ")}` : "",
        ].filter(Boolean).join("\n\n");
        console.error(report);
      }

      expect(missingTexts, `Missing texts in ${slug}`).toEqual([]);
      expect(missingImgs, `Missing images in ${slug}`).toEqual([]);
      expect(missingLinks, `Missing links in ${slug}`).toEqual([]);
      expect(missingControls, `Missing controls in ${slug}`).toEqual([]);
    });
  }
});
