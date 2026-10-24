# Country boundaries on the cinematic globe — proposed extension

Date: 2026-10-24. Status: proposed design for the owner's requested country-boundary improvement; no rendering/data change implemented by the review task.

## Intent and scope

Complete the map's atlas-like appearance with subdued borders between neighboring countries while keeping Vietnam and historical event lights visually dominant. Reuse the cinematic Earth the owner has just reviewed as broadly satisfactory.

The current request is about the existing globe. `AGENTS.md` still names an earlier 2D homepage spec, while later owner requests and the current implemented cinematic slice establish the subject of this review. This extension does not roll back to a 2D map or recreate the old raised tabletop. It changes only country-boundary context on the current scene; the original historical/source/accessibility restrictions still apply.

Sources of truth: latest owner request, repository rules, this proposed extension, `docs/audits/2026-10-24-country-boundaries-globe-review.md`, and the implemented cinematic slice. The generated concept is an appearance reference, not a geometry source.

## Approaches and recommendation

| Approach | Benefit | Cost / decision |
| --- | --- | --- |
| Dedicated Natural Earth 50m international-land line overlay | Separate from imagery, no extra country fills or duplicated coastlines, appropriate detail near Vietnam | Recommended. Needs a line parser/helper, one scene layer and an explicit geography-budget change. |
| 110m version of the same line layer | Approximately 23 KiB compact gzip in this review; fits the old 500 KiB total cap | Fallback if the old cap must remain. More generalized near Vietnam; requires a visual comparison rather than silently substituting it. |
| Outline complete world country polygons or bake lines into Earth textures | Can create visible country shapes | Rejected for this extension: duplicating shared/coastal edges, heavier geometry or texture coupling, poor independent style control, and unnecessary rework. |

No alternative has been selected by the owner in this review turn. The 50m source, style and budgets below are the agent's recommended execution design. No new npm dependency is required.

## Data contract and interpretation

Use `geojson/ne_50m_admin_0_boundary_lines_land.geojson` from Natural Earth repository tag `v5.1.2`; the publisher catalog identifies this layer as version 5.1.0. Record publisher, catalog/data/terms/policy URLs, access date, original hash, transformations and output hash.

Normalize only lines; preserve open LineStrings, disconnected MultiLineStrings and source IDs. Keep `sourceId`, `sourceClass` and `viewClass` on output features. Resolve `viewClass = FCLASS_VN ?? FEATURECLA` before stripping upstream properties. Include only `International boundary (verify)` in the initial solid layer; record all omitted classes/IDs. Missing/unknown classification must not default to ordinary.

Do not load maritime supplements, control/claim lines, internal administrative borders or labels. Do not add a political labeling interface. Existing curated place/event labels remain the only labels.

Map-source copy inside `Nguồn bản đồ` must identify modern generalized land boundaries and this limited classification policy. Suggested copy: `Đường biên giới đất liền hiện đại, khái quát theo Natural Earth; không tái dựng biên giới theo năm đang chọn. Một số đường có phân loại chưa chắc chắn trong nguồn được lược bỏ.` Retain the current Vietnam/mainland/island/approximate-coordinate disclosures.

## Rendering design

- Add one batched country-line object to the existing scene. Earth, texture, light, atmosphere, camera, Vietnam cap/outline and HTML overlays remain in place.
- Use the installed Three `LineSegments2` / `LineSegmentsGeometry` / `LineMaterial`, already used for the Vietnam outline. Keep width in CSS pixels and update material resolution on initial attach and resize.
- Start from 0.7–0.85 CSS px at the default overview, 0.5–0.65 at world distance and at most 1.0 at useful local zoom. Vietnam's existing 1.5 px gold outline remains stronger. These are proposed tuning ranges, not a demand to alter the current Vietnam style.
- Use subdued warm slate, initially around `#56605a`, rather than the bright Vietnam gold. Prefer an opaque low-luminance stroke to stacking translucent round segment caps into bright junction beads; assess a transparent alternative only with real joint screenshots. No country-line bloom, flashing or animated dash effects.
- Proposed unit-sphere radius `1.0002`, below the existing Vietnam cap/outline and above Earth, with `depthTest: true`, `depthWrite: false`. Start render order between Earth and Vietnam highlight. Check actual geometry/material sorting; render order alone cannot replace depth occlusion.
- Subdivide long source segments onto the sphere with maximum angular step 0.25°. Preserve the shortest geographic arc across ±180°; do not close open lines or connect separate parts. Reject degenerate/non-finite input safely.
- Verify Vietnam shared land edges remain clean. The 50m context and existing finer Vietnam geometry can differ; if a visible parallel gray/gold edge remains, use a source-aware, bounded suppression/clip of that shared edge. Do not remove every feature inside a latitude/longitude box or redraw the gold outline to match a coarser source.
- Borders are passive WebGL geometry. They must add no focus target, HTML hit layer or pointer interception. Do not change label/click clustering or fit the camera around all country boundaries.

## Loading and lifecycle

The new boundary asset is optional context. Fetch/validate it concurrently without adding it to the core blocking `Promise.all`. Allow the existing scene to become ready first, then attach the accepted result to that same scene and request one redraw. Provide a minimal `setCountryBoundaries(data | null)` scene method rather than mounting a second canvas or rebuilding Earth.

Use the current attempt's AbortSignal and a stale/disposed guard. Failed/malformed/slow border data must leave core rendering/events usable. Late data from an old attempt cannot attach to a replaced or disposed scene. Dispose border geometry/material on replacement/unmount; do not keep an animation loop alive for static lines.

Expose only enough diagnostic state to verify `loading`, `ready` or `unavailable` and segment count. This is test/audit metadata, not a new user-facing developer panel. Optional failure can be described in map sources; it must not trigger the existing fatal renderer error UI.

## Proposed budgets

| Item | Proposed acceptance |
| --- | --- |
| Added country-boundary compact gzip payload | ≤150 KiB |
| Total runtime geographic JSON/GeoJSON | ≤600 KiB, explicitly superseding 500 KiB for this extension only |
| Rationale | Review estimate: current 443.77 KiB + candidate 129.40 KiB ≈573.17 KiB |
| New runtime dependency / Earth images | None |
| Added boundary draw calls | At most one batched draw call |
| Segments / added geometry buffers | ≤60,000 line segments; report actual buffer allocation, target ≤4 MiB |
| Flight frame intervals | Retain median ≤33.3 ms and p95 ≤50 ms on a recorded laptop/browser run |
| Settled idle / hidden page | Zero continuing globe draws/rAF after settling; existing hidden/cancellation behavior preserved |

The new total is a proposed product tradeoff, not a measurement already achieved. Update the budget test to count the new asset rather than keeping an old three-file sum. If 500 KiB is required, choose the 110m fallback deliberately and reassess alignment. Do not delete Vietnam geometry or its island coverage to make room.

## Visual and behavior acceptance

At 1280×720, 1366×768, 1440×900 and 1920×1080, assess default Vietnam view, world view, a selected event card and a European journey stop. Compare the same camera states with boundaries present and the optional asset blocked, plus the original concept. Inland neighboring-country separation must be visible without changing the dominant Vietnam/event hierarchy.

Require readable labels, unchanged control/hit bounds, no doubled/beaded edges, no long seam-spanning chords, and no far-side lines visible through Earth. Test optional 404, malformed data and delayed response during navigation/retry. Existing event/filter/detail/URL/flight/restoration/no-JS/no-WebGL cases remain gates.

No new historical events, historical-border reconstruction, province layers, country name labels, texture-resolution expansion, camera redesign, mobile/tablet work or deployment is included. Report the close-zoom texture limitation already known from P6 rather than silently expanding this task to solve it.
