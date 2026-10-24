# Prompt — Task 05: verify and build current Vietnam provincial geometry

**Recommended model:** GPT-6.1 Sol, reasoning max. **Complexity:** 5/5. Execute one task inline.

## Mission

Deliver a reproducible, source-cleared vector artifact for interior borders among the 34 current provincial-level units, ready for the separate rendering task.

## Definition of done

- Source geometry, membership, timestamp, rights and uncertainty are documented and verified.
- An offline deterministic builder creates deduplicated interior edges and provenance within the proposed budgets.
- Integrity/topology tests pass; no unverified geometry enters production.

## Sources of truth

Read `shared-contract.md`, Task 05 in the implementation plan, the province section of the design and `docs/audits/2026-10-24-explorer-refinement-review.md`. Recheck Resolution 202/2025/QH15 on the Government portal for the 34-unit framework; that resolution alone does not license GIS data.

## Verified starting state

- The owner selected 34 current units as a disclosed modern reference, not historical-year borders.
- Existing country/Vietnam geography does not contain this provincial layer.
- The inspected thanglequoc directory advertises current geometry but refers GIS restrictions to Bando; its root MIT license is insufficient evidence for those data.
- The inspected Open Admin Data records are centers/hierarchy, not polygons. The inspected geoBoundaries endpoint returned 64 units/year 2008. An OSM query failed with HTTP 406; no complete current OSM relation set was verified.
- **Unknown:** the final current, complete, legally reusable polygon/relation source. Resolve this instead of assuming a candidate is cleared.

## Scope and hard constraints

In scope: read-only source research/download, source ledger, offline builder, artifact/provenance, dedicated validator and meaningful integrity tests. Out of scope: runtime layer integration, source-service writes, historical event edits, invented boundaries or a new basemap. Apply all shared constraints. Do not silently replace current 34-unit data with older 63/64-unit geography or promote center coordinates into outlines.

## Relevant files and patterns

Inspect the existing country builder/artifact/provenance patterns and current national coverage. Proposed files: `scripts/build-vietnam-province-boundaries.mjs`, `public/maps/history-vietnam-province-boundaries.geojson`, matching provenance, `lib/explorer/cinematic/province-boundaries.ts`, and `tests/unit/explorer-province-boundaries.test.ts`. Use actual test-directory conventions if different and record the final paths.

## Work item — establish provenance and deterministic interior topology

**Problem:** A file with 34 names, an old API labeled current, or a repository code license cannot establish current polygon coverage and GIS rights.

**Required change:**

1. Obtain a readable licensed source and government-code crosswalk; record publisher, URL, access date, represented date, source IDs/checksums, license/attribution and material limitations. Prefer stable snapshots. If using OSM, verify current administrative relation membership and shared ways; document ODbL/source-derived-data obligations. Do not introduce OSM tiles, roads or POIs.
2. Verify all 34 units against the authoritative membership list, including valid geometry parts/holes and finite coordinates. Preserve the existing national/island geography and avoid introducing unreviewed maritime claims.
3. Build interior edges once per shared boundary; exclude duplicated coastline/national outline. Use source topology/shared-way identities where available; document any justified offline tool addition. No new runtime dependency by default.
4. Record 34-unit coverage separately from the number of output line features. Freeze the province schema/loader contract in the progress audit; do not cast province records through the country-only classification validator.
5. Target province gzip at most 200 KiB, all geographic JSON at most 800 KiB and at most 50,000 added line segments. Measure actual output; do not delete national/island detail to fake the budget.

**Acceptance criteria:** All units are accounted for with source IDs; adjacent boundaries occur once; builder output is deterministic; malformed/missing membership fails clearly; provenance and required attribution accompany the artifact. Review a rendered source preview for obvious gaps/crossings, without claiming survey precision. If any required source/rights/currentness evidence is unresolved, the deliverable is an exact blocker report and safe research work, not a supposedly completed province layer.

**Verification:** Add membership/topology/determinism/invalid-input tests; run the builder twice and compare hashes. Run the actual focused province test, `pnpm history:data:check`, `pnpm verify`, `git diff --check` and status. Record compressed sizes and source preview artifacts. No runtime success claim is appropriate before Task 06.

## Deliverables and stop conditions

Return the source decision/ledger, builder and artifact hashes, actual budget/test evidence, frozen type/schema, updated progress and local Task 05 report. **STOP after 05.** If the data gate is unresolved, explicitly keep 05/06 outstanding; independent Task 07 may proceed later under its own prompt. Do not create guessed fallback geometry or start the renderer task.

## Final recap

Verify a complete current 34-unit source, build honest deduplicated interior edges, prove provenance/topology, and stop at the data handoff.
