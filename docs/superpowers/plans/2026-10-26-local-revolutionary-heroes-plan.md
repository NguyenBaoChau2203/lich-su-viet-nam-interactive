# Local Revolutionary Figures Implementation Plan

> For execution: use `superpowers:executing-plans` inline when available. One main agent performs implementation, self-review and verification for each owner-invoked phase. Do not spawn subagents or call another AI model automatically.

**Status:** Phase 00 contract **owner-approved on 2026-10-26**. The owner subsequently asked this main agent to continue Gemini's partial Phase 01. The research package is frozen at manifest v14 and owner-approved on 2026-10-26: 53 nominees, 35 proposed selected people, 2 complete research records, 33 selected records incomplete and 18 held people. All 34 localities have a directly sourced qualifying candidate; national release readiness remains blocked. The actual roster/hash approval gate before Phase 02 is **met**; see [owner approval evidence](../../audits/2026-10-26-local-heroes-phase-01-approval.md). Phase 02 is to be invoked separately in a new chat. No feature code has been implemented. Approved contract revision: **LH-1.0.0-draft.1**, [contract](../../audits/2026-10-26-local-heroes-contract.md), [JSON Schema](../../audits/2026-10-26-local-heroes-manifest.schema.json), [Phase 01 handoff](../../audits/2026-10-26-local-heroes-phase-01-handoff.md).
**Goal:** Add locality-based revolutionary figure discovery with sourced stories and images to the existing homepage; the first release must cover all 34 reference localities and its complete accepted national roster.
**Architecture:** Extend the existing figure/admin/media slice and current cinematic explorer. Read published data on the server, isolate the new client interaction, reuse person detail, and maintain a single explorer/history state owner.
**Tech stack:** Installed Next.js 16.3.8 App Router, React 19.2.8, strict TypeScript, Tailwind 4 and existing Supabase/Postgres/test tooling; no new dependency is proposed.
**Spec:** `docs/superpowers/specs/2026-10-26-local-revolutionary-heroes-design.md`.
**Prompt package:** `docs/prompts/local-revolutionary-heroes/`.
**Baseline:** `6a38f58`, fetched `origin/main` equals local `main` on 2026-10-26; work branch `feat/local-revolutionary-heroes`.

## Global constraints

- Use the owner-approved LH-1.0.0-draft.1 design/contract and the owner-approved Phase 01 roster/hash recorded in the versioned approval evidence. The owner authorized continuation of Gemini's partial Phase 01, then approved the actual v14 roster/hash after its handoff. This follow-up records approval and prepares a new-chat handoff; Phase 02 executes only when invoked there.
- Honor the owner's confirmed requirement: every province/city must be covered in the first release. Internal samples do not constitute a regional public pilot.
- Preserve the current cinematic homepage globe and established event/journey/URL behavior.
- Use the existing `/nhan-vat/[slug]` route, figure identity, media and content workflow.
- Desktop CSS viewports are 1280×720, 1366×768, 1440×900 and 1920×1080.
- Do not invent claims, formal honors, locality relations, portraits, source pages, licenses or coordinates.
- Keep research packages draft-only. No remote write, publication, push, merge, PR or deploy is authorized by this plan.
- Preserve all pre-existing untracked owner documents/images, Word files, environment files, secrets and unrelated modules.
- Use one agent per phase; switch models only through the owner's explicit selection for the next phase.
- For product logic, prove a focused failure, implement, run the test again, then self-review. Do not add tests that merely mirror static markup.
- Read installed Next.js guides before code, current Supabase documentation before schema/access changes.
- Run `pnpm verify` before each phase handoff; additional database/browser checks are mandatory where applicable.
- Do not commit unless the owner separately requests it; leave explicit changed paths ready for review.

## Model allocation and evidence

| Model setting | Documented fit | Assigned work | Boundary |
| --- | --- | --- | --- |
| Gemini 3.8 Flash, High | Software engineering, image/PDF input, structured output, search grounding, efficiency | Source/media research, bounded admin/detail UI, nationwide editorial batches | Must verify sources and consume frozen interfaces; no authority to certify historical truth from model recall |
| GPT-6.1 Sol, Max | Complex coding/professional work; `max` supported | Architecture, DB/RLS/atomic mutations, explorer lifecycle/URL, final self-review and acceptance | Must prove behavior and permissions with tests; extra reasoning is not proof |

Sources: [Google model page](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash/), [Google thinking](https://ai.google.dev/gemini-api/docs/thinking), [OpenAI model page](https://developers.openai.com/api/docs/models/gpt-6.1-sol), accessed 2026-10-26.

The split is an engineering recommendation, not a verified quality/cost comparison on this repo. No undocumented speed ratio, benchmark score or estimated token bill is asserted. Keep `High` and `Max` as the owner's requested settings; do not silently replace either model. These are execution models, not AI features to add to the website.

## Review focus

| Risk/input | Required behavior | Owning phases |
| --- | --- | --- |
| One person associated with several provinces, historical names or commemoration | Accurate typed relationships and distinct-person counts; no inferred birthplace | 00, 01, 02, 06 |
| Last source/story/image removed or concurrent promotion/revision | Ineligible content cannot remain in the public catalog; protected legacy content stays readable | 02, 03, 07 |
| Journey playing, then people mode, search, detail and browser Back | One state/camera owner; no auto-resume; exact filter restoration | 04, 05, 07 |
| Broken image, unknown portrait identity, missing license, disputed date | Honest labels/fallbacks, held content when required, no fabricated substitutions | 01, 02, 05, 06, 07 |
| Accented/alias queries, malformed URLs, empty/error data, no JS/WebGL | Safe normalized state, useful SSR paths, no private data leakage | 02, 04, 05, 07 |

## Phase sequence and gates

| Phase | Model | Dependency | Concrete output / exit gate |
| --- | --- | --- | --- |
| 00 — Confirm scope and freeze contracts | GPT-6.1 Sol Max | Current proposal | Contract/schema/test interfaces approved 2026-10-26; Phase 01 deferred for the owner to invoke another model |
| 01 — Research national roster and images | Gemini 3.8 Flash High | 00 approved | All 34 inventoried; bounded nominations and decisions, claim/media ledgers, hashed draft manifest; actual roster names/hash presented for owner approval before Phase 02 |
| 02 — Build data, security and server contracts | GPT-6.1 Sol Max | 00 + 01 | Additive migration, constraints/RLS, typed queries/actions, content validator, local DB allow/deny tests |
| 03 — Extend content administration | Gemini 3.8 Flash High | 02 | Draft → review UI for locality/story/source/image editing; backend permission checks and preview preserved |
| 04 — Integrate homepage discovery | GPT-6.1 Sol Max | 02 + 03 | Locality/search/pagination in homepage, coordinated explorer lifecycle, safe shareable URLs and fallbacks |
| 05 — Complete figure stories and gallery | Gemini 3.8 Flash High | 04 | Existing figure route renders sources/stories/localities/credits and restores homepage context |
| 06 — Complete national first-release content | Gemini 3.8 Flash High | 05 internal flow works | All 34 localities have complete person/story/image records and every accepted first-release roster item is processed; repeat prompt per batch |
| 07 — Audit, reconcile and prepare release | GPT-6.1 Sol Max | 00–06 outputs | Direct source spot/full risk checks, local transactional rehearsal, RLS/browser/performance/full gate, release-readiness report |

Phases execute sequentially, including repeat runs of Phase 06. If Phase 06 has source gaps, Phase 07 may audit partial readiness but must not mark the first release ready. There is no partial-locality public release checkpoint.

## File map

Existing files to inspect and extend only as needed:
- `app/(public)/page.tsx` — separate event/people loading and failure handling.
- `components/explorer/HistoryExplorer.tsx`, `components/explorer/explorer-map.css` — discoverability, mutually exclusive panels, focus and lifecycle.
- `lib/explorer/map-state.ts`, `lib/explorer/url.ts` — safe shared/return URL integration.
- `app/(public)/nhan-vat/[slug]/page.tsx`, `lib/queries/figures.ts`, `components/content/detail/FigureDetailView.tsx` — existing detail and preview.
- `components/admin/forms/FigureForm.tsx`, `components/admin/MediaManager.tsx` — existing editing/media patterns; Phase 00 verified the actual forms subdirectory.
- `app/quan-tri/(noi-bo)/noi-dung/[loai]/[id]/page.tsx` — existing generic editing route.
- `lib/actions/content.ts`, `lib/actions/review.ts`, `lib/admin/readiness.ts`, `lib/admin/review.ts`, `lib/queries/admin-content.ts` — editor/reviewer state, readiness and source protection.
- `lib/validation/content.ts`, `lib/database.types.ts`, `lib/media.ts` — validate/generate/extend existing contracts without breaking consumers.
- `lib/explorer/cinematic/province-boundaries.ts` and the dated province provenance/membership audit — canonical code framework and its limitations.

Proposed new feature files, finalized in Phase 00:
- `lib/local-heroes/types.ts` — public DTOs, separate certainty/workflow types.
- `lib/local-heroes/admin-types.ts` — exact serializable graph commands, previews, readiness and results from contract sections 7–8.
- `lib/local-heroes/localities.ts` — small code/slug/name registry sourced from the audited framework; not a geometry download.
- `lib/local-heroes/state.ts` — pure query normalization and URL serialization.
- `lib/local-heroes/validation.ts` — feature-specific input/content validation.
- `lib/queries/local-heroes.ts` — server-only page/count/detail queries.
- `lib/queries/local-heroes-admin.ts` — session-only graph preview; never a public cache/DTO.
- `lib/actions/local-heroes.ts` — role-checked atomic draft/story/relation commands.
- `components/explorer/LocalHeroesPanel.tsx` — accessible bounded result panel.
- `components/local-heroes/LocalHeroList.tsx`, `LocalitySelect.tsx`, `StorySections.tsx` — focused presentation units; do not create a component for every wrapper.
- `components/admin/figures/` — relation/story/source editors only where the existing form would become unwieldy.
- `supabase/migrations/<CLI-generated-name>_local_hero_catalog.sql` — generate via installed CLI; never edit an applied migration or choose an earlier timestamp than existing migrations.
- `supabase/tests/local_heroes.sql` — actual constraints and role allow/deny tests.
- `supabase/content/local-heroes/` — versioned draft manifests/claims/media/coverage; no production fallback.
- `scripts/content/check-local-heroes.mjs` — deterministic offline shape/provenance/reference validator with documented command.
- `tests/unit/local-heroes-*.test.ts` and `tests/e2e/home-local-heroes.spec.ts` / `figure-stories.spec.ts` / `admin-local-heroes.spec.ts` — behavior tests with distinct fixture and DB evidence.
- `tests/rls/local-heroes-concurrency.mjs` — two real local DB sessions; no fixture permission claim.
- `playwright.local-heroes.config.ts`, `tests/e2e/local-heroes-catalog-server.mjs`, `scripts/agent/local-heroes-e2e.mjs`, `tests/e2e/fixtures/local-heroes/` — public read-only fixture on 54329, app on 3114, isolated .next-local-heroes output; owned by Phase 04.
- `playwright.local-heroes-admin.config.ts` — disposable-local admin E2E only, owned by Phase 03 and excluded from public fixture collection.
- `docs/content/local-heroes/` — sourced ledgers and per-batch research reports.
- `docs/audits/2026-10-26-local-heroes-contract.md` — Phase 00 frozen handoff contract.
- `docs/audits/local-heroes-release-readiness.md` — final fresh evidence and remaining blockers.

Files above are proposed outputs, not claims that they currently exist.

## Phase 00 — Confirm the feature contract

**Prompt:** `00-contract-gpt61-sol-max.md`.
**Consumes:** current source, proposed design and owner's corrections.
**Produces:** concrete proposed design + exact type/SQL/action/state/schema contracts for owner review. Approval is a separate recorded owner decision.

- [x] Trace figure detail, admin workflow, source RLS, media ownership, explorer return URLs and current tests; contract evidence E01–E14.
- [x] Distinguish confirmed national coverage from recommendations; verify all 34 code/name pairs and freeze slugs. Define the finite selection process; actual candidate names remain Phase 01 research.
- [x] Resolve draft submission, atomic promotion, relation/source/media guards, reverse invariants, CAS revisions and safe legacy defaults as a concrete proposal.
- [x] Freeze public queries/DTOs and serializable admin commands/results in contract sections 7–8.
- [x] Freeze strict JSON schemas, manifest hashing/coverage arithmetic, page size 12 and URL keys.
- [x] Record homepage/detail SSR GET paths, read-only data GET endpoint, one history/camera owner and stale-request rules.
- [x] Specify all five review-focus tests with owners and exact isolated public/admin/DB commands; explicitly separate unimplemented feature checks from current baseline evidence.
- [x] Owner approved LH-1.0.0-draft.1 on 2026-10-26 without scope amendments. At that earlier checkpoint Phase 01 was deferred for another model; the owner subsequently invoked Gemini and authorized this main agent to continue its partial work.

The preceding checkbox records the earlier Phase 00 follow-up. The owner later invoked Gemini and explicitly requested continuation of its partial work here; see the current status and Phase 01 handoff for the superseding instruction.

Fresh Phase 00 baseline commands and document checks are recorded in the versioned handoff. Browser/GPU feature performance is not measured by a documentation-only verification gate.

## Phase 01 — Research the national first-release roster

**Prompt:** `01-national-research-gemini38-flash-high.md`.
**Consumes:** confirmed policy and manifest schema.
**Produces:** draft national catalog and source/claim/image ledgers covering the research state of all 34 localities and the accepted first-release roster.

- [x] Identify real candidates using official archives, museums, libraries, institutional biographies and scholarship; 35 proposed selections have directly read eligibility/relation sources.
- [x] Reconcile names/slugs against the nine-row SELECT-only canonical identity snapshot; preserve nine canonical IDs and keep unresolved identities held.
- [ ] Complete identity, contribution, relationship, a primary story and a usable image for **every** selected person: **2/35 complete**, **33/35 carried to the explicit Phase 06 queue**.
- [x] Record original historical labels and supported modern mappings for the 38 accepted qualifying relations; eight inherited relations remain held.
- [ ] Complete image inspection for all selected people: **2 accepted images inspected**, ten inherited image drafts held, other selected people still need images. The two inspected images have source, context, byte/dimension/hash and bounded coursework-use evidence.
- [x] Hold unsupported/disputed requirements and exclude two wrong-page source mappings; do not promote inherited stories/images or guess optional life dates.
- [x] Record sourced qualifying candidates for all 34 localities; two development samples are ready for owner review, with zero new public availability claimed.
- [x] Freeze manifest v14 with 53 distinct nominees, 35 proposed selections and explicit gaps; remaining selected records are assigned to four Phase 06 batches (10/10/10/3).
- [x] Record the bounded two-pass policy and exact schema/hash output; 32 additional locality nominations, with complete sample localities 01/04 exempt. Present [actual names/decisions](../../content/local-heroes/roster.md) and [manifest hash](../../../supabase/content/local-heroes/national-v1/manifest.json) for owner review.
- [x] Owner approved the **actual v14 roster/hash** on 2026-10-26 after the Phase 01 handoff: 35 selected, two complete, 33 selected incomplete, 18 held. See the versioned owner approval record; Phase 00 approval remains a separate earlier decision.
- [x] Self-review claims and JSON/reference consistency: zero offline schema/reference/hash issues, 1,539 semantic assertions and five invalid-data rejection controls passed. Fresh `pnpm history:data:check` passed 42 tests; `pnpm verify` passed agent/history/lint/typecheck, 1,046 tests in 83 files, 26 script tests and the 102-page production build. See the Phase 01 handoff/report for commands and limits; this is not historical certification.

## Phase 02 — Implement secure persistence and server behavior

**Prompt:** `02-data-security-gpt61-sol-max.md`.
**Consumes:** frozen contracts and the national draft package, using a small clearly identified subset for focused development tests.
**Produces:** data/permission/query/action interfaces for phases 03–05.

- [ ] Write focused failing schema/query tests for deduplication, source visibility, publication prerequisites and role denial.
- [ ] Use exact table/constraint/index/trigger/RPC/type names from contract sections 4–8. Test publication failures through raw DB/REST-equivalent calls, not just server actions.
- [ ] Add a migration with safe defaults, FKs, useful indexes, RLS/grants and strict types.
- [ ] Generate migrations with the installed CLI and place after the actual highest existing migration version; the repository already contains future-dated legacy migrations.
- [ ] Implement draft graph saves atomically and publication readiness that can prepare stories and person together without circular deadlock.
- [ ] Prove that source metadata attached only to a public figure/story is visible while unrelated/draft sources remain hidden.
- [ ] Protect source edits and published child records across every mutation path; preserve reviewer status-only rules.
- [ ] Test stale edits, last-required-link deletion, media/source changes and concurrent publication.
- [ ] Implement paginated accent-insensitive/alias search and distinct-person counts at the server; fixed ordering and bounded queries.
- [ ] Validate the available national drafts offline; import/rehearse only in an authorized disposable local environment as drafts.
- [ ] Generate DB types, run `supabase test db` on the disposable target, focused unit tests and `pnpm verify`. No available local DB means an explicit blocked DB gate, not a passing schema claim.

## Phase 03 — Extend administration

**Prompt:** `03-admin-gemini38-flash-high.md`.
**Consumes:** tested Phase 02 actions/types and existing admin workflow.
**Produces:** feature-specific editing/readiness/preview UI.

- [ ] Add catalog eligibility, contribution, locality relationship and claim/source editors to existing figure editing.
- [ ] Add story draft/order/source editing and image evidence fields using existing media ownership.
- [ ] Surface precise readiness reasons for missing sources, unsupported relations, story/media gaps and stale edits.
- [ ] Keep pending/published content read-only for roles that cannot edit it; do not implement UI-only authorization.
- [ ] Test malformed IDs, forged figure/story ownership and denied roles at the server boundary, reusing Phase 02 contracts.
- [ ] Exercise draft → review → request changes → resubmit and reviewer preview locally with test roles.
- [ ] Run focused validations, admin desktop browser cases on a disposable environment, public smoke and full gate.
- [ ] Create playwright.local-heroes-admin.config.ts with the disposable-target guard and prove reviewer relation/source/media forgery and stale saves. Never collect it in the public fixture config.

## Phase 04 — Integrate the homepage

**Prompt:** `04-homepage-gpt61-sol-max.md`.
**Consumes:** paginated public queries, frozen state schema and approved mode design.
**Produces:** working homepage locality → person discovery.

- [ ] Add failing pure state tests: exact round-trip, invalid locality, Unicode/alias search, invalid pages, unrelated event/camera keys and return-URL attacks.
- [ ] Implement normalized state in feature modules; integrate into the existing explorer owner rather than adding another history writer.
- [ ] Load only the requested people page; isolate people failure from event/globe availability.
- [ ] Add selector, search GET form, count, result rows with thumbnails and stable pagination.
- [ ] Pause journey/cancel intro on entry, suppress competing readers, restore snapshot paused on exit and restore focus.
- [ ] Prove search race cancellation, Back/forward/reload/share, last-page clamp and multi-locality distinct counts.
- [ ] Verify DOM + screenshots at four desktop sizes, keyboard/reduced-motion/no-JS/no-WebGL, image/data failure and idle network.
- [ ] Record incremental JS and image/query budgets against baseline; run globe/journey regressions, public smoke and full gate.
- [ ] Create the exact fixture/config/build runner from contract section 11; extend next.config.ts only for the explicit isolated test distDir flag. Add the SSR/API route and runtime suspension prop named in section 9.

## Phase 05 — Complete story detail

**Prompt:** `05-stories-media-gemini38-flash-high.md`.
**Consumes:** eligible profile query and safe homepage return builder.
**Produces:** sourced readable person detail and gallery using the existing route/preview.

- [ ] Add focused detail tests for mixed published/draft stories, missing public sources, contextual-image labels and invalid return links.
- [ ] Extend detail with contribution, locality roles, cited stories and source list in logical reading order.
- [ ] Reuse gallery/lightbox/SafeImage/MediaCredit behavior; do not blindly use legacy uncredited portrait fallback for new catalog acceptance.
- [ ] Keep legacy noncatalog figures and reviewer previews working.
- [ ] Test homepage selection → detail → story/gallery/source → exact return; direct deep link and no-JS readability.
- [ ] Verify four desktop sizes, keyboard, contrast, reduced motion, image failures and metadata; full gate.

At this point the flow can be demonstrated internally with authorized test data. This is not a first-release handoff; all 34 localities and the accepted national roster remain mandatory before release readiness. Public/live content requires a separate explicit publication instruction.

## Phase 06 — Complete national first-release coverage

**Prompt:** `06-national-completion-gemini38-flash-high.md`; repeat serially.
**Consumes:** working internal feature, accepted first-release manifest policy and national coverage ledger.
**Produces:** complete reviewed-ready first-release national content batches, not automatic publication.

- [ ] At each invocation select the next unprocessed batch deterministically: prioritize unrepresented canonical localities, then outstanding accepted roster items; process at most 10 distinct people.
- [ ] Research each candidate to the same claim/story/image standard as the accepted internal examples; prevent duplicate identities/aliases across batches.
- [ ] Update all locality statuses and numerator/denominator counts, distinguishing researched, accepted, draft and public.
- [ ] Carry forward held candidates with explicit source/image gaps. Do not silently shrink the agreed roster.
- [ ] Validate each batch with `node scripts/content/check-local-heroes.mjs` and the full gate; stop after one batch.
- [ ] Repeat until all 34 have at least one complete accepted eligible person with story and image, and every accepted first-release roster item is complete. Documented research decisions alone do not satisfy coverage.
- [ ] Leave the next batch and exact unresolved items in the report. A blocker does not justify invented biographies or images.

## Phase 07 — Audit and prepare local release

**Prompt:** `07-acceptance-gpt61-sol-max.md`.
**Consumes:** all previous handoffs and manifest snapshots.
**Produces:** auditable release readiness, local draft import/rehearsal artifact and exact remaining external steps.

- [ ] Self-review the complete branch diff and public/admin/source access paths directly.
- [ ] Reopen all accepted sources supporting identity, contribution, locality relationship, formal honors and image identity; verify disputed/unstable claims against independent sources.
- [ ] Reconcile accepted roster and actual distinct/locality/story/media counts; separate prepared, locally rehearsed and remotely public counts.
- [ ] Produce deterministic, idempotent draft-only import with explicit expected identities/slugs and transaction rollback on conflict. Never overwrite an unrelated legacy record.
- [ ] Rehearse migrations, role policies, invariant race cases, imports and local promotion on an explicitly disposable DB; record rollback.
- [ ] Run targeted public/admin browser journeys, four viewports, accessibility and performance evidence, regression selection, public smoke and fresh `pnpm verify`.
- [ ] Classify existing unrelated console/network symptoms separately without suppressing errors.
- [ ] Update navigation documentation only for implemented/approved scope, publish the local evidence report, and stop before any remote operation.

## Verification commands and evidence rules

During implementation, run the focused file(s) that own the changed behavior. Proposed feature files become executable only after their creation.

Final base gate for every phase:
```powershell
pnpm agent:status
pnpm verify
git diff --check
git status --short
```

Additional gates once the matching outputs exist:
```powershell
node scripts/content/check-local-heroes.mjs
node scripts/content/check-local-heroes.mjs --package supabase/content/local-heroes/national-v1 --mode release
pnpm exec vitest run tests/unit/local-heroes-state.test.ts tests/unit/local-heroes-query.test.ts tests/unit/local-heroes-content.test.ts
supabase test db --local supabase/tests/local_heroes.sql
node tests/rls/local-heroes-concurrency.mjs --target .task-reports/local-heroes-disposable-db.json
node scripts/agent/local-heroes-e2e.mjs build
pnpm exec playwright test --config playwright.local-heroes.config.ts
pnpm build:smoke
pnpm test:e2e:smoke
```

Discover actual Supabase CLI support/target via `--help` before running. Do not use a linked remote DB as the disposable target. Run build and smoke sequentially, not concurrently against the same output directory. Restore the environment's ordinary build if a smoke fixture build was the final build.

New feature public E2E uses the isolated read-only fixture/config/commands frozen in contract section 11, following the existing journey-catalog separation. Its .next-local-heroes build is separate from ordinary .next and the existing smoke build. Build/test sequentially; no credential or production debug route. Admin/RLS E2E requires a disposable DB with test roles; public fixtures are not permission evidence. The no-argument content validator defaults to research mode; only --mode release checks first-release completeness and roster approval.

Inspect legacy E2E before selecting it. Full `pnpm test:e2e` may create/delete data and is conditional on an explicitly authorized disposable target; never run it blindly against the working remote project.

For UI phases capture meaningful DOM assertions and screenshots, console/network diagnostics, declared browser/device/viewport, and exact pass/fail counts. Distinguish hardware GPU measurements from software-rendered automation.

## Completion and handoff contract

Each phase returns changed paths, decisions, commands/exit codes, source/coverage limitations, screenshot/artifact locations when applicable, a local `.task-reports/YYYY-MM-DD-HHmm-<phase>.md` and a versioned handoff section in its audit/contract.

No phase may mark another phase complete from remembered chat context. Missing approvals, historical evidence, test environment or failed gates are recorded as blockers at the precise boundary. Local code readiness, nationwide coverage and live publication are separate claims.
