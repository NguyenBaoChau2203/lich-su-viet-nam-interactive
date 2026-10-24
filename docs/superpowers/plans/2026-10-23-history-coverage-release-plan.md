# History Coverage and Release Implementation Plan

> For agentic workers: use superpowers:executing-plans inline. Use one agent; do not create AI research or reviewer workers.

**Goal:** Deliver checkpoint D: reconcile curriculum and media coverage, implement evidenced expansion slices, and verify the complete explorer without presenting a pilot as full coverage.

**Architecture:** Maintain one typed coverage inventory linked to existing event and authored-experience identities. Add historical content and media in small verified batches; reuse the approved application interfaces. Keep publication state separate from evidence/readiness.

**Tech stack:** Existing TypeScript registries, historical Markdown/seed tooling, validation tests, browser/performance tools. New database schema and a new simulation engine are not assumed.

**Spec:** ../specs/2026-10-23-3d-vietnam-map-explorer-design.md.
**Master:** 2026-10-23-tabletop-explorer-implementation-plan.md. Inherit its global constraints, performance budgets, and Git/test rules.

**Device scope:** Release UI acceptance is laptop/PC only at CSS viewports 1280×720, 1366×768, 1440×900, and 1920×1080 with mouse/trackpad and keyboard. Mobile/tablet and touch-specific checks are deferred. Preserve and report legacy coverage separately under the master's E2E selection rules.
**Prerequisite:** Checkpoint C passes for the Dien Bien Phu pilot.

## Task C1: explicit curriculum and asset coverage

**Files:** Create lib/event-experience/coverage.ts, docs/content/explorer-curriculum-coverage.md, tests/unit/explorer-coverage.test.ts. Inspect lib/sgk/curriculum.ts, Supabase local content/seeds, and all experience registries.

**Interfaces:** Export CoverageEntry[] as explorerCoverage and assessCoverage(entries): { ready: string[]; incomplete: string[]; blockers: string[] }.

Define the contract explicitly and import EvidenceRef from the B1 module:

~~~ts
type CoverageReadiness = "missing" | "needs-evidence" | "ready" | "not-applicable";
type CoverageEntry = {
  eventSlug: string; curriculumRefs: string[];
  dateEvidence: CoverageReadiness; locationEvidence: CoverageReadiness;
  narrative: CoverageReadiness; simulation: CoverageReadiness;
  artifacts: CoverageReadiness; figures: CoverageReadiness; sources: CoverageReadiness;
  publication: "draft" | "published" | "unknown";
  requiredCapabilities: { simulation: boolean; artifacts: boolean; figures: boolean };
  justifications: Partial<Record<"artifacts" | "figures", { reason: string; evidence: EvidenceRef[] }>>;
  notes: string[];
};
~~~

Date/source/narrative readiness cannot be not-applicable. Artifacts/figures may use that value only with the matching justification and an explicitly reviewed capability decision; difficulty making an asset is not such a reason. Every required immersive event needs an actual simulation unless the owner approves a changed scope.

- [ ] Write failing coverage tests: unknown/duplicate event IDs, no curriculum mapping, required capability marked missing, unsupported not-applicable, ready simulation with an invalid registry reference, and publication incorrectly used as proof of evidence.
- [ ] Run pnpm exec vitest run tests/unit/explorer-coverage.test.ts; inspect failures.
- [ ] Reconcile the current Kết nối tri thức index with the authoritative grade-12 curriculum and the project's intended Vietnamese-history scope. Record the actual earliest/latest covered periods and required event set; do not silently keep the old 1945–1975 range or expand into all Vietnamese history.
- [ ] Inventory each required event's narrative, all locations/precision, simulation, true 3D artifacts, people, sources, asset rights, and publication state. Existing keyDates, toVerify, procedural models, scans, and depth photographs must be distinguished.
- [ ] Implement assessCoverage with no “complete” result while a required event/capability or source is unresolved. Record the chosen event count and scope basis rather than reusing 25–35 as proof of complete coverage.
- [ ] Run the coverage test, pnpm history:data:check, and pnpm verify. Review the inventory and make an eligible docs/test commit.

**Acceptance:** The owner can see exactly what is ready, what is missing, and why. A sourced event without a simulation is not reported as a completed immersive event.

## Task C2: implement expansion in source-backed event batches

**Files:** Modify only the selected local content/seeds and lib/event-experience registry entries. Add event-specific registry files under lib/event-experience/, event-specific scripts under lib/mapfilm/ when the battle authoring model fits, and tests/unit/event-experience.test.ts / explorer-coverage.test.ts. Use existing model builders/viewers for supported objects.

**Interfaces:** Reuse A2 ExplorerEvent and B1 EventExperienceDefinition. A new map-film script conforms to existing MapFilmScript. Do not make political/diplomatic/social events inherit military units just to fit that interface.

- [ ] Select a batch of at most three required incomplete events from C1, grouped by shared content/renderer needs. Record exact slugs and acceptance criteria in the execution report before editing.
- [ ] For each claim and asset, record source, author/institution, access date, locator, confidence, rights/credit, and limitations. No invented dates, coordinate precision, quotations, tactics, relationships, or face likeness.
- [ ] Add failing validation tests for each slice's event identity, date/location semantics, registry links, source references, moment/scene positions, and 3D object classification.
- [ ] Implement the local content and supported authored experience using the existing interfaces. Keep uncertain claims non-public/needs-evidence; do not replace a missing simulation with an unlabeled film or depth image and call the requirement met.
- [ ] If an event needs a fundamentally different simulation format, document that concrete requirement and produce a focused event-specific design/plan before adding another renderer. Keep its coverage incomplete in this release until that separate slice is implemented and verified.
- [ ] Evaluate img2threejs only for a selected object with a sourced reference and a defined visual target. Installation/model generation is a separate explicitly requested authoring task, not an automatic prerequisite for the map. Label outputs as illustrations and keep inference notes; verify the actual generated code and render.
- [ ] Verify each event through time filter → marker/list → card → detail → simulation → artifact/figure → sources → restored map. Use an isolated local/test dataset for new draft records; do not publish to an external service without authorization.
- [ ] Run focused content/registry/unit and public browser tests for the batch, then pnpm verify. Update the inventory from actual evidence and make eligible small commits.
- [ ] Repeat this bounded batch task until the agreed required set passes. Record any remaining source, authoring, or publication dependency explicitly.

**Acceptance:** Every promoted ready entry is supported by actual content, interaction, and evidence. A future authoring plan, an installed skill, or a placeholder asset is not a completed event.

## Task C3: full release audit and regression gate

**Files:** Create docs/audits/tabletop-explorer-release-audit.md and tests/perf/tabletop-explorer.md. Modify only feature/test files needed for verified failures.

**Interfaces:** Assess all master checkpoints and the fifteen design acceptance criteria; retain separate software, content, publication, and performance results.

- [ ] Establish a failing reproduction for any remaining behavior bug before changing it. Do not add broad unrelated refactors.
- [ ] Repeat the complete journey at desktop CSS viewports 1280×720, 1366×768, 1440×900, and 1920×1080 with mouse/trackpad and keyboard, reduced motion, no JavaScript, no WebGL, context loss, failed data/assets, empty ranges, multi-location/shared-point events, stale URLs, and browser Back. Mobile/tablet and touch-specific checks are deferred.
- [ ] Check the required event inventory against actual visible published records and authored media. Account for overseas/unknown locations through the readable list; never invent a point on the national model.
- [ ] Measure unique added compressed chunks, footprint size, triangles, idle rendering, first usable static content, p95 rotation frame time, and card response on a stated real device/browser. Keep raw measurement method and results in the performance record.
- [ ] Run pnpm verify and all feature E2E suites after the production build. Verify that required public cases ran; inspect skips and failures rather than reporting only the exit code.
- [ ] Confirm an isolated local/disposable database or explicit test-service authorization before running pnpm test:e2e in full, because existing staff/payment suites write and clean up records. A production app URL and a local app URL are both insufficient proof of a safe database target.
- [ ] Run pnpm test:e2e only after that prerequisite. If it is unavailable, record the full-suite gate as blocked; do not run the mutating tests against an unapproved service or claim full release verification.
- [ ] Run git diff --check and inspect staged/working paths. Review sources, public-only exposure, navigation regressions, lazy loading, resource cleanup, and untracked baseline ownership.
- [ ] Record all acceptance criteria with evidence paths, unresolved limitations, intentionally deferred elevation, and the current publication boundary. Create the required ignored local report.

**Checkpoint D:** Claim complete only if required functionality, content, actual publication availability, browser cases, and declared budgets pass. Keep a failed/missing gate explicit. Deployment, push, merge, PR creation, and external publication remain outside this plan.
