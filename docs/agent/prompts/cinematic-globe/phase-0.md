# Prompt — Phase 0: establish a reproducible globe baseline and reuse package

## Mission

Prepare the verified source, asset and local application baseline needed to build a cinematic Earth prototype matching the owner's reference, without changing the homepage UI or renderer.

## Definition of done

- Baseline screenshots and current behaviors are recorded with browser, viewport and URLs.
- The proposed renderer dependency and a small matched Earth texture set have verifiable compatibility, rights and provenance.
- The Phase 0 baseline audit, fresh checks and local report exist; no production interface is changed.

## Sources of truth

Read `shared-contract.md` in this directory in full, then the source audit, visual spec, target PNG, and Phase 0 of the implementation plan linked there. Apply all inherited rules.

## Verified starting state

- At research time, the homepage used MapLibre with local solid-color geographic layers; Three.js was installed, `three-globe` was not.
- The target is a generated concept, not an identified template; reusable Earth and globe-layer sources were found and are linked in the audit.
- The working tree was substantially dirty, including untracked application files. Recheck instead of assuming HEAD represents the app.
- Unknown: current package registry/version compatibility, final selected image hashes and future prototype performance.

## Scope and hard constraints

In scope: fresh read-only baseline, local screenshots, exact source/dependency evaluation, minimal licensed asset acquisition, audit/manifest/credit files. Out of scope: changing production rendering, installing several rendering stacks, historical edits and every external write prohibited by the shared contract. Use one agent.

## Relevant files and patterns

- `lib/explorer/globe-style.ts`, `components/explorer/EventMap.tsx`, `HistoryExplorer.tsx` and `GlobeMarkers.tsx` — current scene/state boundary.
- `package.json`, `pnpm-lock.yaml` — installed versions; do not assume an upstream `dev` example is compatible.
- `public/maps/*.provenance.json` — geographic provenance pattern.
- `tests/unit/explorer-globe.test.ts`, `tests/e2e/home-map.spec.ts`, `tests/e2e/home-globe.spec.ts` — current behavior baseline.

## Work item — freeze useful inputs

**Problem:** Styling cannot be judged reliably while source rights, camera framing and the starting application are implicit.

**Required change:** Follow Phase 0's checklist. Capture world/Vietnam/card/journey states, record existing failures, verify the proposed single `three-globe` addition against installed Three, and select only needed label-free textures. Create `docs/audits/2026-10-23-cinematic-globe-baseline.md`, `public/maps/globe/assets.provenance.json` and `public/maps/globe/ATTRIBUTION.md` for acquired assets. Store original source links, creator, access date, license, dimensions, size, SHA-256 and transformations. Do not import an entire demo repository into the application.

**Acceptance:** Every acquired asset has readable permission evidence; the plan makes one bounded prototype recommendation; no fake geography or production UI modification; cold baseline and known failures are distinguished from new changes.

**Verification:** Run the existing explorer unit checks in the plan; establish the two public homepage E2E baselines on a fresh local build and inspect real screenshots. Run the shared full gate. No new unit tests are required for documentation or unmodified assets unless introducing executable validation logic.

## Deliverables and stop conditions

Apply the shared deliverable/report format. List the exact chosen files and dependency rationale, unknowns, and the local baseline paths. **STOP at P0.** Do not install/integrate the new renderer or start Phase 1.

## Final recap

Deliver a reproducible, sourced prototype input package, preserve the current homepage, and stop after the P0 handoff.
