# Prompt — Phase 3: match the atlas homepage composition

## Mission

Recompose the homepage's navigation, title, guidance/card areas and timeline to match the accepted concept hierarchy on laptop/PC while preserving existing semantic controls.

## Definition of done

- One compact homepage masthead exposes the real exploration/journey modes and secondary study/revision access.
- The left title, initial right guidance and thin bottom timeline meet the spec's desktop layout limits.
- Other public routes retain the shared header; keyboard and HTML reading remain usable.
- Default/card/journey screenshots and DOM bounds pass at all four agreed desktop sizes.

## Sources of truth

Read `shared-contract.md`, reference PNG, visual spec, completed P0–P2 evidence and Phase 3 of the plan. Verify P1's actual acceptance. Reuse the current state callbacks rather than inventing a second mode state.

## Verified starting state

- At research time, `app/(public)/layout.tsx` rendered shared `Header`; its study-oriented hierarchy differed from the concept.
- `PublicPageTail.tsx` already isolates homepage layout by pathname.
- `HistoryExplorer` owns mode, selected event and journey state; `MapTimeControls`/cards expose semantic HTML controls.
- Recheck completed phases before editing; the renderer is not switched by this phase.

## Scope and hard constraints

In scope: homepage shell/components/scoped styling, shared-header selection wrapper and related desktop checks. Out of scope: a site-wide redesign, renderer replacement, event/journey data rewrites, mobile/tablet design or removing secondary routes. Apply the shared security/history/single-agent constraints.

## Relevant files and patterns

- `app/(public)/layout.tsx`, `components/layout/Header.tsx`, `PublicPageTail.tsx`.
- Proposed `components/layout/PublicPageHeader.tsx`, `HomeAtlasHeader.tsx`.
- `components/explorer/HistoryExplorer.tsx`, `MapTimeControls.tsx`, `MapEventCard.tsx`, `JourneyPanel.tsx`, `explorer-map.css`.
- `tests/e2e/home-cinematic-globe.spec.ts` and existing public homepage/a11y tests.

## Work item — replace dashboard-like framing with atlas hierarchy

**Problem:** The old shared masthead and heavy bottom rectangle overpower the map and differ visibly from the reference even if the Earth renderer improves.

**Required change:** Follow Phase 3. Render `HomeAtlasHeader` inside `HistoryExplorer` with existing mode callbacks; suppress only the shared root header through `PublicPageHeader`, preserving other routes. Keep the brand, two modes and a compact secondary route entry. Add the initial guidance panel; replace it on event/journey selection. Lighten the time rail/card treatments, use the existing Vietnamese-capable fonts and meaningful focus styling. Avoid duplicate mode buttons and custom event buses.

**Acceptance:** One `main`, one `h1`, accessible skip link, keyboard paths and event list remain. The closed default page fits vertically and has no horizontal overflow at 1280×720, 1366×768, 1440×900 and 1920×1080. No interactive controls overlap; expanded reading content scrolls within its panel. The map's intended safe area remains available, and a representative detail/study route retains the old shared header.

**Verification:** DOM bounds, real default/card/journey captures, keyboard/focus and contrast inspection, relevant public desktop E2E and shared full gate. Do not add trivial unit tests that assert each CSS value.

## Deliverables and stop conditions

Return the four-size screenshots, shell diff, navigation/a11y evidence, deviations and local P3 report. **STOP at P3.** Do not migrate the renderer or begin Phase 4.

## Final recap

Deliver the concept's homepage hierarchy with working existing controls, preserve other routes, and stop after P3.
