# Cinematic history globe — visual upgrade proposal

Date: 2026-10-23. Status: proposed execution design, prepared at the owner's request for Gemini. The owner requested closer fidelity to the attached concept; the new renderer/dependency and this execution breakdown have not yet been individually approved or implemented.

## Purpose and precedence

Help a learner locate a historical event in space and time, open its concise card, and continue to sourced detail or the existing biographical journey. Make the homepage's first impression an immersive historical atlas rather than a study dashboard.

This proposal changes the **visual direction** of `2026-10-23-curated-history-globe-design.md`: a textured Earth, visible atmospheric limb at the default Vietnam overview, larger planetary framing, and a quieter homepage-specific masthead. It does not replace the approved event/journey behavior, historical source rules, URL semantics, or laptop/PC scope. Do not mark either document's proposed rendering work as already delivered.

Read alongside:

- `docs/design/references/cinematic-history-globe/target.png` and its provenance README.
- `docs/audits/2026-10-23-cinematic-globe-source-research.md`.
- `docs/superpowers/plans/2026-10-23-cinematic-history-globe-plan.md`.
- `docs/product/DESKTOP-UI-SCOPE.md`.

## Visual thesis

A dark, quietly lit Earth fills the screen. Vietnam has a thin warm outline and translucent gold surface tint that preserves terrain detail. Small event lights and readable local labels lead into historical stories. Texture and directional atmospheric light create depth; restrained HTML controls provide the reading interface.

The reference is an illustration. Match its composition and material character, not its inaccurate geographic details. No raised country slabs, arbitrary glowing island dots, fake historical borders, or static image with manually placed hotspots.

## States and composition

| State | Camera and Earth | Reading/control layout |
| --- | --- | --- |
| Fresh entry | Full Earth oriented toward Asia, then a finite approach to Vietnam | Masthead and heading readable immediately; `Bỏ qua` available |
| Vietnam overview, default settled state | Large, cropped sphere; visible curved limb in upper/right background; Vietnam fully in the usable reading area | Left heading, initial right guidance panel, thin bottom time rail and lower-right map controls |
| Selected event | Real geographic zoom/pan with selected point visible outside overlays; whole planetary limb may leave view at close range | Right panel replaces guidance; one event card; focus/close/detail return preserved |
| World | Complete navigable sphere, useful for international events | Same modes and readable HTML content; no unrelated global city/POI labels |
| Journey | A controlled flight between the seven existing authored stops; intercontinental transitions show world context | Right milestone panel, compact milestone rail, play/pause/prev/next and sources |
| Reduced motion / unsupported renderer | Instant camera changes or static sourced geography; no autonomous movement | All event links, year controls, manual journey stops and source text remain usable |

**Default 1440×900 composition targets** (CSS pixels; camera presets are calibrated in the prototype, not guessed from a screenshot):

- Masthead 56–64 px high, full width, dark translucent background, fine bottom rule. Brand `LỊCH SỬ VIỆT NAM`; primary modes `Khám phá`, `Hành trình`. Keep study/revision access in one secondary menu/link; do not delete those routes.
- Left reading region: left 32–48 px, top 88–116 px from viewport, width 280–340 px. One serif `h1`, 42–48 px, about two to three lines, plus short helper text. At 1280×720 allow 34–40 px and a narrower block.
- Right panel: right 24–40 px, top 88–112 px, width 300–336 px; fine warm border, dark translucent fill, 4–8 px radius. Initial title `Khám phá một sự kiện`; CTA `Xem hành trình`. Avoid a permanent second card while an event/journey card is open.
- Vietnam's mainland bounding box in the default overview must fall approximately within x=36–62% of viewport width and y=20–72% of viewport height; assess the sourced shape, not the invented proportions of the reference. Allow adjacent island coverage and its disclosure without fabricating features.
- At the default overview, Earth's projected diameter exceeds the viewport height and the curved limb is visibly distinguishable in the upper/right background. Do not accept a small ball centered in empty space or a completely flat-looking country crop.
- Bottom controls occupy at most 104 px at 900 px height and 88 px at 720 px height, excluding a deliberately expanded source/list panel. A thin rail and year marks float over a subtle bottom scrim; no full-width opaque rectangle around the whole timeline.
- Controls and labels must not cover the mainland or selected marker. Track occupied rectangles, including the current card, rather than hard-coding one assumed label exclusion box.
- No horizontal page overflow at 1280×720, 1366×768, 1440×900, 1920×1080. The normal closed-overlay explorer fits vertically; expanded event/source/list content may scroll inside its panel with keyboard access.

## Material and layer requirements

1. Near-black navy space and ocean; subdued slate/olive land with visible surface variation. Suggested initial tokens: space `#030910`, ocean `#071523`, parchment `#ead1a8`, gold `#d8b36b`, body `#d5d7d7`. Tune against actual contrast and screenshots rather than treating these as final sampled colors.
2. Use a georeferenced, label-free Earth day texture. Add restrained normal/bump and water response from a compatible, credited set. Do not paint texture detail onto unrelated flat country polygons.
3. A thin blue-white atmosphere should follow the true limb and light direction, not a constant CSS circle glow. Keep the Vietnam side legible; night lighting is editorial, not a reconstruction of a historical time of day.
4. Stars remain sparse and visible only in space. A procedural seeded star field is acceptable; no new image source is necessary. No moving star streaks, persistent auto-rotation, lens dirt, or heavy bloom as a substitute for material quality.
5. Cloud detail is optional and subordinate. No opaque cloud cover over Vietnam or the active stop; no volumetric cloud dependency in this phase.
6. Vietnam tint is near-surface, translucent, and not extruded. Outline/glow must follow the sourced geometry and remain readable without a bright neon halo. Tiny island points cannot be arbitrarily added for visual balance.
7. Start with quiet coastlines and Vietnam outline. Additional international administrative boundaries require a separately sourced, reviewed layer; they are not needed merely because the generated image drew them.
8. Visible dot about 6–10 px with a restrained halo; interactive target at least 32×32 px. Uncertain coordinates retain a distinct ring/description. Grouping uses projected screen positions and the existing event semantics.
9. Use the existing project fonts if they support Vietnamese; no third-party font download is needed to establish the hierarchy. Give body text at least 4.5:1 contrast, large text and meaningful graphical controls at least 3:1, and visible keyboard focus.

## Architecture boundary

Preferred feasibility path: installed Three.js plus one pinned `three-globe` dependency for geographic objects. Reuse official MIT Earth/custom-material techniques; ship imagery locally with exact provenance. Keep MapLibre as the existing production renderer until the prototype and visual checkpoint pass. A small MapLibre alternative is allowed if it meets the same screenshot/interaction criteria at lower cost; do not run two complete migrations in parallel.

The production boundary remains `EventMapProps`: events, selected event, view, focus request, journey stop, camera request, restore nonce, selection/view/manual-input/arrival/readiness callbacks. Move this type to `lib/explorer/globe-contract.ts` only when integration begins, so HTML controls are not coupled to a rendering library. Keep `HistoryExplorer` as the owner of filtering, URL and journey playback state.

The external URL remains `ban-do=lat,lng,zoom`, not Three.js vectors. Map legacy zoom to a reproducible view extent and maintain its inverse; document a deterministic overview camera bearing/tilt derived from that view. Do not silently persist arbitrary unsaved tilt/roll. Unless separately designed, keep north-up orientation and an application-owned deterministic tilt profile rather than adding free roll. World/Vietnam presets may change visual framing; old bookmarked coordinates must still restore the intended location and useful zoom.

Renderer policy: one live canvas/context, one flight owner, one invalidate/render loop, explicit texture/material/geometry/control/listener disposal. Do not import CDN Three beside npm Three. Prefer a coherent classic WebGL2-capable material path initially; the upstream TSL Earth example requires adaptation, not direct material mixing. Do not add a React 3D framework merely to mount a scene.

## Behavior that must survive

- Time filtering, selected-event clearing, groups, curated labels, uncertainty, HTML event list and detail links.
- Shared URLs, reload, browser back/forward and allowlisted detail return; no arbitrary outside return URL.
- `navigationPending` prevention of camera/filter URL writes canceling an outgoing Next navigation, including a delayed route response.
- `restoreRequest` and active-flight cancellation: exiting a journey or changing history mid-flight cannot later restore the old destination.
- Arrival-then-reading timing, manual-input/hidden-page/reduced-motion pause, paused shared journeys, seven sourced milestones and draft-event link exclusion.
- Loading/error/retry, no-JavaScript event/journey reading and unsupported-WebGL fallback.

No database migration, historical content expansion, quiz work, event-detail simulation rebuild, or mobile redesign is included.

## Visual gates and provisional budgets

Phase 1 must produce real rendered screenshots at 1440×900 and 1280×720, plus a visible side-by-side comparison with the concept. Review six categories: camera/scale, material detail, atmosphere/light, Vietnam treatment/geographic alignment, composition, and readability. Score each 0=absent, 1=partial, 2=meets the explicit target. Require at least 10/12 with no zero, and owner acceptance of the prototype before replacing the homepage renderer. This score is a review aid, not an automated similarity claim or evidence of owner approval.

Provisional engineering budgets for the prototype: compressed geographic assets remain ≤500 KiB; initial globe images ≤3 MiB transferred; all decoded globe textures/derived GPU texture allocations estimated ≤96 MiB, including mipmaps; added geographic utilities/helpers ≤400 KiB gzip and the full cold globe JavaScript, including Three, ≤800 KiB gzip. Measure both: an installed dependency is not automatically cached or already downloaded on the homepage. Start Earth imagery at 4096×2048 or smaller, lower-resolution secondary maps where useful, and pixel ratio capped at 1.5. The executor must measure at the closest supported event zoom: if imagery blurs, use a justified local regional-detail level or cap zoom to useful event selection. Do not promise street-level satellite inspection from a global 4K image.

On a recorded laptop-class/browser configuration, target median rendered-frame interval ≤33.3 ms and p95 ≤50 ms during a repeatable 10-second flight; pause on hidden documents and stop rendering after idle damping settles. These are proposed gates, not measurements already achieved. Include renderer/backend, browser, viewport, device scale, hardware, cold/warm status and method with results. If fidelity requires exceeding them, report the concrete tradeoff at the prototype checkpoint before integration.

## Acceptance record

No new visual checkpoint has been accepted yet. The next implementation agent must record its prototype screenshots, exact dependency/asset choices, review score, unresolved differences, and the owner's actual response. A generated screenshot, a green behavior suite, or this plan's existence cannot substitute for that visual acceptance.
