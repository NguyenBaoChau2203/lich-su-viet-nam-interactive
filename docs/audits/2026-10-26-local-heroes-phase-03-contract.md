# Local revolutionary heroes — Phase 03 implementation addendum

Date: **2026-10-26, Asia/Bangkok**. Authority: owner-invoked Phase 03, approved **LH-1.0.0-draft.1**, and [Phase 02 handoff](2026-10-26-local-heroes-phase-02-handoff.md).

This addendum records the admin and reviewer UI implementation of the [frozen Phase 00 contract](2026-10-26-local-heroes-contract.md). It preserves all schema definitions, atomic database invariants, and research package bytes.

## Implemented UI and workflow entry points

| Module | Component / function | Purpose |
| --- | --- | --- |
| `components/admin/forms/FigureForm.tsx` | `FigureForm` | Extended existing form to support both noncatalog figures and national catalog figures with `is_local_hero` toggle, field-level error mapping, and action-state preservation. |
| `components/admin/figures/FigureCatalogEditor.tsx` | `FigureCatalogEditor` | Coordinates catalog readiness display, contribution summary, contribution start/end year, aliases, and child sub-editors. Serializes payload to `catalog_graph_json` and `expected_revision`. |
| `components/admin/figures/LocalityEditor.tsx` | `LocalityEditor` | Form rows for managing locality relationships across the 34 reference localities, relationship kinds, historical place labels, source locators, certainty, and uncertainty notes. |
| `components/admin/figures/StoryEditor.tsx` | `StoryEditor` | Story authoring with live word-count tracking (350–700 words for primary story), citation markers (`[[cite:ref_key]]`), summary, and scoped story citations. |
| `components/admin/figures/CatalogSourcesEditor.tsx` | `CatalogSourcesEditor` | Authoring required figure claims: identity verification, revolutionary contribution, and contribution period (1858–1975). |
| `components/admin/figures/MediaEvidenceEditor.tsx` | `MediaEvidenceEditor` | Managing media evidence: depiction kind (portrait vs context), acceptance decision (accepted vs held), identity source, and usage basis (open license, public domain, permission, coursework reference). |
| `lib/actions/content.ts` | `saveFigureAction` | Dispatches catalog figure submissions to `saveLocalHeroGraph` atomically, preserving noncatalog figure behavior for legacy records. |
| `app/quan-tri/(noi-bo)/noi-dung/[loai]/[id]/page.tsx` | `EditWorkflowContent` | Loads `getLocalHeroAdminGraph` for catalog figures and passes catalog graph, sources, and media to `FigureForm`. |
| `lib/queries/figures.ts` | `FigureDetail`, `loadFigureDetail` | Extended `FigureDetail` with catalog contribution, localities, and stories. Staff review preview (`publishedOnly=false`) loads draft stories; public queries (`publishedOnly=true`) strictly hide unapproved content. |
| `components/content/detail/FigureDetailView.tsx` | `FigureDetailView` | Renders contribution summary, associated localities, and sourced historical stories in both preview and public views. |
| `tests/unit/local-heroes-admin.test.ts` | Unit suite | Comprehensive unit tests for draft saving, validation, CAS concurrency, readiness gaps, review transitions, and role enforcement. |
| `tests/e2e/admin-local-heroes.spec.ts` | E2E Playwright suite | Browser journeys across 4 desktop viewports (1280x720, 1366x768, 1440x900, 1920x1080), accessibility, and auth guards. |
| `playwright.local-heroes-admin.config.ts` | E2E configuration | Dedicated configuration for disposable-environment admin testing. |

## Contract adherence

1. **No Competing Routes or Person Identity**: Uses the existing `/quan-tri/noi-dung/nhan-vat/[id]` and `/quan-tri/kiem-duyet/nhan-vat/[id]` routes and existing `historical_figures` records.
2. **Preserved Noncatalog Behavior**: Noncatalog figures continue to use `figureSchema` and `saveRecord` without alteration.
3. **Strict CAS Revision Matching**: Submissions require `expectedRevision` matching `local_hero_revision`. Stale edits produce clear `STALE` errors with instructions to reload.
4. **Readiness Invariants**: Incomplete catalog data cannot be submitted for review or published.
5. **Single-Agent Implementation**: All planning, implementation, self-review, and documentation executed by one main agent inline.
