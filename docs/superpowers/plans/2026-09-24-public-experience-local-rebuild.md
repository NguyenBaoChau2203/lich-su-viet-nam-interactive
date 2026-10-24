# Public Experience Local Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the public experience for the Vietnamese history interactive project across 5 working routes (`/`, `/kham-pha`, `/dong-thoi-gian`, `/dia-diem`, `/cau-chuyen/chien-dich-dien-bien-phu`) using Next.js 16 App Router, TypeScript, Tailwind CSS, resolving all content integrity, interaction, navigation, and accessibility issues from the Stitch mockups.

**Architecture:** Server Components by default with lean, accessible Client Component islands for interactive controls (reading size, explore filters/tabs, timeline scrubber, synchronized places map/list and view toggle, story tabs). Shared layout provides unified `PublicHeader`, `PublicFooter`, design tokens, and fallback fonts. Typed immutable sample data module serves all 5 routes with honest placeholders.

**Tech Stack:** Next.js 16.3.4 (App Router), React 19.2.8, TypeScript 5 (strict), Tailwind CSS 4, Vitest, Playwright.

**Spec:** `docs/design/stitch/DESIGN.md`, `docs/design/stitch/P01_P02_P08_INTEGRITY_FIX.md`, `docs/design/stitch/MAP_TIMELINE_FUNCTIONAL_PASS.md`, `docs/design/stitch/MAP_LIST_TOGGLE_FIX.md`.

## Global Constraints

- **Permitted sample years:** 1945, 1946, 1950, 1954, 1975 only.
- **Permitted story titles:** `Cách mạng tháng Tám`, `Toàn quốc kháng chiến`, `Chiến dịch Biên giới`, `Chiến dịch Điện Biên Phủ`, `Đại thắng mùa Xuân 1975`.
- **Permitted places:** `Hà Nội`, `Cao Bằng`, `Điện Biên Phủ`.
- **Allowed placeholder texts:** `TƯ LIỆU SẼ BỔ SUNG`, `VIDEO SẼ BỔ SUNG`, `ẢNH SẼ BỔ SUNG`, `ÂM THANH SẼ BỔ SUNG`, `TÓM TẮT ĐÃ KIỂM CHỨNG SẼ ĐƯỢC BỔ SUNG`, `NGUỒN ĐANG CẬP NHẬT`, `CHỜ THẨM ĐỊNH`, `NỘI DUNG ĐANG BIÊN TẬP`.
- **Banned identifiers & phrases:** `VN-MIL-01`, `QĐND-1994-T2`, `FR-SHD-09`, `ARCHIVE-VN12`, `ĐÃ KIỂM CHỨNG HỌC THUẬT`, `ĐÃ XÁC MINH NGUỒN TƯ LIỆU HỌC THUẬT`, `phiên bản lưu trữ số hóa quốc gia`, `hội đồng chuyên môn`, `hồ sơ lưu trữ chính thức`, `video tài liệu chính thức`, `chuẩn chương trình GDPT`.
- **No external media, synthetic AI history images, or unverified claims:** charcoal/warm-gray aspect-ratio placeholders only.
- **No primary dead links:** no `href="#"` on navigation or primary actions. Only Điện Biên Phủ has a live story detail route; other stories display `NỘI DUNG ĐANG BIÊN TẬP`.
- **No user account UI:** no avatars, login, register, favorites, or notifications in the public shell.
- **Design tokens:** `paper`: `#F1EEE6`, `paperRaised`: `#F8F6F0`, `ink`: `#121212`, `inkSoft`: `#56534D`, `hairline`: `#C8C2B8`, `vermilion`: `#B12B1E`, `mapInk`: `#233B45`.
- **Typography:** Source Serif 4, Be Vietnam Pro, IBM Plex Mono with solid system font fallbacks.

---

### Task 1: Design Tokens, Typography, and Shared Shell (PublicHeader & PublicFooter)

**Files:**
- Create: `src/components/shell/PublicHeader.tsx`
- Create: `src/components/shell/PublicFooter.tsx`
- Create: `src/components/shell/ReadingSizeControl.tsx`
- Create: `src/components/shell/SkipLink.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Test: `src/components/shell/PublicHeader.test.tsx`

**Interfaces:**
- `PublicHeader`: React Server Component rendering wordmark `LỊCH SỬ VIỆT NAM` linking to `/`, nav links (`/kham-pha`, `/dong-thoi-gian`, `/dia-diem`), search button linking to `/kham-pha`, and `ReadingSizeControl`.
- `PublicFooter`: React Server Component with exact required copy and non-broken informational footer items.
- `ReadingSizeControl`: Client island toggling html font scale (`text-base` vs `text-lg` or CSS class) with clear accessible aria attributes.

- [ ] **Step 1: Write the failing tests for shell components**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Update `globals.css` with exact color tokens, fonts, and clean focus styles**
- [ ] **Step 4: Implement `SkipLink`, `ReadingSizeControl`, `PublicHeader`, `PublicFooter`, and update `layout.tsx`**
- [ ] **Step 5: Run tests and verify they pass**

---

### Task 2: Immutable Typed History Sample Data Module

**Files:**
- Create: `src/features/history/types.ts`
- Create: `src/features/history/data.ts`
- Test: `src/features/history/data.test.ts`

**Interfaces:**
- `HistoryStorySummary`:
  ```ts
  export type SampleYear = 1945 | 1946 | 1950 | 1954 | 1975;
  export type SamplePlace = "Hà Nội" | "Cao Bằng" | "Điện Biên Phủ";
  export type SampleTopic = "Cách mạng và giành độc lập" | "Kháng chiến chống thực dân Pháp" | "Thống nhất đất nước";
  export type ContentStatus = "draft" | "pending_review" | "published";
  export type PlannedMediaKind = "video" | "audio" | "visual";

  export interface HistoryStorySummary {
    id: string;
    slug: string;
    title: string;
    year: SampleYear;
    era: "1945-1954" | "1954-1975";
    topic: SampleTopic;
    place: SamplePlace;
    plannedMediaKind: PlannedMediaKind;
    status: ContentStatus;
    hasDetailRoute: boolean;
    detailUrl?: string;
    summaryPlaceholder: string;
    mediaPlaceholder: string;
    sourceStatus: string;
    reviewStatus: string;
  }
  ```
- Strict assertions that no item is `published` or `verified`, and no banned strings exist.

- [ ] **Step 1: Write failing data integrity tests**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement `types.ts` and `data.ts` with the 5 approved sample stories**
- [ ] **Step 4: Run tests and verify they pass**

---

### Task 3: P01 Home Page (`/`) Rebuild

**Files:**
- Create: `src/components/media/MediaPlaceholder.tsx`
- Create: `src/features/home/HeroStoryStage.tsx`
- Create: `src/features/home/DiscoveryPaths.tsx`
- Create: `src/features/home/RecentStoryRows.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/page.test.tsx`
- Test: `src/app/page.test.tsx`

**Requirements:**
- Eyebrow: `CÂU CHUYỆN ĐƯỢC CHỌN · 1954`
- H1: `Chiến dịch Điện Biên Phủ`
- 16:9 media placeholder: `VIDEO SẼ BỔ SUNG`
- Copy: `TÓM TẮT ĐÃ KIỂM CHỨNG SẼ ĐƯỢC BỔ SUNG`
- CTA `Xem câu chuyện` linking to `/cau-chuyen/chien-dich-dien-bien-phu`
- Secondary status `NGUỒN ĐANG CẬP NHẬT`
- Indicator `01 / 05` with note `CÂU CHUYỆN MẪU`
- 3 distinct discovery sections: `Theo chủ đề`, `Theo thời gian` (links to `/dong-thoi-gian`), `Theo địa điểm` (links to `/dia-diem`)
- Section `Mới được biên tập` using `StoryRow` layout. Only Điện Biên Phủ has live link; others display `NỘI DUNG ĐANG BIÊN TẬP`.

- [ ] **Step 1: Write updated tests for Home page matching new H1 and components**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement Home page components with semantic HTML and exact copy**
- [ ] **Step 4: Run tests and verify they pass**

---

### Task 4: P02 Explore Page (`/kham-pha`)

**Files:**
- Create: `src/features/explore/ExploreExplorer.tsx`
- Create: `src/app/kham-pha/page.tsx`
- Test: `src/features/explore/ExploreExplorer.test.tsx`

**Requirements:**
- H1: `Khám phá câu chuyện`
- 3 modes: `Chủ đề`, `Thời gian`, `Địa điểm` with full tab semantics (`role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, roving `tabIndex`, ArrowLeft/ArrowRight/Home/End)
- Filter controls: keyword input (diacritic/case-insensitive), era (`1945-1954`, `1954-1975`), topic, planned media format, place
- Results displayed as alternating editorial rows (featured story on top), not generic card grids
- Live count with `KẾT QUẢ MẪU` and `aria-live="polite"`
- Empty state: `Không có câu chuyện mẫu phù hợp` with working `Xóa bộ lọc` button
- Synchronize state with URL search params (`q`, `mode`, `era`, `topic`, `media`, `place`) and restore on reload/back/forward
- Wrap client search params hook in React `<Suspense>` boundary
- Only Điện Biên Phủ links to detail route; others show editorial placeholder state

- [ ] **Step 1: Write comprehensive tests for Explore filtering, tab keyboard nav, URL synchronization, and reset**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement `ExploreExplorer` and `src/app/kham-pha/page.tsx`**
- [ ] **Step 4: Run tests and verify they pass**

---

### Task 5: P04 Timeline Page (`/dong-thoi-gian`)

**Files:**
- Create: `src/features/timeline/TimelineScrubber.tsx`
- Create: `src/features/timeline/TimelineExplorer.tsx`
- Create: `src/app/dong-thoi-gian/page.tsx`
- Test: `src/features/timeline/TimelineExplorer.test.tsx`

**Requirements:**
- Real `<input type="range">` mapped to discrete positions 0..4 corresponding to 1945, 1946, 1950, 1954, 1975
- Initial default: 1954 (`index 3`)
- Label: `Đang xem: 1954`
- Previous-year (`← Năm trước`) and Next-year (`Năm sau →`) buttons
- Native ArrowLeft/ArrowRight keyboard support through range input
- Clicking or focusing a story row updates range and focused story
- Focused story stage updates: active year, title, neutral media placeholder, and locator label (`Điện Biên Phủ`, `Hà Nội`, or `Cao Bằng`)
- Instructions: `Kéo hoặc dùng phím mũi tên để đổi năm`
- Era and planned media filters (`Chỉ hiện câu chuyện có video dự kiến`, `Chủ đề`)
- Story detail link active only for Điện Biên Phủ

- [ ] **Step 1: Write tests for timeline scrubber index mapping, prev/next, row selection, and keyboard events**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement `TimelineExplorer` and `src/app/dong-thoi-gian/page.tsx`**
- [ ] **Step 4: Run tests and verify they pass**

---

### Task 6: P05 Places Page (`/dia-diem`)

**Files:**
- Create: `src/features/places/PlaceMapSvg.tsx`
- Create: `src/features/places/PlaceExplorer.tsx`
- Create: `src/app/dia-diem/page.tsx`
- Test: `src/features/places/PlaceExplorer.test.tsx`

**Requirements:**
- Desktop 7 columns map + 5 columns synchronized list split view
- Schematic map of Vietnam labeled `SƠ ĐỒ MINH HỌA`
- 3 markers: Hà Nội, Cao Bằng, Điện Biên Phủ (Điện Biên Phủ selected by default)
- Two real range controls for start year (1945-1975) and end year (1945-1975) with enforced `start <= end` constraint
- Markers have `role="button"`, accessible label, `tabIndex={0}`, Enter and Space key activation
- Marker and list rows synchronize bidirectionally
- Map zoom in, zoom out, reset view controls applying visual transform within safe bounds
- Real toggle between `Bản đồ` and `Danh sách văn bản` (`aria-expanded`, focus management to heading, preserves state)
- Offline / map failure fallback state with usable text list
- No tactical routes, fictional coordinates, or boundaries

- [ ] **Step 1: Write tests for range constraint (start <= end), marker/list two-way sync, view toggle focus management, and zoom limits**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement `PlaceMapSvg`, `PlaceExplorer`, and `src/app/dia-diem/page.tsx`**
- [ ] **Step 4: Run tests and verify they pass**

---

### Task 7: P08 Story Page (`/cau-chuyen/chien-dich-dien-bien-phu`)

**Files:**
- Create: `src/features/story/CinemaBand.tsx`
- Create: `src/features/story/StoryTabs.tsx`
- Create: `src/app/cau-chuyen/chien-dich-dien-bien-phu/page.tsx`
- Test: `src/features/story/StoryTabs.test.tsx`

**Requirements:**
- Cinema band in `#121212` ink background with H1 `Chiến dịch Điện Biên Phủ`, year `1954`, status `NỘI DUNG ĐANG BIÊN TẬP`
- Video placeholder `VIDEO SẼ BỔ SUNG`, duration `--:-- / --:--`
- 5 chapter placeholders: `CHƯƠNG 01 · TIÊU ĐỀ SẼ BỔ SUNG` to `CHƯƠNG 05 · TIÊU ĐỀ SẼ BỔ SUNG`
- 5 working accessible tabs:
  1. `Tóm tắt`: `TÓM TẮT ĐÃ KIỂM CHỨNG SẼ ĐƯỢC BỔ SUNG` and 3 slots `LUẬN ĐIỂM ĐANG BIÊN TẬP`
  2. `Hình ảnh`: `ẢNH SẼ BỔ SUNG`
  3. `Chuyện bên lề`: `LỜI KỂ NHÂN CHỨNG SẼ BỔ SUNG` (with note: "Đây là lời kể cá nhân; các dữ kiện khách quan được kiểm chứng riêng.")
  4. `Bản chép lời`: `BẢN CHÉP LỜI SẼ BỔ SUNG`
  5. `Nguồn`: structured empty fields: `Tài liệu`, `Tác giả hoặc cơ quan`, `Liên kết hoặc ký hiệu lưu trữ`, `Phạm vi được nguồn hỗ trợ`, `Ngày truy cập`, with `NGUỒN ĐANG CẬP NHẬT` and `CHỜ THẨM ĐỊNH`
- Tab keyboard navigation: ArrowLeft/ArrowRight, Home, End, `aria-selected`, `aria-controls`, `aria-labelledby`, roving `tabIndex`
- Schematic place context labeled `Điện Biên Phủ` and `SƠ ĐỒ VỊ TRÍ ĐANG BIÊN TẬP`, with links to `/dia-diem` and `/dong-thoi-gian`
- No banned claims or fake institutions

- [ ] **Step 1: Write tests for story tabs mouse click, keyboard navigation (Left/Right/Home/End), and ARIA attributes**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement `CinemaBand`, `StoryTabs`, and `src/app/cau-chuyen/chien-dich-dien-bien-phu/page.tsx`**
- [ ] **Step 4: Run tests and verify they pass**

---

### Task 8: Content Integrity Audit & Comprehensive E2E Tests

**Files:**
- Create: `tests/content-integrity.test.ts`
- Modify: `tests/e2e/home.spec.ts`
- Create: `tests/e2e/public-routes.spec.ts`

**Requirements:**
- Automated audit test scanning all files under `src/` to guarantee no banned tokens, no primary `href="#"`, no unverified claims, and no unapproved sample years/places
- Playwright E2E testing all 5 routes at 320px, 768px, 1024px, and 1440px with zero console errors
- Screenshots saved to `.codex-tmp/screenshots/` for visual verification (untracked)

- [ ] **Step 1: Implement `tests/content-integrity.test.ts` and verify it runs with Vitest**
- [ ] **Step 2: Implement `tests/e2e/public-routes.spec.ts` covering all 5 routes, viewports, and primary flows**
- [ ] **Step 3: Run Vitest and Playwright to verify all tests pass**

---

### Task 9: Quality Gates and Final Verification

**Verification Checklist:**
- [ ] Run `pnpm lint` — ESLint passes with zero errors
- [ ] Run `pnpm typecheck` — TypeScript strict typecheck passes
- [ ] Run `pnpm test` — Vitest and agent tests pass
- [ ] Run `pnpm test:e2e` — Playwright smoke tests pass on all 5 routes
- [ ] Run `pnpm build` — Next.js production build succeeds
- [ ] Run `pnpm agent:check` — Agent validation succeeds
- [ ] Run `pnpm verify` — Combined quality gate passes cleanly
- [ ] Check `git status` — Word files and secret files untracked and untouched

---
