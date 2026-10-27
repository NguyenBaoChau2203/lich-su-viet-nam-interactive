# Local revolutionary heroes — Phase 02 implementation addendum

Date: **2026-10-26, Asia/Bangkok**. Authority: owner-invoked Phase 02, approved **LH-1.0.0-draft.1**, and [actual Phase 01 v14 approval](2026-10-26-local-heroes-phase-01-approval.md).

This addendum records the implemented interfaces of the [frozen Phase 00 contract](2026-10-26-local-heroes-contract.md). It does not revise its historical policy, first-release denominator, roster or schema artifact. The original contract/schema and all ten research JSON files retain their approved bytes. The implementation was investigated, written, tested and self-reviewed by one main agent.

## Implemented entry points

| Module | Export / behavior |
| --- | --- |
| `lib/local-heroes/types.ts` | The exact public serializable DTOs in contract section 7, including `LocalHeroFilters`, `LocalHeroPage`, `LocalHeroProfile`, `LocalHeroPageResponse` and certainty/workflow/locality unions |
| `lib/local-heroes/admin-types.ts` | The section 8 graph inputs, admin graph, readiness codes and mutation-result union |
| `lib/local-heroes/localities.ts` | `LOCALITIES`: the frozen 34 code/slug/name tuples, with no coordinates |
| `lib/local-heroes/state.ts` | `normalizeLocalHeroQuery(value: unknown): string`; `foldLocalHeroQuery(value: string): string`, re-exported from `normalize.ts`. URL/lifecycle functions remain Phase 04 work |
| `lib/local-heroes/normalize.ts` | Also exports `normalizeLocalHeroFilters`; Unicode code-point query limit 120 and page range 1–999999 |
| `lib/queries/local-heroes.ts` | `getLocalHeroPage(input: LocalHeroFilters): Promise<LocalHeroPage>`; `getLocalHeroProfile(slug: string): Promise<LocalHeroProfile \| null>`; server-only `LocalHeroQueryError` |
| `lib/queries/local-heroes-admin.ts` | `getLocalHeroAdminGraph(figureId: string): Promise<LocalHeroAdminGraph \| null>`; active staff page authorization and session client only |
| `lib/actions/local-heroes.ts` | `saveLocalHeroGraph`, `submitLocalHeroGraph`, `reviewLocalHeroGraph`, `restoreLocalHeroDraft`, each `(input: unknown): Promise<LocalHeroMutationResult>` |
| `lib/local-heroes/validation.ts` | Strict command schemas, UUID/revision validation and result parsing. No client role, workflow override or unknown property is accepted |
| `lib/local-heroes/readiness.ts` | `evaluateLocalHeroReadiness`: structural checks for the intended story selection, independent of published visibility |
| `lib/local-heroes/legacy-workflow.ts` | Existing submit/review/hide/republish/restore adapters dispatch enrolled figures to atomic commands; existing forms select the primary story by default. Phase 03 submits explicit selections and revisions |

Public readers always create an anonymous client and use RPC **GET**, even when a reviewer is signed in. A page makes one RPC for items/count/coverage; its SQL batches claims, images and associations for the selected 12 people. It does not invoke a profile per card. The profile makes one RPC. Staff graph reads make at most seven batched queries, including one story-citation read for all story IDs; no public cache contains this result. Revision values cross the boundary as decimal strings; admin media timestamps normalize to UTC `Z` strings.

Invalid/missing/ineligible profile slugs return null. Database failures throw a sanitized query error; outages are never empty lists or 404s. Mutations return explicit auth/error unions, use the caller's session, map serialization/deadlock errors to `STALE`, and do not replay edits. Successful commands invalidate home, figure detail, figure edit/list and review queue paths after the database response.

The GET route `/api/local-heroes`, homepage controls, URL lifecycle and figure presentation remain owned by Phases 03–05 as specified in the frozen contract. They were not created here.

## Persistence and enforcement

Migration: [`20261031000001_local_hero_catalog.sql`](../../supabase/migrations/20261031000001_local_hero_catalog.sql). The installed CLI created an empty migration; its prefix was advanced after the existing maximum `20261031000000`. No earlier migration was edited.

- Six new tables, the exact registry, additive figure fields/defaults, composite owner FKs, named checks and indexes implement contract sections 4–6. Existing rows default to `is_local_hero=false`.
- All new tables enable RLS and revoke inherited grants before explicit grants. Registry DML is unavailable to application roles. Public source reachability retains the published-event branch and adds eligible figure/story/accepted-media branches.
- Public page/profile functions are `SECURITY INVOKER STABLE`; the four graph commands are `SECURITY INVOKER VOLATILE`. API roles cannot execute the private trigger helpers or access the private schema.
- The transaction advisory lock `(18012,3401)` precedes editorial statement/row locks. Parent revisions/search text are derived after the existing reviewer status-only comparison; caller-supplied revisions/search changes are rejected.
- Deferred graph checks cover parent, source, image and new child mutations, including reverse source paths. Each graph command explicitly defers checks at entry and forces them immediate before returning success.
- Saves preflight OLD/NEW ownership, replace collections in FK-safe order, clear a displaced primary first and reject omission/changes of locked stories. Base sources/media are never deleted as a save side effect.
- Submission validates selected draft stories and the parent together. Review promotes only selected pending stories, hides/restores atomically and clears the appropriate review notes. Every last required source/story/image/locality failure rolls back.
- Enrolled records cannot escape protections by clearing `is_local_hero`; withdrawal uses the workflow commands. Hard deletion of an enrolled parent is denied by the catalog guard; noncatalog deletion paths retain their existing behavior.

An accepted coursework image can have `license=null`. It still needs verified identity/context, its original page, caption/alt/credit/dimensions, a checked timestamp and a scoped policy/attribution usage note. This does not create an open license, upload permission or publication authorization.

## Generated types and legacy compatibility

`lib/local-heroes/database.generated.ts` contains the seven relevant table definitions (six new plus extended figures), eight function definitions and enum dependencies mechanically extracted from fresh local CLI output. `lib/database.types.ts` composes this slice with the existing legacy types and explicitly permits SQL NULL page arguments. Replacing the entire handwritten legacy file would discard unrelated API nullability refinements; those refinements are retained.

Reproduce against the same confirmed disposable target:

```powershell
supabase gen types --local --schema public --workdir .task-reports/local-heroes-phase-02-work/db > .task-reports/local-heroes-phase-02-work/database.generated.ts
node scripts/content/extract-local-heroes-types.mjs .task-reports/local-heroes-phase-02-work/database.generated.ts
pnpm typecheck
```

Noncatalog public figures, source reachability through events, media branches, review transitions and imported study/payment modules are preserved. Schema must precede the corresponding code rollout on any future target; no remote migration or deployment was performed here.

## Offline content interface

```powershell
node scripts/content/check-local-heroes.mjs
node scripts/content/check-local-heroes.mjs --package supabase/content/local-heroes/national-v1 --mode research
node scripts/content/check-local-heroes.mjs --package supabase/content/local-heroes/national-v1 --mode release
```

Stdout is the exact deterministic `ContentValidationResult` from section 10. Exit 0 means structurally valid research, exit 1 malformed/provenance/reference/hash failure, exit 2 unmet release gate, exit 64 invalid CLI usage. Release-mode issues report the state of each of the 34 localities. `representedLocalities` in this offline result is prepared coverage, never an inferred live/public count; `publicSnapshot=null` remains unobserved. A nonnull snapshot needs internally consistent distinct counts, all 34 codes, prepared evidence and a versioned observation record.

The validator implements every keyword used by the frozen JSON Schema, including its conditional branches, and rejects unsupported keywords. This is a scoped validator, not certification of a general Draft 2020-12 engine. Semantic checks cover identity ownership, scoped citations, sources/independence, required displayed facts, period/locality eligibility, supported images/usage, story length/markers, roster completeness and truthful coverage. JSON duplicate keys, non-NFC/control text, unsafe paths/URLs, unknown fields, broken references, component hashes and canonical manifest hashes are checked. It does not verify historical truth, authentic image bytes or actual publication through static JSON alone.

The approved v14 research package remains **35 selected / 2 complete / 33 incomplete / 18 held**, with two prepared localities and all 34 still required for first release. No content was imported from it. Database fixtures are clearly synthetic and never production fallbacks.

## Verification and limits

Fresh outcomes, hashes and target identity are recorded in the [Phase 02 verification record](2026-10-26-local-heroes-phase-02-verification.json) and [Vietnamese handoff](2026-10-26-local-heroes-phase-02-handoff.md). The matrix uses actual PostgreSQL roles/RLS, not SQL-string tests or browser fixtures. The two-session `two_last_links` case deliberately uses database-owner fixture sessions to probe the deferred invariant beneath the actor guard; authorization is proved separately by the role matrix. Fixtures and fixture Auth accounts are cleared by resetting only the dedicated disposable project, preserving the existing last-active-admin safety trigger.

No browser/viewport, real Auth HTTP, public-data availability, national content-completion or UI performance result is claimed by this backend phase. The existing full browser mutation suite was not run against the linked working project.

Technical references consulted read-only: [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [database functions](https://supabase.com/docs/guides/database/functions), [CLI reference](https://supabase.com/docs/reference/cli/introduction), [changelog](https://supabase.com/changelog), and installed Next.js server/client and route-handler guides. Installed CLI help determined every local-target command used here.
