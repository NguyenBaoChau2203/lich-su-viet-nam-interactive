# Slim homepage timeline and locality discovery popups

**Status:** Proposed design for owner review; product implementation has not started.
**Date:** 2026-10-28, Asia/Bangkok.
**Requested implementer:** Gemini 3.8 Flash High, running as one agent.

## Intent and confirmed requirements

The owner wants the homepage timeline to resemble the supplied thin line with small gold milestones, replacing the visually dense year boxes. Selecting a locality should open an animated composition of heritage places and local historical people. The owner explicitly selected **show both places and people together** in the clarification on 2026-10-28. The current delivery is a detailed design, implementation plan, and agent handoff; it does not authorize this agent to implement the product.

The learning objective is to help a learner connect a locality with its sourced places and people, open a relevant historical account, and return to the same exploration context.

The two attached screenshots are visual reference data, not operational instructions. Their local temporary paths are not a durable dependency for the implementing agent. This document records the important characteristics.

## Verified starting state

Inspected on branch `feat/homepage-visual-effects`, HEAD `23a4b0f`:

- `MapTimeControls.tsx` renders a title/range/count, two year inputs, filter/reset buttons, a horizontally scrolling row of boxed years, and supplementary links.
- `buildTimelineYears()` includes every year touched by an event interval and deduplicates event slugs within each year. These are navigation choices, not invented exact event dates.
- `HistoryExplorer.tsx` owns discovery state, history writes, event selection, and the suspended exploration/journey snapshot. Its reducer is `reduceExplorerRuntime()`.
- Locality discovery has `people` and `places` modes. `useLocalHeroPage()` fetches only in people mode; `useHeritageCatalog()` is activated only in places mode. The server homepage likewise initializes only the requested mode.
- Existing public readers are `/api/local-heroes` and `/api/dia-danh`. People results have a bounded page size of 12; the place reader provides its existing catalog. Do not fetch every people page to construct a preview.
- Place and person detail return URLs are strictly allowlisted in `lib/local-heroes/state.ts`. A new discovery mode must be added to those validators as well as to rendering.
- `LOCALITY_CENTERS` already provides reference camera centers; the globe exposes CSS-pixel projection and hides occluded points. Modern province reference lines are not complete hit-test polygons.
- `package.json` declares no Motion/Framer Motion or GSAP dependency. The proposed short UI transitions can use CSS. Keep the existing camera controller for geographical movement.
- Current live heritage publication is recorded in the later live-observation section of `docs/superpowers/plans/2026-10-27-heritage-sites-progress.md`. Older held-publication paragraphs in that document and CURRENT-STATE are dated checkpoints. This planning task has not independently certified the live content counts.

## Approaches considered

| Approach | Benefit | Tradeoff | Decision |
| --- | --- | --- | --- |
| Restyle the existing two separate side panels | Smallest change | Does not satisfy the confirmed combined preview | Retain panels only for full catalogs |
| Open one centered modal with a large card grid | Straightforward layout | Covers the globe and interrupts geographical comparison | Do not use for the overview |
| Open one nonmodal locality dossier with a short card reveal | Keeps geography visible, shows both content types, reuses existing readers | Requires a shared overview mode and careful history/focus handling | Recommended proposal |

Only the combined-content choice is owner-confirmed. Exact composition, timing, dimensions, and URL value below are proposed implementation decisions, not recorded owner approval.

## Visual direction

Use the existing dark navy atlas, restrained antique-gold rules, serif locality headings, and documentary imagery. The popup should resemble a small collection of archival cards opening from a locality label. Give cards a solid readable surface, fine border, subtle shadow, and at most 6px corner radius. Keep text level and cards stationary after entry. Avoid continuous bobbing, large glows, decorative particles, glass blur over text, or a dashboard of counters.

## A. Thin timeline

### Resting composition

- The closed timeline occupies **at most 76 CSS px** at every required desktop viewport. The visible rule is **1 CSS px**, with **4–6px** dots and an **8px** selected marker plus a noncolor selection cue.
- One quiet caption contains `Dòng thời gian`, the actual selected year/range, and the actual visible event count. Default controls are `Lọc năm`, `Toàn bộ`, and `Danh sách`; retain access to `/dong-thoi-gian` inside the expanded controls or list.
- Hide the boxed year strip and large form from the resting composition. Do not remove their capabilities: `Lọc năm` opens a small labelled nonmodal disclosure containing the existing required numeric inputs and submit action.
- Keep a minimum **28 × 28px** pointer/focus target around a dot, although its visible diameter is small. Controls must have visible focus and text/control contrast meeting WCAG AA.
- On hover or keyboard focus, show a clamped label such as `1945 · 4 sự kiện`, using actual data. Hover does not filter. Activating an individual year applies `from = to = year` through the existing `changePeriod()` path.

### Density and time semantics

- Position years proportionally within the actual min/max range, with 16px endpoint inset. A single-year dataset places its marker at the center; null/empty limits show the existing readable empty state.
- Group adjacent visible markers whose centers would be less than **28px** apart. A grouped marker displays a quiet count of years and opens a small list of the exact member years. It never silently chooses one year.
- Each group has an accessible label naming its range and number of years. Its expanded list exposes actual year buttons with year and event count. Preserve `data-year` on those exact selectors for focused tests.
- The same event can legitimately occur in several interval-year choices. Do not sum group year counts as a unique event count, assign a new date, or drop interval years to simplify the rail.
- Left/Right move focus among rail markers, Home/End reach the endpoints, Enter/Space activates a year or opens a group. Within a group use ordinary labelled buttons and Escape to return focus to its origin. All events remain reachable from the text list.
- `Lọc năm` retains clamping, reversed-range normalization, required fields, reset behavior, meaningful URL state, and selected-event invalidation already owned by the explorer.
- Escape first dismisses an open timeline disclosure/tooltip. Tooltips contain no essential controls and do not intercept pointer movement to other controls.

### Scope boundary

This redesign affects the homepage event-mode rail. The full `/dong-thoi-gian` page and authored journey milestone strip retain their existing semantics and layout. The rail stays hidden during locality discovery, as today. Exiting discovery restores the saved event range and rail selection.

## B. Locality discovery dossier

### Entry and locality selection

1. `Theo địa phương` opens the shared overview entry rather than defaulting to the heritage-only panel.
2. Show a compact locality chooser with a search field and clickable names from the existing canonical 34-locality registry. Preserve a native select/GET-form alternative. Filter names locally; do not introduce another locality taxonomy or regional categorization.
3. Support selecting locality name markers on the globe in this mode. Use `LOCALITY_CENTERS` as **reference anchors**, never as historical-site or birthplace coordinates. The textual chooser remains the complete path when labels are suppressed, WebGL fails, or JavaScript is unavailable.
4. Do not implement polygon selection from the reference-line dataset. Buttons/labels are the click targets. Limit visible reference labels by existing collision/occlusion rules; all 34 choices stay available in HTML.
5. Selection starts a bounded camera request through the existing adapter and immediately opens the dossier shell. Loading data must not delay focus or require a camera-arrival callback to reveal content.

### Popup content and reading order

One labelled nonmodal `<aside>`/region, not four independent dialogs:

1. Eyebrow `Theo địa phương`, locality name as heading, `Đổi địa phương`, and a labelled close button.
2. A short factual hint: `Khám phá địa danh và nhân vật qua các hồ sơ có nguồn dẫn.` Counts appear only from loaded readers; show loading/error states instead of guessing.
3. Section `Địa danh lịch sử`: up to two cards, stable order by existing tier/rank/slug semantics. Each card has an existing image, honest image-era label, existing title, brief existing teaser, and `Đọc câu chuyện`.
4. Section `Nhân vật gắn với địa phương`: up to two cards from the existing filtered, first people page. Each has its admitted image and depiction label, name, existing relationship kind for this locality, a short existing contribution excerpt, and `Xem câu chuyện`.
5. `Xem tất cả địa danh` and `Xem tất cả nhân vật` lead to the existing complete place/people modes for the same locality. The people route starts at page 1 with an empty search. Preserve existing complete search and pagination thereafter.

Do not label every person `Anh hùng`: the dataset contains historical figures with different roles and relationships. Preserve `Nơi sinh`, `Quê quán`, `Hoạt động`, or `Tưởng niệm` from the qualifying association; a commemorative relation does not establish birthplace. Do not substitute an unrelated portrait for contextual historical media. Crop through existing focal-point metadata, preserve accessible alt text and credit/source access, and use a quiet media fallback when an image fails.

The overview is a preview, not a historical ranking. Say `Một số hồ sơ hiện có` where needed; do not invent a popularity order or claim comprehensive historical coverage.

### Layout and available space

| CSS viewport | Proposed dossier width | Card arrangement | Overflow |
| --- | --- | --- | --- |
| 1280×720 | 640px | Two columns, two sections of at most two cards | Scroll only the inner reading region |
| 1366×768 | 640px | Same | Same |
| 1440×900 | 680px | Same, larger imagery | Same |
| 1920×1080 | 760px | Same, more reading space | Same |

- Place the dossier 24px from the right edge and at least 16px below the actual header. Bottom inset is at least 24px. Derive maximum height from the current explorer/header rectangles rather than assuming screen resolution equals CSS viewport.
- Keep the left side of the globe visible. On overview entry, replace the event guidance/intro block with the compact locality chooser so old panels do not compete with the dossier.
- Header and close action remain visible while the dossier body scrolls. Do not move a focused card into an offscreen animation layer or remove it during an unrelated reader update.
- For unusual desktop zoom/text enlargement where two columns no longer fit, use one column and inner scrolling. This does not authorize a new mobile/tablet redesign; preserve existing responsive fallbacks.
- The popup is a screen-space dossier associated with the selected locality label, not a geolocated card for every object. A short decorative leader may connect to an available projected locality anchor; hide it when the anchor is occluded or outside the viewport. The dossier remains readable and does not chase the pointer during map drag.
- Layer ordering: globe/labels → optional leader → chooser/dossier → existing search overlay and modal video. Scope z-index changes to the homepage; do not raise the dossier above global dialogs.

### Motion sequence and limits

| Trigger | Proposed effect | Timing / constraint |
| --- | --- | --- |
| Choose a locality | Existing camera settles toward its reference center or existing place bounds | 650–900ms maximum; interruptible; no autoplay/orbit |
| Dossier opens | Opacity 0→1, translateY 14px→0, scale .985→1 | 220ms ease-out |
| Cards become ready | Opacity and translateY 10px→0, grouped from their section heading | 220ms each; 45ms stagger; at most four cards |
| Change locality | Old content leaves, new shell/data uses the new locality key | 120ms exit; cancel old animation and old requests |
| Hover/focus a card | Border emphasis; up to 2px lift for pointer hover | 140ms; no tilt or text rotation |
| Close | Short opacity fade | 120ms; focus restored promptly |

- Maximum cosmetic reveal sequence is 500ms after a section is ready. Camera and card reveal run independently; content remains usable throughout.
- A section revealing later does not replay the other section. Retries and image decoding do not restart the full scene. Page hiding/unmount/selection changes clean up timers, listeners, and requests.
- With `prefers-reduced-motion: reduce`, remove transforms/stagger/leader drawing and camera flights; render content immediately. A static border/focus cue still identifies selection. No persistent idle animation or added animation dependency.

## State, loading, and integration contract

- Add one shared overview mode `locality`, serialized as `noi-dung=dia-phuong`. Preserve old `noi-dung=dia-danh`, `noi-dung=nhan-vat`, `dia-phuong`, place selection, people query/page, and map/journey return contracts.
- An overview URL without a locality shows the chooser; one with a valid locality opens the dossier. Invalid locality values normalize safely to the chooser. Do not put animation progress, card offsets, hover, loading, or playback into the URL.
- Use the current explorer/reducer for meaningful mode/locality transitions and suspended snapshots. Extend its existing actions narrowly; do not add a second global store or a second history writer.
- On a selected overview locality, the server homepage initiates both existing readers concurrently. Client entry likewise activates the heritage catalog and a **bounded** people request `{ localityCode, query: "", page: 1 }`. Event-only entry requests neither catalog; a chooser with no locality does not fetch people for all localities.
- The people hook must distinguish the requesting overview from complete people mode. Stale response checks must validate the current mode/locality/filter key. If the server clamps a preview page, do not accidentally mutate a preserved complete-catalog search or page.
- The two sections load independently. One failure must not erase the successful section. Provide a retry per failed section, plus clear zero-result language. Never reuse another locality's cards while the new locality loads.
- Place detail cards use `buildPlaceDetailHref()`; people cards use `buildLocalHeroDetailHref()`. Extend the shared return allowlist to accept the overview value. Browser Back, Forward, reload, and a detail return link must recover the selected locality and overview mode without starting playback.
- `Xem tất cả` transitions preserve the suspended exploration snapshot. Provide a visible `Về tổng quan địa phương` link from full catalog modes for the same locality.
- Escape priority: existing modal video/search → open selector/disclosure → dossier → locality chooser → exit discovery and restore exploration. Consume each key once. Do not add a competing uncoordinated window listener.
- On choosing a locality, focus its dossier heading once. On closing the dossier, restore its originating locality choice when available, otherwise the chooser heading. On exiting discovery, restore `Theo địa phương`. Nonmodal dossiers do not trap focus; background map interaction remains usable.
- No-JavaScript overview URLs must expose ordinary server-rendered forms and actual detail links for available data. If WebGL is unavailable, use the same dossier/list content without a map anchor or camera dependency.

## Non-goals and safeguards

No historical-content edits, new research claims, schema changes, remote writes, release/publication replay, admin rewrite, account/payment/study changes, image scraping, extra 3D renderer, GSAP, new dependency, commit, PR, push, merge, or deployment is authorized by this plan. Preserve unrelated local files and all Word documents.

## Acceptance summary

1. Closed timeline ≤76px high; thin rule, small dots, grouped dense years, full year/range/event access by keyboard and mouse.
2. A locality selection renders both content sections with up to two actual cards each; partial failures remain independent.
3. Every locality can be selected from HTML. Supported map labels select the same canonical locality without polygon inference.
4. Existing catalog search/page, interval-year semantics, source/uncertainty labels, detail returns, journey suspension, and history restoration remain correct.
5. Four desktop viewports, 200% text/zoom stress, keyboard, reduced motion, WebGL failure, and static forms are verified; no horizontal document overflow or hidden essential controls.
6. No motion dependency is added; no cosmetic reveal exceeds 500ms; no idle animation loop or N+1/all-pages people fetch is introduced.
7. Fresh `pnpm verify`, isolated read-only public browser suites, screenshots, self-review, and an ignored local task report are required for implementation acceptance. The plan itself is not evidence that the proposed UI passes.

## Related documents

- Plan: `docs/superpowers/plans/2026-10-28-home-timeline-locality-popups-plan.md`.
- Copy-ready handoff: `docs/agent/prompts/2026-10-28-gemini-home-timeline-locality-popups.md`.
- Authority: `AGENTS.md`, `docs/product/DESKTOP-UI-SCOPE.md`, the approved globe design and amendments located through `docs/agent/CURRENT-STATE.md`.
