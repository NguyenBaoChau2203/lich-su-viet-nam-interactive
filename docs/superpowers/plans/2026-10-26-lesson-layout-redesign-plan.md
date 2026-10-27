# Lesson page layout redesign (Điện Biên Phủ + Chiến dịch Hồ Chí Minh) — implementation plan

> **Tóm tắt cho chủ dự án (tiếng Việt):** Kế hoạch sắp xếp lại bố cục trang chuyên đề tương tác `/bai-hoc/chien-dich-dien-bien-phu` và `/bai-hoc/chien-dich-ho-chi-minh-1975` cho gọn, cân đối, hết khoảng trống thừa. **Không bỏ bất kỳ chữ, ảnh, video, nút, liên kết, ghi công, điểm chú thích hay chức năng nào.** Điều này được ép bằng một bài test tự động: chụp lại “toàn bộ nội dung” trước khi sửa và so sánh sau khi sửa; thiếu một mục là test đỏ. Hai trang dùng chung một khuôn (`components/lesson/*`), nên 4 chuyên đề còn lại cũng được hưởng bố cục mới. Kế hoạch đã kiểm tra để chúng không hỏng. Viết bằng tiếng Anh theo `AGENTS.md`; chữ hiển thị giữ tiếng Việt. Giao nguyên file cho Antigravity (Gemini 3.8 High), yêu cầu làm **từng Phase, dừng ở cuối mỗi Phase**.

---

## 0. Read this first (agent)

You are one coding agent working in `D:\Lich_su_new\lich-su-viet-nam-interactive` (Windows, PowerShell, Node 24, pnpm 11.7.0). Do not spawn subagents or other AI processes. Do not push, merge, open PRs, deploy or write to Supabase. Local commits only.

**Mission (one sentence):** Re-layout the shared interactive-lesson page so that both lessons read as a tidy, balanced, editorial history page at desktop sizes, with no unintended empty areas and no clipped or overflowing content. **Every piece of content and every function that exists today must still exist afterwards.**

**The non-negotiable rule: zero content loss.** All of the following must still be rendered and reachable after the redesign:

- Every text string, image, video, link, button, credit, licence line and hotspot.
- Every tab, gallery item, step, fact, flip-card face, editor note and CTA.

You may move, regroup, resize, restyle and re-order things *within the same chapter*. You may not delete, shorten, truncate with ellipsis, hide behind a new click that did not exist before, or rewrite any user-facing copy. The only allowed copy changes are the two listed in Section 6.5 (wrong hard-coded labels), and only after the owner approves them. The content parity test in Phase 0 enforces this.

Work **one Phase at a time**. Each Phase ends with a **STOP** gate:

1. Run the listed checks.
2. Commit locally.
3. Append to the progress file.
4. Write `.task-reports/YYYY-MM-DD-HHmm-lesson-layout-phase-N.md` (ignored; never stage it).
5. Stop and report to the owner in Vietnamese, with screenshots.

### 0.1 Read before Phase 0

1. `AGENTS.md`, `CLAUDE.md`, `.agents/rules/project.md`, `docs/product/DESKTOP-UI-SCOPE.md`, `docs/huong-dan-giao-dien.md` (house UI guide).
2. Skills in `.agents/skills/`. Use `design-history-story` (layout and story) and `verify-release-slice` (STOP gates). If any 3D, UI or design skills were added locally, read them too.
3. Read every file you will touch **completely** before editing:
   - Lesson shell: `components/lesson/LessonView.tsx`, `components/lesson/ChapterShell.tsx`.
   - Sections: `components/lesson/sections/*.tsx` (all ten files).
   - Lesson widgets: `components/lesson/FlipCard.tsx`, `components/lesson/VideoEmbed.tsx`, `components/lesson/CountUp.tsx`.
   - Battle map: `components/mapfilm/BattleMapSection.tsx`, `components/battle/BattleReenactment.tsx`, `components/battle/MapLegend.tsx`.
   - 3D media: `components/photo3d/DepthPhotoGallery.tsx`, `components/photo3d/ScanViewer.tsx`, `components/model3d/ModelGallery.tsx`, `components/model3d/ModelViewer.tsx` (layout parts only).
   - UI and nav: `components/ui/Tabs.tsx`, `components/ui/Callout.tsx`, `components/ui/Card.tsx`, `components/sgk/SectionNav.tsx`.
   - Styles and types: the lesson/flip/battle blocks of `app/globals.css`, `lib/lessons/types.ts`.
4. Tests that constrain you:
   - E2E: `tests/e2e/lesson.spec.ts`, `tests/e2e/photo3d.spec.ts`, `tests/e2e/models3d.spec.ts`, `tests/e2e/presentation.spec.ts`, `tests/e2e/a11y.spec.ts`, `tests/e2e/ui-v2.spec.ts`, `tests/e2e/battle.spec.ts`, `tests/e2e/mapfilm.spec.ts`.
   - Unit: `tests/unit/lesson-data.test.ts`.
   - These tests use these selectors and names, so you must keep them working:
     - roles: `navigation "Các bước diễn biến"`, `list "Số liệu chính"`, `button.flip-card`;
     - `section[aria-labelledby=ghi-nho]` and `[data-resource="…"]`;
     - test ids: `photo3d-tab`, `photo3d-stage`, `photo3d-text`, `exhibit-mode-photo`, `exhibit-mode-scan`, `scan-stage`, `scan-start`, `scan-iframe`, `model-tab`, `map-mode-2d`, `map-mode-3d`;
     - the button name pattern `Phát video: …`;
     - the heading ids `dien-bien`, `ket-qua`, `nhan-vat`, `tu-lieu`, `ghi-nho`, `nguon`, `moc-thoi-gian`.
5. The Next.js 16 docs in `node_modules/next/dist/docs/` if you touch routing or `dynamic()` (you should not need to).

### 0.2 Scope

**In scope:** layout, spacing, sizing, alignment, grouping and visual styling of `/bai-hoc/[slug]` at the four desktop viewports 1280×720, 1366×768, 1440×900 and 1920×1080, in light and dark theme.

**Shared impact (must not break):**
- The other four lessons: `/bai-hoc/cach-mang-thang-tam-1945`, `/bai-hoc/duong-truong-son`, `/bai-hoc/tet-mau-than-1968`, `/bai-hoc/dien-bien-phu-tren-khong-1972`.
- Pages that reuse the same components:
  - `/tai-hien/bach-dang-938` (`BattleReenactment`);
  - `/trac-nghiem/the-ghi-nho` (`FlipCard`);
  - `/ban-do-3d/*` (`MapFilmPlayer`);
  - `/mo-hinh-3d/*` (`ModelViewer`);
  - `/kham-pha`;
  - the teacher slideshow `/bai-hoc/[slug]/trinh-chieu`.

**Out of scope:**
- Lesson data in `lib/lessons/*.ts`, `lib/battles/*.ts`, `lib/mapfilm/*.ts`, `lib/models3d/*.ts`, except the optional label fields in 6.5.
- 3D engines and renderers.
- Mobile and tablet design: keep the existing responsive classes working, but they are not acceptance gates.
- The homepage globe, the database, and new dependencies.

---

## 1. Verified starting state: problems observed

Evidence comes from Gemini’s own 1440×900 screenshots in `.task-reports/hcm1975-baseline/` (DBP) and `.task-reports/hcm1975-final/` (HCM), plus source reading on 2026-10-26.

| # | Where | Problem | Root cause in code |
|---|---|---|---|
| P1 | Whole page | The content column is only about 864 px wide on a 1440 px screen, leaving wide empty margins. Inside it, every block is narrower still (`max-w-3xl` paragraphs and callouts), so edges never line up. | `LessonView` uses `max-w-6xl` (1152 px) minus a 200 px sidebar and a 40 px gap. `BattleSection` callout uses `max-w-3xl`. Intro paragraphs use `max-w-3xl`. |
| P2 | Whole page | Very large vertical gaps (64 px between every block plus 64 px between chapters). Chapters do not read as chapters. | `ChapterShell` sets `gap-16` both between chapters and inside each chapter. There is no chapter divider. |
| P3 | Hero | Stats are three glass cards limited to `max-w-3xl`, so the right 40 % of the hero is empty. The photo credit sits on the same row as the CTA buttons and wraps awkwardly. Tall hero. | `LessonHero`: stats `ul.max-w-3xl`, credit inside the button flex row, `min-h-[34rem]`. |
| P4 | Mốc thời gian | 10 HCM dates on a 4-column grid leave 2 empty slots on the last row. Card heights differ within a row. GoalBox is a long single-column list on the full width. | `KeyDates`: `lg:grid-cols-4` regardless of count. `GoalBox`: single `ul`. |
| P5 | Diễn biến (2D map) | **Largest gap.** The left column (map 480 px plus controls) is far shorter than the right column (caption, fact, image and seven step buttons). This leaves a blank area of roughly 400–600 px under the map. The map scrolls away while the student reads the steps. | `BattleReenactment`: `grid lg:grid-cols-[1.6fr_1fr]`; map `sm:h-[30rem]`; the left column is not sticky; step buttons have generous padding. |
| P6 | Diễn biến | The “Lưu ý: bản đồ minh họa” callout is narrower than the map (`max-w-3xl`). The 2D/3D toggle and “Cách dùng bản đồ” are stacked as two loose rows. | `BattleSection`, `BattleMapSection`. |
| P7 | Kết quả | Three stat cards, four significance cards and the quote are all separate boxes, which looks like a dashboard (`AGENTS.md` asks to avoid dashboard or card-template looks). | `ResultsSection`. |
| P8 | Nhân vật | Fixed-height flip cards (`h-72`) **clip text**: on the DBP De Castries card, “Bấm để lật” is cut off. “Xem trang nhân vật” links and photo credits hang under some cards only, giving ragged rows. | `FiguresSection` (`FlipCard className="h-72"`), credit and link outside the card. |
| P9 | Tư liệu → Phim tư liệu | The main video sits on the left (about 500 px tall). Three or two other videos are stacked on the right, so a large blank area appears under the main video. | `ResourceSection` video tab: `grid lg:grid-cols-[1.5fr_1fr]`. |
| P10 | Tư liệu → galleries (Hiện vật, Sa bàn 3D, Di tích ngày nay, Mô hình 3D) | Item pills are a single horizontal scrolling row; the last pills are cut off (“Máy bay phản lực A…”, “Sân thượng Dinh Độc L…”) with no visible affordance. The viewer is very tall (`max-h-[70vh]`) while the description, hotspot chips and credits are pushed far below it. Portrait photos leave white bands on both sides of the stage. | `DepthPhotoGallery` (pills `overflow-x-auto`, stage `max-h-[70vh]`, details below), `ModelGallery` (same pill row). |
| P11 | Tư liệu | Repeated wordy headers: the section heading and intro, then an H3 and another intro per tab, then gallery instructions. | `ResourceSection`. |
| P12 | Ôn tập | Flashcards have a fixed `h-52`, which risks clipping long answers. 8 HCM cards on 3 columns leave 1 empty slot. The “Làm trắc nghiệm” CTA wraps to two lines. | `ReviewSection`. |
| P13 | Nguồn | A narrow single list under a top border; the action buttons float. Acceptable, but inconsistent with the new rhythm. | `SourcesSection`. |
| P14 | Sa bàn 3D tab (HCM) | The hard-coded pill label “Sa bàn lòng chảo” and the copy “Xoay sa bàn địa hình thật 360°…” describe Điện Biên Phủ, not the HCM scan (Dinh Độc Lập). These are content defects, not layout defects. See 6.5. | `ResourceSection` (`exhibitItem({ title: "Sa bàn lòng chảo", … })`). |

---

## 2. Design direction

**Concept: “trang sách lịch sử được dàn trang” (an edited history book spread), not a dashboard.**

- **One wide content column** with a sticky chapter index on the left. Blocks align to a 12-column grid inside the content column, and all blocks share the same left and right edges.
- **Chapters are clearly marked:** a thin rule plus a small numbered chapter label above each chapter heading, for example `CHƯƠNG 2 · DIỄN BIẾN TRÊN BẢN ĐỒ`.
- **Fewer boxes.** Use rules, dividers, numbers and typography instead of card borders wherever a card adds nothing.
  - Keep cards only for interactive objects (flip cards, step buttons, galleries) and the map.
  - Use the existing tokens (`--accent`, `gold`, `gold-deep`, `muted`, `surface`, `border`, the `font-serif` Lora headings). No new colours, gradients, shadows or fonts.
- **Media-first panes** for the map and the galleries. The visual stays in view while text and controls sit beside it, so both sides of a pane have similar heights and no column hangs empty.
- **Balanced grids.** Choose a column count from the number of items so that no row is half empty (Section 3.3).
- **No clipping, ever.** No fixed heights on text containers, no `truncate` or line-clamp on content, no hidden horizontal scroll for item lists.

---

## 3. Layout specification (desktop)

### 3.1 Page frame and grid

| Token | Value | Applies to |
|---|---|---|
| Page container | `mx-auto max-w-[80rem] px-6 xl:px-8` (1280 px) | breadcrumb row, hero inner container, lesson body |
| Body grid (lg and up) | `grid-cols-[13.5rem_minmax(0,1fr)] gap-10 xl:grid-cols-[14.5rem_minmax(0,1fr)] xl:gap-14` | `ChapterShell` |
| Expected content width | about 980 px at 1440, about 1010 px at 1920 (container capped), about 950 px at 1280 | — |
| Reading measure | Long prose paragraphs keep `max-w-[70ch]`, but blocks (maps, grids, galleries, callouts) use the full content width | `SectionIntro`, captions |
| Chapter spacing | `gap-20` (80 px) between chapters | `ChapterShell` |
| In-chapter spacing | `gap-12` (48 px) between sections inside a chapter; `mb-6` under headings; `mb-5` under intros | `ChapterShell`, `SectionHeading`, `SectionIntro` |

### 3.2 New shared primitives (`components/lesson/sections/shared.tsx`)

- `ChapterLabel({ index, title })` renders `CHƯƠNG {index} · {TITLE}`.
  - Style: small caps (`text-xs font-semibold uppercase tracking-[0.14em] text-gold-deep`), preceded by a 32 px gold rule.
  - `ChapterShell` renders it above each chapter’s content, except the first chapter if it would duplicate the hero.
  - Mark it `aria-hidden="true"`: it is decorative because headings already exist.
- `SectionIntro({ children })` replaces the repeated `-mt-3 mb-5 max-w-3xl text-muted-foreground` paragraphs. Keep the same text exactly.
- Keep `SectionHeading` (eyebrow plus H2). Its eyebrow stays as is.

### 3.3 Balanced column helper (`lib/lessons/layout.ts`, pure, unit-tested)

```ts
/** Number of columns (within [min, max]) that leaves the fewest empty slots in the last row; ties → more columns. */
export function balancedColumns(count: number, min = 2, max = 5): number {
  if (count <= min) return Math.max(1, count);
  let best = max, bestEmpty = Infinity;
  for (let c = max; c >= min; c--) {
    const empty = (c - (count % c)) % c;
    if (empty < bestEmpty) { best = c; bestEmpty = empty; }
  }
  return best;
}
```

Expected results, which the unit tests in `tests/unit/lesson-layout.test.ts` must cover:

| count | columns | count | columns |
|---|---|---|---|
| 2 | 2 | 7 | 4 (1 empty, unavoidable) |
| 3 | 3 | 8 | 4 |
| 4 | 4 | 9 | 3 |
| 5 | 5 | 10 | 5 |
| 6 | 3 | 12 | 4 |

Map the number to a static Tailwind class through a lookup object, not by string interpolation, so Tailwind can see it:

```ts
const COLS = { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5" } as const;
```

Keep `sm:grid-cols-2` as the small-screen fallback.

---

## 4. Section-by-section target layout (1440×900 reference)

ASCII wireframes are proportional sketches; `│` marks the content column edges.

### 4.1 Hero (`LessonHero.tsx`)

```
┌──────────────────────────── full-bleed photo (Ken Burns kept) ─────────────────────────────┐
│ [Chuyên đề tương tác] Thuộc Bài 8 · mục 3 — quay về bài                                    │
│ Chiến dịch Hồ Chí Minh                                    ┌──────────────────────────────┐ │
│ 26 – 30/4/1975                                            │ 5   cánh quân đồng loạt …    │ │
│ Năm cánh quân thần tốc … (tagline, ≤ 60ch)                │ ──────────────────────────── │ │
│                                                           │ 3   chiến dịch lớn …         │ │
│ [Bắt đầu học ↓]  [Trình chiếu trên lớp]                   │ ──────────────────────────── │ │
│                                                           │ 21  năm kháng chiến …        │ │
│                                                           └──────────────────────────────┘ │
│ Ảnh: <caption> <credit link>          (own row, bottom-left, text-xs, max 2 lines)          │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

- Inner grid: `lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-12`, using the page container from 3.1.
- **Stats** move to the right column as a vertical list, one row per stat.
  - Each row: `grid grid-cols-[auto_1fr] items-baseline gap-4 py-4` with `border-t border-white/20` (no top border on the first row).
  - Number: `font-serif text-5xl font-bold`.
  - Label: `text-base text-white/85`.
  - Keep the `<ul aria-label="Số liệu chính">` exactly (an e2e test reads it). Keep `CountUp` and `suffix`.
- **Credit** moves out of the CTA flex row into its own `<p>` at the bottom of the left column (`mt-6 text-xs text-white/70 max-w-[70ch]`). The text and link are unchanged.
- Height: `min-h-[min(80vh,38rem)]` at lg, with content bottom-aligned. At 1280×720 the CTA buttons must be visible without scrolling. Check this.
- Keep the tagline `max-w-2xl`, the badge, the SGK link, `fetchPriority="high"` and the gradient overlay. Contrast of white text over the image must stay ≥ 4.5:1; verify on the HCM hero, which has a busy tree background. If it fails, strengthen the existing gradient (`via-black/70`). Do not add a new box.

### 4.2 Chương 1 — Mở đầu và mốc thời gian (`GoalBox.tsx`, `KeyDates.tsx`)

```
│ CHƯƠNG 1 · MỞ ĐẦU VÀ MỐC THỜI GIAN                                                          │
│ ┌ Học xong chuyên đề này, em có thể… ─────────────────────────────────────────────────────┐ │
│ │ SGK Lịch sử 12 — … · Bài 8 …                                                            │ │
│ │ • objective 1                              • objective 3                                │ │
│ │ • objective 2                              • objective 4                                │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────┘ │
│ DÒNG THỜI GIAN / Những mốc cần nhớ                                                          │
│ ●───────────●───────────●───────────●───────────●        (row 1, 5 columns for 10 items)    │
│ 10/3/1975   26/3/1975   29/3/1975   14/4/1975   21/4/1975                                   │
│ text…       text…       text…       text…       text…                                       │
│ ●───────────●───────────●───────────●───────────●        (row 2)                            │
```

- **GoalBox:** keep the `Callout variant="goal"` and its title. Objectives `ul` becomes `lg:grid lg:grid-cols-2 lg:gap-x-10 gap-y-1.5`, but only when there are 4 or more objectives; otherwise keep a single column. Keep the list markers (`list-disc pl-5` per column).
- **KeyDates:** replace card boxes with a timeline track. Keep `<ol class="lesson-timeline">` and `<li class="lesson-timeline__item">` so existing CSS hooks and print styles survive; restyle them in `globals.css`.
  - Columns: `balancedColumns(keyDates.length, 3, 5)`, giving 5 for 10 HCM dates and 4 for 8 DBP dates.
  - Each item: a 10 px accent dot on a 1 px `border` line across the row top (`::before` on the `ol` row is hard with CSS grid, so draw the line per item: `li::before` full-width 1 px line at the dot centre, `li::after` the dot); date in `font-serif text-lg font-bold text-accent`; text `text-sm text-surface-foreground`.
  - No card border or background. Row gap `gap-y-8`, column gap `gap-x-6`.
  - All items in a row share the top line, so heights may differ without looking ragged (the line aligns them).
- Both blocks use full content width.

### 4.3 Chương 2 — Diễn biến trên bản đồ (`BattleSection.tsx`, `BattleMapSection.tsx`, `BattleReenactment.tsx`)

```
│ CHƯƠNG 2 · DIỄN BIẾN TRÊN BẢN ĐỒ                                                            │
│ DIỄN BIẾN TRÊN BẢN ĐỒ / Xem năm cánh quân tiến vào Sài Gòn                                  │
│ Bấm Phát để … (intro, ≤70ch, unchanged text)                                               │
│ [● Bản đồ 2D | Bản đồ 3D như phim]  [Mở trang riêng ↗]              [? Cách dùng bản đồ]    │
│ ┌──────────────── map (sticky) ─────────────────┐ ┌──── step panel (380px) ─────────────┐   │
│ │                                               │ │ Bước 3/7 · 14 – 25/4/1975           │   │
│ │   Leaflet map   h = clamp(26rem, 64vh, 38rem) │ │ Năm cánh quân bao vây Sài Gòn       │   │
│ │                                   [Chú giải]  │ │ caption …                           │   │
│ └───────────────────────────────────────────────┘ │ [Bạn có biết?] / [step image]       │   │
│ [▶ Phát] [◀ Bước trước] [Bước sau ▶]   Bước 3/7   │ ─────────────────────────────────── │   │
│ ═════════════○═══════════════  (range)           │ ① Thời cơ chiến lược   3/1975       │   │
│                                                   │ ② Xuân Lộc …           9–21/4       │   │
│                                                   │ ③ … (compact rows)                  │   │
│                                                   └─────────────────────────────────────┘   │
│ ┌ ⚠ Lưu ý: bản đồ minh họa … (full width) ────────────────────────────────────────────────┐ │
```

**`BattleMapSection.tsx`:**
- Put the mode toggle (2D/3D pill group), the “Mở trang riêng để trình chiếu” link and the “Cách dùng bản đồ” button on **one row**: `flex flex-wrap items-center gap-3` with the help button pushed right (`ml-auto`).
- When the help list is open, it appears full width under that row (keep the same `<ol id="map-help">` text).
- When there is no film, keep the help button on its own row as now.

**`BattleReenactment.tsx`:**
- Grid becomes `lg:grid-cols-[minmax(0,1fr)_23.75rem] lg:items-start gap-6`.
- **Left column** (map, legend, controls, range, tide) becomes `lg:sticky lg:top-24`. This is the key fix for P5: while the student scrolls through the right panel, the map stays visible, so there is no dead space.
- Map box height: `h-[22rem] sm:h-[clamp(26rem,64vh,38rem)]` instead of the fixed `sm:h-[30rem]`.
  - The map must still fit the viewport at 1280×720 together with the controls: map plus controls plus range ≤ `100vh − 6rem`. Verify. If it does not fit, use `clamp(24rem, 58vh, 38rem)`.
  - Keep `ref={mapBoxRef}`, `role="region"` and the aria-label.
- **Right column:**
  - The step `Card` stays (caption, fact and image unchanged; image `max-h-56` stays).
  - The step list `nav[aria-label="Các bước diễn biến"]` keeps its buttons, but rows become compact: `p-2.5`, number circle `h-6 w-6`, title `text-sm font-medium`, date `text-xs` on the same line when it fits (`flex justify-between gap-3`, title left, date right, `text-right`). Use wrapping when it does not fit, **never truncation**.
  - Keep `aria-current="step"`.
- The whole component is also used by `/tai-hien/bach-dang-938`, so check that page at all four viewports, including the tide bar.

**`BattleSection.tsx`:**
- The warning `Callout` loses `max-w-3xl` and uses the full content width, `mt-6`.
- The intro paragraph becomes `SectionIntro` with exactly the same text, including the conditional 3D sentence.

**3D mode (`MapFilmPlayer`):** do not restyle the player internals; it already has its own `lg:grid-cols-[minmax(0,1fr)_17rem]`. Only ensure it spans the full content width and that nothing around it reserves blank height.

### 4.4 Chương 3 — Kết quả và ý nghĩa (`ResultsSection.tsx`)

```
│ KẾT QUẢ VÀ Ý NGHĨA / Vì sao chiến thắng mùa Xuân 1975 có ý nghĩa to lớn?                     │
│ ┌────────────────────────┬────────────────────────┬────────────────────────┐                │
│ │ 4                      │ 22                     │ 15                     │ (one band,     │
│ │ cánh quân cùng tiến …  │ năm chiến tranh …      │ năm kháng chiến …      │  rules between)│
│ └────────────────────────┴────────────────────────┴────────────────────────┘                │
│ 01 Kết thúc 21 năm …                     02 Hoàn thành cách mạng …                            │
│    text…                                    text…                                            │
│ 03 Mở ra kỷ nguyên mới …                 04 Cổ vũ mạnh mẽ …                                  │
│ ───────────────────────────── gold rule ─────────────────────────────                       │
│                        ❝ Tiến lên! Chiến sĩ, đồng bào, …                                    │
│                          — Chủ tịch Hồ Chí Minh, …                                          │
```

- **Results:**
  - One bordered band (`rounded-card border border-border bg-surface`) with `lg:grid-cols-{balancedColumns(results.length,2,4)}` and `divide-x divide-border`.
  - Each cell: `p-6 text-left`; number `font-serif text-5xl text-accent`; label `text-sm text-muted-foreground`.
  - Keep `CountUp` and `suffix`.
- **Significance:**
  - Remove card boxes. Use a `grid lg:grid-cols-2 gap-x-12 gap-y-8` with an ordinal marker `01…04` (`font-serif text-3xl text-gold`, `aria-hidden`) in a 3 rem left column.
  - Title as `h3` (unchanged text), body unchanged.
  - A count other than 4 must still balance; use `balancedColumns(n,1,2)`.
- **resultsImage without depth** (other lessons may use it): keep it as is, between the band and the significance grid.
- **Quote:** full-width pull quote between two `border-gold/50` rules, centred, `max-w-3xl` text inside. Keep `whitespace-pre-line`, the Quote icon and the author line.

### 4.5 Chương 4 — Nhân vật (`FiguresSection.tsx`, `FlipCard.tsx`)

- Grid: `lg:grid-cols-{balancedColumns(figures.length,2,5)}` (4 gives 4). Each `li` is `grid grid-rows-[1fr_auto] gap-2`.
- **FlipCard height fix (global, also used on `/trac-nghiem/the-ghi-nho` and in Ôn tập):**
  - Stack both faces in one CSS grid cell (`.flip-card__inner { display:grid } .flip-card__face { grid-area: 1/1 }`), so the card height is the taller face and nothing is clipped.
  - Remove fixed heights at call sites: `h-72` becomes `min-h-[18rem]` and `h-52` becomes `min-h-[13rem]`.
  - Keep the rotate animation, the reduced-motion swap, `aria-pressed`, `inert` and the “Bấm để lật” / “Bấm để lật lại” labels.
  - Verify the 3D flip still works with grid stacking (`transform-style: preserve-3d` on the inner, `backface-visibility:hidden` on the faces, back face pre-rotated).
- Portrait or initials block: fixed `aspect-[4/3]` instead of `h-36` so every card starts its text at the same y.
- **Below each card**, a footer `div` that always exists (empty if nothing) containing “Xem trang nhân vật →” and/or “Ảnh: credit”. This keeps rows aligned. Same texts and links.

### 4.6 Chương 5 — Tư liệu (`ResourceSection.tsx`, `VideoEmbed.tsx`, `DepthPhotoGallery.tsx`, `ScanViewer.tsx`, `ModelGallery.tsx`)

**Header:** keep the section heading “Xem tận mắt: phim, hiện vật và di tích” and its intro. Keep `Tabs` exactly (role, keyboard and lazy rendering), with the tab row full width.

**4.6.1 Video tab (fix P9)**

```
2 videos → 2 equal columns │ 3 videos → 3 equal columns │ 4 videos → 2 × 2
```

- `grid gap-x-6 gap-y-8 lg:grid-cols-{balancedColumns(videos.length,2,3)}`. All `VideoEmbed`s are the same size. The first keeps `priority` (eager thumbnail).
- Keep the H3 `copy.videoTitle` and the YouTube copyright note below the grid.
- `VideoEmbed` figcaption: title `font-semibold`, channel and note line, YouTube link. Unchanged, but use `grid grid-rows-[auto_1fr_auto]` so links align across columns.

**4.6.2 Gallery panes (Hiện vật, Sa bàn 3D, Di tích ngày nay, Mô hình 3D): fix P10**

```
┌──────────────────────── stage (2/3) ────────────────────────┐ ┌──── picker + details (1/3) ────┐
│                                                              │ │ ▸ [thumb] Lựu pháo 105 mm 360° │
│   photo3d stage / scan stage / model stage                   │ │   [thumb] Mũ nan Trần Can 360° │
│   (letterboxed on bg-black, max-h-[min(72vh,40rem)])         │ │   [thumb] Dép cao su      360° │
│                                                              │ │   … all items, wraps, no scroll│
│                                                              │ │ ────────────────────────────── │
└──────────────────────────────────────────────────────────────┘ │ Title of selected item         │
                                                                  │ text (exhibit text)            │
                                                                  │ ① Nòng pháo ② Lá chắn …        │
                                                                  │ [hotspot explanation panel]    │
                                                                  │ Ảnh: caption (credit)          │
                                                                  └────────────────────────────────┘
```

**Refactor `DepthPhotoGallery` into a two-pane layout at lg and above:**
- Grid: `lg:grid-cols-[minmax(0,1fr)_20rem] gap-6 items-start`.
- **Picker (right, top):**
  - The same `role="tablist"` with `aria-orientation="vertical"` at lg.
  - Each tab is a row `flex items-center gap-3 rounded-card border p-2 text-left`.
  - Thumbnail `h-12 w-16 object-cover rounded` uses `image.src`, or `scan.poster` for scan-only items (remote Sketchfab image, already allowed by CSP `img-src https:`).
  - Show the full title (wrap allowed) and the `360°` badge.
  - Keep `data-testid="photo3d-tab"`, ids, `aria-controls` and `aria-selected`. Keyboard: keep ArrowLeft and ArrowRight and **add** ArrowUp and ArrowDown, plus Home and End.
  - The list must not scroll horizontally. If there are more than 6 items, the picker may get `max-h-[min(40vh,22rem)] overflow-y-auto` with a visible scrollbar (vertical scroll of a list is fine; it is not hidden content). Prefer no scroll at 1440×900 for 8 items: row height about 64 px, so 8 × 64 = 512 px.
- **Details (right, under picker):** the exhibit mode toggle (“Xoay 360°” / “Ảnh chụp thật”), the exhibit text, the hotspot chips list, the hotspot text panel (`aria-live` kept) and the caption/credit line.
- **Stage (left):** only the visual: photo canvas, scan iframe or poster, zoom and fullscreen buttons.
  - The stage container gets `bg-black rounded-card` filling the column width, with the image or canvas centred inside (`object-contain` behaviour already handled by aspect ratio plus `maxWidth`). Portrait photos then sit on black, not on white page.
  - Height cap: `max-h-[min(72vh,40rem)]`.
- **Implementation detail:** `DepthPhotoStage` and `ExhibitPanel` currently render stage and details together.
  - Split them so each returns `{ stage, details }` slots, or so they accept a `layout="split"` prop and render into two children passed to the gallery grid.
  - Keep one component instance per item: switching items must still unmount the old WebGL or iframe, and only one heavy viewer is active.
  - Keep all `data-testid`s (`photo3d-stage`, `photo3d-text`, `exhibit-mode-photo`, `exhibit-mode-scan`, `scan-stage`, `scan-start`, `scan-iframe`).
  - Keep the full-screen behaviour (`frameRef`) working with the new structure.
- Below lg (out of scope but must not break): stack picker → stage → details; picker becomes a wrapping row (`flex-wrap`, not `overflow-x-auto`).

**`ScanViewer`:** match the stage height cap and the black letterbox. The “Xoay 360°” poster button and the size note stay inside the stage. The credit line (“Mô hình 3D: … — tác giả … Mở trang gốc”) moves to the details column.

**`ModelGallery`:** same pane pattern.
- Picker rows have no thumbnail: use the lucide `Box` icon, the title and the spec `summary` in `text-xs` (the summary is existing data; it may already appear on the start screen; showing it twice is fine).
- Keep `data-testid="model-tab"`, ids and roles.
- `ModelViewer` stays in the stage. Its hotspot chips, description note and illustration note (“Dựng minh họa…”) go to the details column if `ModelViewer` exposes them separately. If it does not, leave them under the viewer in the left column and **do not refactor `ModelViewer` internals** (record this in the progress file).

**Tab intros:** each tab keeps its H3 and intro paragraph unchanged, placed above the pane grid, using `SectionIntro` styling.

### 4.7 Chương 6 — Ôn tập (`ReviewSection.tsx`)

- Flashcards: `lg:grid-cols-{balancedColumns(flashcards.length,3,4)}` (8 gives 4, 6 gives 3, 7 gives 4 with one empty slot, acceptable). Use `min-h-[13rem]` with the FlipCard grid fix.
- Quiz CTA band: `flex items-center justify-between gap-6`; the button gets `shrink-0 whitespace-nowrap`. The paragraph text and the Hộ chiếu link stay unchanged.
- Keep `LessonStudiedMarker` where it is (it marks progress when this section is reached).

### 4.8 Chương 7 — Nguồn tham khảo (`SourcesSection.tsx`)

- Keep the heading, list, `EditorNotes` and buttons.
- At lg: `grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-10`.
  - Left: the sources list.
  - Right: an “Đi tiếp” box with the two existing buttons (“Xem trang sự kiện …”, “Về Bài N”) stacked full width.
  - `EditorNotes` stays under the list.
- The top rule stays.

### 4.9 Chapter shell (`ChapterShell.tsx`, `LessonView.tsx`)

- `LessonView`: breadcrumb row and body use the page container (3.1). The `article` wrapper is unchanged.
- `ChapterShell` desktop:
  - Use the body grid from 3.1, `flex flex-col gap-20` between chapters, and `ChapterLabel` before each chapter.
  - Inner content `flex flex-col gap-12`.
  - Keep the mobile chapter switcher, `data-chapter`, the anchors `chuong-*`, the `hidden lg:block print:block` logic and all hash handling **untouched**.
- `SectionNav` desktop: keep sticky (`top-24`); width follows the new 13.5–14.5 rem column. No content changes.

### 4.10 Dark theme and motion

- Every change must work under `data-theme="dark"`, using tokens only.
- Respect `prefers-reduced-motion`: Ken Burns, lesson-rise, flip and CountUp behave as today; sticky is not motion.
- Visible focus rings (`outline-gold`) on every new interactive element (picker rows, help button).

---

## 5. Safety net: content parity test (built in Phase 0, run in every Phase)

Create `tests/e2e/lesson-content-parity.spec.ts`, plus fixtures in `tests/e2e/fixtures/lesson-inventory/`.

**What it collects, for each of the 6 lessons at 1440×900 with `reducedMotion: "reduce"`:**

1. Open `/bai-hoc/<slug>` and wait for `networkidle`.
2. For **every** `role=tab` in the tablist `"Loại tư liệu"`, click it. Inside the opened panel:
   - click every `photo3d-tab` and `model-tab`;
   - for exhibits with both modes, click `exhibit-mode-photo` and `exhibit-mode-scan`;
   - click every hotspot chip (`list "Các chi tiết…"` buttons) so the hotspot texts render;
   - after each click, collect.
3. For every button in `navigation "Các bước diễn biến"`, click it, wait 1.2 s (step animation) and collect.
4. Click the “Cách dùng bản đồ” button once (opens help) and collect.
5. Do not start videos, WebGL or iframes (do not click `scan-start`, “Xem mô hình 3D”, “Xem ảnh 3D” or “Phát video”).

**What “collect” means** (run in the page, scoped to `main`):

```js
() => {
  const root = document.querySelector("main");
  const texts = new Set(), imgs = new Set(), links = new Set(), controls = new Set();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const p = n.parentElement;
    if (!p || p.closest("script,style,noscript")) continue;
    const t = n.textContent.replace(/\s+/g, " ").trim();
    if (t.length > 1) texts.add(t);
  }
  root.querySelectorAll("img").forEach((i) => imgs.add(i.getAttribute("src")));
  root.querySelectorAll("a[href]").forEach((a) => links.add(`${a.getAttribute("href")}|${a.textContent.replace(/\s+/g, " ").trim()}`));
  root.querySelectorAll("button,[role=tab]").forEach((b) => controls.add((b.getAttribute("aria-label") || b.textContent).replace(/\s+/g, " ").trim()));
  return { texts: [...texts], imgs: [...imgs], links: [...links], controls: [...controls] };
}
```

**Normalisation:**
- Merge all collections per lesson (union) and sort.
- Ignore the dynamic strings “Bước N/7” and the `CountUp` intermediate values: with reduced motion, `CountUp` shows the final value; confirm this, and if it does not, read numbers from the data instead.
- Replace runs of digits inside step counters with `#` only for the pattern `/^Bước \d+\/\d+$/`.

**Modes:**
- `INVENTORY_WRITE=1` writes `tests/e2e/fixtures/lesson-inventory/<slug>.json`. This is the baseline, committed in Phase 0 **before any UI change**.
- The default mode compares: every baseline `texts`, `imgs`, `links` and `controls` entry must exist in the current collection. Extra entries are allowed.
- On failure, print the missing entries.
- `tests/e2e/fixtures/lesson-inventory/allowed-changes.json` lists **owner-approved** replacements: `{ "from": "…", "to": "…", "reason": "…" }`. It starts empty and may only contain the items of Section 6.5 after approval.

**Why text nodes:** a block split into two nodes, or merged with a neighbour, would create false failures. If a legitimate re-wrap splits a text node (for example a date and title on the same line now in two spans), the comparison must still pass. Implement the compare as: missing entry `x` is acceptable if `x` is a substring of the page’s normalised `main.textContent`. Only fail when the string is absent from the page entirely.

Also add **data-level protection** to the Phase gates:

```powershell
git diff --stat <phase-0-commit> -- lib/lessons lib/battles lib/mapfilm lib/models3d supabase
```

This must be empty, except the `copy` additions approved in 6.5.

---

## 6. Layout regression test (built in Phase 1, extended per Phase)

Create `tests/e2e/lesson-layout.spec.ts`. It runs for the DBP and HCM lessons at the 4 viewports (1280×720, 1366×768, 1440×900, 1920×1080), in light theme, plus a dark-theme pass at 1440×900.

| Id | Assertion | Phase |
|---|---|---|
| L1 | No horizontal page overflow (reuse `hasHorizontalOverflow` from `tests/e2e/support.ts`) | 1 |
| L2 | The content column width is ≥ 900 px at 1440×900 and the main blocks share the same left and right edges (±2 px): GoalBox, KeyDates `ol`, battle grid, results band, figures `ul`, tabs root, flashcards `ul` | 1 |
| L3 | Hero: the stats list `right` edge is within 40 px of the container right edge at ≥1366; the CTA buttons are inside the viewport without scrolling at 1280×720 | 2 |
| L4 | KeyDates: number of items in the last visual row (group by `top` ±4 px) equals `count % cols` or `cols` | 3 |
| L5 | Map chapter: scroll so the last step button is at the bottom of the viewport; the map region (`role=region` with name starting “Bản đồ mô phỏng”) is fully visible (top ≥ 64, bottom ≤ innerHeight) | 4 |
| L6 | Map chapter: the warning callout width equals the content width (±2 px) | 4 |
| L7 | No clipping: every `.flip-card__face` has `scrollHeight ≤ clientHeight + 1` (figures and flashcards) | 5, 7 |
| L8 | Figures: card tops are equal within a row and card bottoms are equal within a row (±2 px) | 5 |
| L9 | Video tab: all video frames have equal width (±1 px); the empty area under any column is ≤ 48 px (compare column bottoms in the same row) | 6 |
| L10 | Galleries: for every `role=tablist` inside `[data-resource]`, `scrollWidth ≤ clientWidth` (no hidden horizontal overflow); every `photo3d-tab` and `model-tab` is fully inside its list’s box | 6 |
| L11 | Galleries at ≥1366: the stage and the picker are side by side (picker `left` > stage `right`) and the picker top equals the stage top (±4 px) | 6 |
| L12 | Quiz CTA button height ≤ 56 px (single line) | 7 |
| L13 | Dark theme at 1440×900: no element in the lesson body has computed text colour equal to its background (sanity check), and the axe scan (`tests/e2e/a11y.spec.ts` pattern) reports no new violations on both lessons | 8 |

---

## 6.5 Two content defects found (owner approval required before changing)

These are not layout work. Ask the owner in the Phase 6 STOP report, and implement only if they say yes.

1. The Sa bàn 3D pill title is hard-coded as **“Sa bàn lòng chảo”** for every lesson. For HCM it labels a Dinh Độc Lập scan.
   - Proposal: add optional `copy.resultsScanTitle?: string` to `Lesson` (default `"Sa bàn lòng chảo"`, so DBP output is identical).
   - Set HCM to the scan’s subject, which the owner chooses (e.g. `"Dinh Độc Lập 3D"`).
2. The Sa bàn tab H3 and intro (“Nhìn chiến trường bằng 3D”, “Xoay sa bàn địa hình thật 360°…”) are hard-coded and describe a terrain model.
   - Proposal: optional `copy.resultsScanHeading?` and `copy.resultsScanIntro?` with the current strings as defaults; the HCM text is approved by the owner.

If approved, add entries to `allowed-changes.json` so the parity test passes for HCM only, and add a unit test asserting the DBP defaults are unchanged.

---

## 7. Phases

- Branch: start from the branch that contains the finished HCM lesson. Check with `git branch --show-current` and `git log --oneline -5`; it is expected to be `feat/hcm-1975-premium-lesson`. Then create `git switch -c feat/lesson-layout-redesign`.
- Progress file: `docs/superpowers/plans/2026-10-26-lesson-layout-redesign-progress.md`.

### Phase 0 — Baseline and safety net (no UI change)

1. `git status` must be clean (otherwise stop and ask). Create the branch.
2. `pnpm install --frozen-lockfile`, then `pnpm verify` must pass. Record the counts.
3. Build and start: `pnpm build`, then `pnpm start` (port 3000). Stop any old server on port 3000 first.
4. Capture **full-page** screenshots of both lessons at the 4 viewports, light theme, plus 1440×900 dark, with every Tư liệu tab opened once.
   - Save them to `.task-reports/lesson-layout-baseline/` (ignored).
   - Name them `<slug>-<w>x<h>-<theme>-<part>.png`.
   - Also capture the other 4 lessons at 1440×900 full page.
5. Write the content parity spec (Section 5). Run it with `INVENTORY_WRITE=1` for all 6 lessons, then run it again in compare mode. It must pass against the unchanged UI.
   - Open each JSON and sanity-check it: HCM must contain e.g. “Phi đội Quyết thắng”, every hotspot label, every video title and every flashcard answer.
   - If a collection misses something visible, fix the collector before continuing.
6. Commit `test: add lesson content parity inventory` (spec plus the 6 baseline JSON files) and create the progress file.

**STOP gate:** `pnpm verify` green; parity spec green; screenshots listed in the report.

### Phase 1 — Frame, spacing and primitives

**Files:**
- `components/lesson/LessonView.tsx`, `components/lesson/ChapterShell.tsx`.
- `components/lesson/sections/shared.tsx` (`ChapterLabel`, `SectionIntro`).
- `lib/lessons/layout.ts` (`balancedColumns` plus the class map).
- `tests/unit/lesson-layout.test.ts`; `tests/e2e/lesson-layout.spec.ts` (L1, L2).

**Steps:**
1. Implement 3.1, 3.2, 3.3 and 4.9.
2. Replace every `-mt-3 mb-5 max-w-3xl text-muted-foreground` intro paragraph in the lesson sections with `SectionIntro`, keeping the same text and inline markup.
3. Remove the `max-w-3xl` limits on **block** elements (callouts, grids), not on prose paragraphs.

**Checks:** unit tests, parity spec, L1, L2, the existing `tests/e2e/lesson.spec.ts`. Screenshot both lessons at 1440×900.
**Commit:** `feat: widen lesson frame and unify chapter rhythm`.

### Phase 2 — Hero

**File:** `components/lesson/sections/LessonHero.tsx`. Implement 4.1.
**Checks:** parity, L3, contrast check on both heroes (use the DevTools contrast picker or axe; record the ratios), `tests/e2e/lesson.spec.ts` (“Số liệu chính” contains 16.200 for DBP).
**Commit:** `feat: rebalance lesson hero with side stats`.

### Phase 3 — Chương 1 (goals and key dates)

**Files:** `GoalBox.tsx`, `KeyDates.tsx`, the `.lesson-timeline` CSS in `app/globals.css`. Implement 4.2.
**Checks:** parity, L4, print preview of the lesson (Ctrl+P preview; the timeline must still print legibly), and all six lessons at 1440×900 (their date counts differ).
**Commit:** `feat: turn key dates into a balanced timeline track`.

### Phase 4 — Chương 2 (map)

**Files:** `BattleSection.tsx`, `BattleMapSection.tsx`, `BattleReenactment.tsx`, `MapLegend.tsx` (positions only, if needed). Implement 4.3.

**Checks:**
- parity (step captions, facts and images collected per step), L5, L6;
- the existing `tests/e2e/lesson.spec.ts` map cases;
- `tests/e2e/battle.spec.ts` (Bạch Đằng);
- `tests/e2e/mapfilm.spec.ts` (3D toggle still works);
- manual: press Phát on DBP and HCM, watch all 7 steps, confirm the map flies and markers change; switch to 3D and back.
- Leaflet must call `invalidateSize` correctly after the height change. The component already measures `mapBoxHasSize`; verify that tiles fill the box after resizing the window between 1280 and 1920.

**Commit:** `feat: sticky campaign map beside step panel`.

### Phase 5 — Chương 3 and 4 (results and figures)

**Files:** `ResultsSection.tsx`, `FiguresSection.tsx`, `FlipCard.tsx`, the flip CSS in `globals.css`. Implement 4.4 and 4.5.
**Checks:** parity, L7, L8; `/trac-nghiem/the-ghi-nho` manual check at 1440×900 (flip works, no clipping); reduced-motion flip; keyboard flip (Enter and Space); the `tests/e2e/lesson.spec.ts` flip-card case.
**Commit:** `feat: editorial results band and equal-height figure cards`.

### Phase 6 — Chương 5 (Tư liệu)

**Files:** `ResourceSection.tsx`, `VideoEmbed.tsx`, `DepthPhotoGallery.tsx`, `ScanViewer.tsx`, `ModelGallery.tsx`. Implement 4.6.

**Order:**
1. Video grid.
2. `DepthPhotoGallery` split pane, starting with the Hiện vật tab, then Sa bàn and Di tích (same component).
3. `ScanViewer` sizing and credit placement.
4. `ModelGallery` pane.

**Checks:**
- Parity: this is the riskiest Phase for content loss, so run it after each of the four steps.
- L9, L10, L11.
- `tests/e2e/photo3d.spec.ts`, `tests/e2e/models3d.spec.ts`, and the `tests/e2e/lesson.spec.ts` video case (lazy iframe, only one iframe).
- Manual:
  - open each item of each gallery on both lessons;
  - start one depth photo, one 360° scan and one 3D model, and confirm only one heavy viewer at a time;
  - fullscreen on a depth photo;
  - keyboard: Tab into the picker, then ArrowUp/Down/Left/Right, Home and End.
- Record WebGL context count (DevTools → Rendering → “WebGL” or `performance.memory` is not reliable; instead check that previous canvases are removed from the DOM).

In the STOP report, include the 6.5 question for the owner, with screenshots of the Sa bàn tab.
**Commit:** `feat: two-pane media galleries and balanced video grid`.

### Phase 6b — (only if the owner approved 6.5)

Implement 6.5 exactly: optional `copy` fields with defaults, HCM values from the owner, `allowed-changes.json` entries, and a unit test.
**Commit:** `fix: lesson-specific labels for the 3D results scan`.

### Phase 7 — Chương 6 and 7 (review and sources)

**Files:** `ReviewSection.tsx`, `SourcesSection.tsx`. Implement 4.7 and 4.8.
**Checks:** parity, L7 (flashcards), L12; the `LessonStudiedMarker` still marks the lesson studied (check the passport `/ho-chieu` after scrolling to Ôn tập in a fresh profile); the “Xem trang sự kiện” button still appears only when the event is published.
**Commit:** `feat: tidy review and sources chapters`.

### Phase 8 — Cross-checks and polish

1. Dark theme pass at the 4 viewports on both lessons, then L13.
2. Keyboard-only walkthrough of both lessons from the skip link to the last button. Write down the tab order in the report, and check that the focus ring is visible everywhere.
3. Reduced motion (DevTools emulation): hero, flip, map (no fly animation), galleries.
4. The other 4 lessons at 1440×900 and 1280×720: compare with the Phase 0 screenshots, with no overflow or clipping, and parity green for all 6.
5. Shared pages: `/tai-hien/bach-dang-938`, `/trac-nghiem/the-ghi-nho`, `/kham-pha`, `/ban-do-3d/dien-bien-phu`, `/ban-do-3d/chien-dich-ho-chi-minh`, `/mo-hinh-3d/luu-phao-105`, `/bai-hoc/chien-dich-ho-chi-minh-1975/trinh-chieu`.
6. Print preview of one lesson: content must not be cut off.
7. Fix what you find (small commits: `fix: …`).

**STOP gate:** all of the above recorded with screenshots.

### Phase 9 — Final verification and handoff

```powershell
pnpm verify
pnpm build; pnpm start   # in a separate terminal; stop any previous server first
$env:E2E_BASE_URL='http://127.0.0.1:3000'
pnpm exec playwright test tests/e2e/lesson-content-parity.spec.ts tests/e2e/lesson-layout.spec.ts tests/e2e/lesson.spec.ts tests/e2e/photo3d.spec.ts tests/e2e/models3d.spec.ts tests/e2e/battle.spec.ts tests/e2e/presentation.spec.ts tests/e2e/a11y.spec.ts --workers=1
pnpm exec playwright test tests/e2e/mapfilm.spec.ts --workers=1
git diff --stat <phase-0-commit> -- lib/lessons lib/battles lib/mapfilm lib/models3d supabase   # empty except approved 6.5
git diff --check
git status
```

- Capture the final screenshots: same set and names as Phase 0, saved to `.task-reports/lesson-layout-final/`.
- Build a before/after list in the report, one pair per problem P1–P14, stating how each was resolved.
- Update `docs/huong-dan-giao-dien.md` with a short “Khuôn chuyên đề tương tác” section: the frame, spacing, balanced grids, gallery pane, no fixed heights. Update `docs/agent/CURRENT-STATE.md` only if entry points changed (they should not).
- Final report: `.task-reports/…-lesson-layout-final.md`, giving its absolute path to the owner. **Do not push.**

---

## 8. Definition of done

- P1–P14 are each resolved, or explicitly justified in the final report.
- The content parity spec is green for all 6 lessons against the Phase 0 baseline (with only owner-approved 6.5 replacements).
- The layout spec L1–L13 is green at the 4 viewports, and existing e2e suites are green on a fresh production build.
- `pnpm verify` is green. Data files are unchanged except the approved 6.5 fields.
- Dark theme, keyboard, reduced motion and print checked and recorded.

## 9. Stop conditions (ask the owner)

- The parity spec reports missing content and the only way to fix the layout would be to drop or shorten it.
- A change to a shared component (`FlipCard`, `BattleReenactment`, `DepthPhotoGallery`, `Tabs`) would visibly break another page and cannot be scoped. Prefer an opt-in prop (e.g. `layout="split"`) to protect other users.
- Sticky map or split gallery cannot meet 1280×720 without hiding controls.
- Any change would need a new dependency, a data rewrite, or editing user-facing copy beyond 6.5.
- Unexpected uncommitted changes appear in the working tree.
