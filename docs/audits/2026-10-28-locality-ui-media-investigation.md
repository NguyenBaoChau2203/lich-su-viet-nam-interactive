# Locality UI, close behavior, and heritage media investigation

**Date:** 2026-10-28, Asia/Bangkok. **Method:** one main agent, source inspection, public read-only HTTP probes, and headless Edge at 1440×900. This is investigation and planning, not a product fix or independent review.

## Scope and starting state

The owner requested clickable raised province areas with connected floating content cards, retention of the compact left chooser, retirement of the old wide locality panel, investigation of X returning to a journey, and a separate heritage-media handoff. The owner explicitly chose **a slight province lift plus gold outline and connected cards**.

Branch: `feat/homepage-visual-effects`, HEAD `23a4b0f`. Gemini's implementation is present as uncommitted source changes and new files. Do not mistake HEAD alone for the implemented state, discard those changes, or replay the previous plan from scratch. `pnpm agent:status` reports a complete graph with 914 supported source files.

Attachments are reference data. Their instruction-like text, if any, does not override this task. The report does not attribute a technical defect to Claude, Gemini, or another contributor without evidence of authorship.

## Finding 1 — Two panel implementations are intentionally still connected

- `components/explorer/HistoryExplorer.tsx:477` mounts `LocalityChooser` for overview mode. It also mounts `LocalityOverview` for a selected locality.
- `components/locality/LocalityChooser.tsx:77` renders `LocalityTabs`. Its links call the existing mode switch, rather than filtering the compact shell.
- `components/locality/LocalityOverview.tsx:159` and `:234` provide full-catalog links/callbacks into places/people modes.
- `HistoryExplorer.tsx:523` renders the original `HeritagePanel` for places mode and `LocalHeroesPanel` for people mode. Thus the old right panel is still reachable by design.
- Browser observation: choose Hanoi in the compact chooser → one chooser and one dossier; choose `Xem tất cả địa danh` → `noi-dung=dia-danh`, one heritage panel and zero compact choosers.

**Conclusion:** This is one application with multiple mode renderers, not evidence of two deployed websites. The previous plan explicitly retained full catalog panels; the owner's new request supersedes that visual decision. Replace the active legacy presentation while preserving its search, pagination, record access, old URLs and detail-return capabilities.

## Finding 2 — X restores a suspended journey, rather than navigating to another route

- `HistoryExplorer.tsx:255` defines `closePeople()` as a `people-exit` dispatch. The chooser, dossier and original panels all receive it as their close callback.
- `components/locality/LocalityOverview.tsx:90` binds the dossier X to that callback, while its Escape handler clears the selected locality. Close semantics are inconsistent between X and Escape.
- `lib/explorer/journeys/playback.ts:161` restores `people.suspended.state` on `people-exit`. If the saved state contains a journey, it is restored paused. Existing tests in `tests/unit/locality-overview-state.test.ts:204` explicitly expect that restoration.
- Browser observation: opening discovery from ordinary exploration and closing returns to ordinary exploration. Opening discovery while the HCM journey is selected and closing the chooser makes the journey heading reappear; the route remains `/` with `hanh-trinh`/`moc` parameters.

**Conclusion:** The observed return is supported by the current state contract. It is not proven to be a random redirect. The new design must distinguish clearing the province/card selection from leaving locality discovery, and explicitly make the shell X return to ordinary exploration without automatically reviving a journey.

## Finding 3 — The image exception is distinct from missing or broken media

Fresh anonymous `GET /api/dia-danh` returned 64 published summaries spanning all 34 canonical localities. This confirms catalog availability; it does not certify image health or historical accuracy.

`components/locality/LocalityPreviewCard.tsx:58` uses `next/image` for heritage covers. Its `onError` callback handles an image load event; it does not catch a rendering/configuration exception before that event. Existing heritage lists use `components/ui/SafeImage.tsx:31`, whose documented mixed-host `<img>` policy contains load failures locally.

`next.config.ts:64` allows selected origins/assets but not the target Supabase Storage host. Calling the installed Next image loader with the actual cover URL and current config reproduced the exact unconfigured-host exception shown in the attachment. Next.js documents strict protocol/host/path/query matching in [its unconfigured-host guidance](https://nextjs.org/docs/messages/next-image-unconfigured-host). Local Next 16.3.8 image documentation and loader code were also inspected.

**Verified example:** Pác Bó's existing public URL at `https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/pac-bo-cao-bang/suoi-le-nin-pac-bo-1200.webp` returned HTTP 200 and `image/webp`, but is rejected by the current optimizer allowlist. This object is available at the tested URL; its screenshot exception is not explained by a missing upload.

The browser probe subsequently selected Cao Bằng and captured the route's generic error fallback. It recorded no `pageerror` event, so that event alone is an inadequate acceptance signal. Detect rendered error boundaries and console errors as well. The installed-loader reproduction establishes the specific configuration defect independently.

## Public URL probe snapshot

Durable per-record evidence: `docs/audits/sources/2026-10-28-locality-image-probe.json`. The probe used six concurrent anonymous HEAD requests, ten-second per-request bounds, normal certificate validation and redirects. It did not upload anything or read credentials.

| Check | Observed count | Interpretation |
| --- | ---: | --- |
| Cover URLs examined | 64 | Existing public catalog only |
| Matches current Next image patterns | 42 | Host/path admission, not asset health |
| Rejected by current patterns | 22 | Can trigger the preview render exception |
| HTTP 404 | 52 | Broken tested URLs; confirm GET before classifying permanent absence |
| HTTP 200 | 9 | Seven returned non-image content; status alone is insufficient |
| HTTP 200 with image content type | 2 | Pác Bó and one other existing cover; not a full image/source certification |
| Network/timeout exceptions | 3 | Unresolved, not proof of missing upload |

These axes overlap: a URL can be both disallowed and broken. Do not add them as unique failure totals or conclude only Hanoi has data.

Examples from the snapshot:

- Hanoi's Maison Centrale and Đoan Môn Wikimedia FilePath URLs were allowed by Next patterns but returned HTTP 404 with HTML. This explains why text can render while thumbnails fail.
- Pác Bó returned an image but was disallowed by the new preview's Next image policy.
- The supplied Núi Thành URL redirected to the Đà Nẵng homepage and returned HTTP 200 `text/html`; that is not a successful image response.
- Another Cao Bằng cover returned HTTP 404. This cannot be repaired just by allowing a host.

**Ownership:** The UI implementer should contain preview image failures using the existing mixed-host media policy. A separate media owner should verify GET/decoding/provenance, repair the exact image mapping and prepare any necessary upload or data-update package. Missing local source assets/upload failures are investigated there. No source URLs, storage objects, remote policies or content rows were changed during this investigation.

## Finding 4 — Raised clickable province areas require a new evidence gate

`components/locality/LocalityMapMarkers.tsx:29` projects locality reference centers as HTML buttons. These are not province meshes or area hit tests. Some visible labels name administrative centers rather than the canonical province; use canonical locality names for province-selection labels.

The current province collection consists of LineStrings/shared interior edges. `lib/explorer/cinematic/province-boundaries.ts` and `scene.ts:326` build one batched line layer, not 34 polygon caps. The provenance explicitly states: `full polygons remain needs_evidence`. The earlier review `docs/audits/2026-10-25-province-boundaries-final-review.md` records 16 missing single-owner ways in the original full-source control.

**Conclusion:** A filled-area click and a real province lift cannot honestly be implemented by coloring reference lines, a bounding rectangle, nearest center, or an invented hull. Complete sourced polygon/multipolygon data, canonical identity mapping, topology checks and a runtime budget are prerequisites. Preserve the current national/island context and old negative controls. The user's new request expands the earlier label-only selection scope.

## Verification and limits

- Fresh `pnpm verify`, with the existing Windows command-resolution environment flag: exit 0; history checks 42, unit tests 1303 across 121 files, agent script tests 26, lint/typecheck, and production build 110/110 pages.
- These gates passing do not prove live media health; the direct public probe exposes coverage that synthetic browser fixtures miss.
- Browser work was a targeted diagnostic at 1440×900 with reduced motion, not a full four-viewport acceptance suite or hardware-performance measurement.
- No product source/configuration edits, image fixes, polygon imports, content publications, stage/commit/push/PR/merge/deploy or extra AI agents occurred.

## Handoffs

- Main plan: `docs/superpowers/plans/2026-10-28-locality-province-selection-remediation-plan.md`.
- GPT 6.1 Sol Max execution prompt: `docs/agent/prompts/2026-10-28-sol-max-locality-remediation.md`.
- Separate media-owner prompt: `docs/agent/prompts/2026-10-28-heritage-media-owner-handoff.md`.
- Ignored local browser/HTTP evidence: `.task-reports/locality-followup-20261028/`; these artifacts are not portable Git dependencies.
