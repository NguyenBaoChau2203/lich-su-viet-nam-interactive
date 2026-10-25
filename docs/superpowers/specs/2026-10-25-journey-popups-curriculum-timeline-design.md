# Journey popups and grade-12 timeline coverage

Date: 2026-10-25 (Asia/Bangkok).

Status: planning deliverable. The owner requested an implementation plan and an execution prompt, not implementation in this chat. The owner explicitly chose a popup **near the selected geographical point**. Other detailed values below are the agent's proposed implementation decisions. Executing the companion prompt is a separate owner action; this document does not authorize external publication.

## Intent and authority

When a learner reaches a journey stop, show an image and a short sourced explanation beside that stop on the existing globe. Make the general timeline useful for the Vietnamese-history portion of grade 12, including content after 1986.

Read with `AGENTS.md`, `docs/product/DESKTOP-UI-SCOPE.md`, `docs/agent/CURRENT-STATE.md`, the approved `2026-10-23-curated-history-globe-design.md`, and the `2026-10-24-explorer-refinement-design.md` amendment. Preserve the current cinematic renderer. The old tabletop release plan is historical context, not authority to add simulations to every new timeline event.

## Observed starting state

Source review at HEAD `ffd20a1`, branch `feat/homepage-ui-refinement`:

| Finding | Evidence and implication |
| --- | --- |
| Four journeys, 20 authored stops: 7 + 4 + 5 + 4 | `lib/explorer/journeys/registry.ts` and its four data modules. Preserve their identities and authored sequence. |
| Journey reader is fixed at the upper right and has no image | `JourneyPanel.tsx` uses `home-map-event-card`; `explorer-map.css:41` supplies absolute top/right placement. `JourneyStop` has no media field. |
| Arrival and playback already have a shared owner | `HistoryExplorer.tsx`, `journeys/playback.ts`; identity is journey ID + stop ID + nonce. The current dwell is 2000 ms after validated arrival. |
| Home timeline samples at most eight start years | `MapTimeControls.tsx:7-8`; it does not expose every available year, and its equally spaced labels do not encode elapsed time. |
| Public catalog is publication filtered | Both explorer and dedicated timeline queries require `workflow_status = published`. This is a contract to preserve. |
| Seed baseline contains ten events | `supabase/seed.sql` explicitly calls this the first batch. It is not a current live-database count or an independent historical certification. |
| Local event Markdown contains 28 files | Ten updates and eighteen additions. Six additions concern world/regional context, leaving 22 Vietnamese-history event identities in the combined local source set. |
| Later content already exists locally | Includes 1977, 1979, 1987, 1988, 1995 and 2007 records. The SQL builder inserts new content as draft. Reuse and verify these before creating duplicates. |
| Textbook mapping already exists | `lib/sgk/curriculum.ts` identifies Kết nối tri thức; lessons 6-17 cover the main Vietnamese-history themes. Section assignments may be replaced by database assignments. |
| Card images alone lack sufficient attribution | `CardCover` has URL, alt and focal point only. Reusing an event cover does not by itself establish rights or stop-specific historical relevance. |

The screenshots show the reader and a selected 1986-1986 filter. They do not establish the current public database inventory. No live database was queried in this planning task. The Next.js development issue badge is not a diagnosed application failure and is outside this request.

## Curriculum evidence and its limits

The official 2022 history amendment confirms post-1975 defense, Đổi mới, modern foreign relations and Hồ Chí Minh as grade-12 themes. Its Đổi mới structure includes 1986-1995, 1996-2006 and 2006 onward. This supports extending coverage beyond 1986. [Bộ GD&ĐT, Thông tư 13/2022, attached curriculum](https://datafiles.chinhphu.vn/cpp/files/vbpq/2022/08/13-bgddt.signed.pdf), printed pp.46-50, PDF pp.49-53; accessed 2026-10-25.

The actual PDF was downloaded and these pages were rendered and visually read because its text layer is largely scanned. SHA-256: `62ceeae5c15897470d4c949bd9c532650fe9d7013f90a0503d5cbbcad50f575c`. The Ministry-hosted consolidated PDF timed out; search snippets were not used as evidence. The readable original is linked above, with [its official metadata page](https://vanban.chinhphu.vn/?docid=206343&pageid=27160).

[HEID's textbook catalogue](https://heid.vn/product/sach-giao-khoa-lich-su-12-ket-noi-tri-thuc/) identifies the Kết nối tri thức grade-12 book, NXBGDVN, 2024; accessed 2026-10-25. It confirms product metadata, not the owner's printing, lesson wording or page numbers. The existing repository source ledger also records this edition gap.

An implementation must check applicable amendments, including [Thông tư 17/2025 metadata and attachment](https://vanban.chinhphu.vn/default.aspx?docid=215347&pageid=27160), and publisher material. This task has not audited every later amendment or the owner's exact textbook. Use topic-level mappings where supported; leave edition-specific page alignment unresolved if unavailable. Do not claim coverage of every textbook paragraph, or of the optional specialist volumes.

## Approaches

| Approach | Tradeoff | Decision |
| --- | --- | --- |
| Nonmodal HTML popup near the active projected stop | Preserves place context and map interaction; needs edge placement, occlusion handling and focus care | Selected by the owner |
| Centered modal with a backdrop | More reading space; interrupts geographical exploration and needs modal focus behavior | Not selected |
| Add an image to the fixed right reader | Small code change; does not meet the requested placement | Rejected |

Use the existing scene's `GlobeViewport.project()` contract, which can return null for an unavailable, offstage or Earth-occluded point. Do not add MapLibre popups to the Three.js scene, change renderer, or build a second camera/projection loop.

## Popup behavior

1. Choosing a journey or stop requests the existing camera transition. During travel show the existing travel status; do not display the new stop's full popup at the previous point.
2. Open exactly one popup after the **current** arrival is validated. Manual next/previous, direct stop selection, shared URLs and autoplay use the same content path. A late callback cannot reopen an old stop.
3. Show stop number, date and precision, title, place, one image, a two-to-four-sentence summary, location uncertainty, readable media credit, expandable historical sources, and a detail link only for a genuinely published related event.
4. Use the current stop's existing summary where sufficient. Do not lengthen it with unsupported claims simply to reach a sentence count. The initial implementation may use the shorter existing copy.
5. Start at 360 CSS px width, within a 320-380 px desktop range; image ratio 16:9, content area internally scrollable, outer height at most 440 px and constrained by available safe height. Keep controls reachable at 1280x720.
6. Prefer above the point; flip to the side or below if needed, with 12 px gap and 16 px viewport safety margin. Reserve header, chooser, milestone strip, map tools, attribution and notices. Keep the point visible; a small leader points to its real projected position when clamping shifts the popup.
7. Reserve the measured popup rectangle for label collision handling without making the popup collide against its own previous rectangle. Recalculate on resize, content/image size changes and existing scene updates. Coordinate conversions must use the same map-stage CSS origin; devicePixelRatio must not affect placement.
8. Retain the schematic route and its accuracy disclosure. Adding a popup must not alter coordinates, camera targets or the meaning of a connecting line.
9. `Đóng thông tin mốc` and Escape close only the popup and pause playback. They do not exit journey mode. Keep previous/next, play/pause, exit, chooser and milestone links available outside the popup. Provide `Đọc mốc hiện tại` and an accessible active-stop trigger to reopen it.
10. Manual map input retains the existing pause rule. While the point remains visible the popup follows it. If the point is occluded/offstage, remove the geographical popup and offer the same reader through an explicit in-flow reading fallback. Do not pin a floating card to a false geographical position. Preserve focus by moving it to the persistent current-stop trigger when a focused popup becomes unavailable.
11. If WebGL/assets fail or JavaScript is disabled, render ordinary HTML reading and actual milestone/source links. This is the fallback presentation of the same content, not a second copy of journey history. Preserve native GET journey selection and no-JavaScript exit.

### Reading and focus

Use a labelled nonmodal region; no backdrop, modal role or focus trap. Auto-advancing must not steal focus. Explicit keyboard activation may focus the popup heading once; focus restoration goes to the initiating stop trigger or persistent current-stop control. Announce the new stop once through a polite live status after arrival, never on every projection update.

Preserve `JOURNEY_DWELL_MS = 2000`, counted after validated arrival. Pause playback when the reading surface is hovered, receives keyboard focus, has expanded sources, or receives deliberate reading/media interaction. Pausing is latched: leaving the reader does not restart playback; explicit Play does. Keep Play/Pause outside the reader guard so it remains usable. Closing, map input, hidden tab, navigation, new seek/journey and reduced motion cancel pending work. The final stop does not loop. Broken/slow images never block reading, exit or navigation; show a reserved fallback area with honest copy.

No speed menu or new autoplay policy is added. A longer default dwell can be proposed separately after learner testing.

## Media contract

Cover all 20 stops in an explicit media inventory. Reuse reviewed event media only when it illustrates the stop, not merely a linked parent event spanning decades or several countries. Marseille must not silently inherit an image of departure from Sài Gòn.

Each usable image needs URL/local asset, alt text, caption, creator/institution, rights statement and link, source page, access date, image kind, and claim/relevance scope. Distinguish historical photograph, document/facsimile and illustration in visible copy. **Owner amendments in the execution chat (2026-10-25):** Internet images may be used for this coursework, with attribution; present-day place photos are prohibited in these popups. Use historical imagery describing the event or clearly labelled, source-supported period context. A later photograph or illustration must never be presented as the instant of an earlier event. Unknown or unsupported relevance stays `needs_evidence` in the inventory and out of rendered media.

Extend the small journey/media model or add a typed media registry keyed by journey ID + stop ID; reuse `lib/media.ts` conventions. This is presentation metadata, not a second event catalog. No new database schema is assumed. Preserve legacy stop claims and regression contracts; adding a media reference is not permission to rewrite dates/coordinates or their provenance.

Aim for one verified image at every stop. If any is unavailable, implement the explicit empty/error state, report that stop's media coverage as incomplete, and continue other authorized work. Do not call media completion achieved through generic placeholders or invented licenses.

## General timeline

Replace the eight sampled-year choices with access to **every available event year**. Derive the union of integer years covered by each event's inclusive start/end range; an event without an end year covers its start year. Count each event once per overlapping year, even if it has multiple locations or topics. This makes middle-of-interval and end-only years reachable without inventing a new event. Use a compact horizontally scrollable list of year buttons, grouped chronologically, with event counts and previous/next scroll controls. It is an indexed year navigator; do not imply that equally spaced buttons are a proportional time axis. Keep native keyboard access and scroll focused choices into view. The page itself must not overflow horizontally.

Show the visible event count and active range, retain explicit From/To and `Toàn bộ`, and add an honest `Xem toàn bộ dòng thời gian` link to the existing route. A year button sets `tu=den=year`; empty ranges show a useful message and reset action. Normalize reversed/clamped bounds consistently in state and URL. Interval events match by overlap, including a selected year in the middle of an interval; end-only years remain reachable. Do not create one fake exact date for an interval.

Provide a compact expandable year/event list next to this navigation so same-year events can be selected individually without crowding the globe. Reuse the current event list and identity/detail-return helpers where possible; do not implement a second search application. The dedicated `/dong-thoi-gian` page, search, map and detail routes use the same published identities and topic assignments.

Maximum filter year comes from available published content. Never hardcode 1986 or the current year, or add empty years only to suggest coverage. Keep existing world/regional content and its routes; this expansion targets Vietnamese content and does not require a new geography classifier/filter.

## Content expansion and completion meaning

Inventory the 22 existing local Vietnamese-history identities before writing more. Audit publication availability separately from historical evidence and media readiness. Preserve the six existing world/regional context identities; they do not count toward the Vietnamese-content target.

The companion plan proposes 19 additional research candidates, producing an **editorial working set of approximately 40 Vietnamese milestones** (41 before evidence-based exclusions or merges). This is a proposed content budget, not a curriculum requirement or a proof of completeness. Do not add duplicate entries for the same event in different lessons. Tie entries to actual lesson/section IDs and use existing many-to-many assignments.

For every candidate, separately evaluate dates, date precision, summary, source coverage, location accuracy, image rights and lesson relevance. Unsupported claims remain unpublished. A theme about achievements, causes or lessons may be covered by sourced explanatory content and links instead of a fabricated date/point. The coverage matrix must record that distinction, especially for lesson 11.

Prepare new/updated content and additive import SQL locally, using the current draft/review workflow. An unqualified textbook-title source note is insufficient evidence for a newly reviewed claim. Existing source IDs/links may be reused when their scope and locators genuinely support it. Do not run a broad generator that rewrites unrelated existing content or the old tank caption.

The local implementation deliverable is code, tested interaction, source-reviewed content artifacts and a demonstrated local/test catalog. Remote import/publication is a later owner-authorized step. A successful local demonstration must not be reported as production publication or complete textbook coverage.

## Verification contract

Use one agent for investigation, implementation, self-review and verification. Add meaningful logic/behavior tests, not tests of literal CSS values or tests equating publication with historical verification.

Required UI evidence covers all four journeys and four desktop CSS viewports: 1280x720, 1366x768, 1440x900, 1920x1080. Exercise arrival ordering, rapid seek/switch races, keyboard/Escape/focus, hover/focus/source pause, explicit resume, close/reopen, image error, no image, far-side/offstage stop, resizing, no JavaScript, failed WebGL, reduced motion, hidden tab, detail return and exploration restoration.

Timeline evidence includes more than eight years, multiple events per year, ranges beyond 1986, interval overlap, invalid/reversed/empty bounds, published-only detail links and consistent home/dedicated timeline/search identities. An evidence-backed local dataset or explicit test-only network fixture can prove UI behavior; only an actual local database query proves local database availability.

Run `pnpm verify`, appropriate public browser tests and `pnpm test:e2e:smoke`. Inspect legacy E2E before executing it: full `pnpm test:e2e` requires an explicitly authorized disposable environment because some suites mutate accounts/content. `pnpm verify` does not include browser tests.

No continuous new idle render loop, no new dependency, no renderer rebuild, no geography changes, no Word edits, no external writes, push, merge, PR, commit or deployment as part of this planning task or by default in the execution prompt.
