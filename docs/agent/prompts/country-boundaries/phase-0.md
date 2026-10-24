# Prompt — B0: prepare sourced international land-boundary data

## Mission

Produce one compact, reproducible Natural Earth country-boundary asset with explicit classification policy, provenance and integrity tests for the existing cinematic globe.

## Definition of done

- Source and output hashes, publisher/terms/policy/access metadata and omitted feature classes are recorded.
- Only ordinary international land lines under the selected policy enter the runtime artifact.
- Source/parser/budget tests and the full gate pass; the production renderer remains unchanged.

## Sources of truth

Read `shared-contract.md` in this directory, then the linked review, proposed design and Phase 0 of the plan. Apply all inherited constraints and verification/report requirements.

## Verified starting state

- The review independently found coastlines and Vietnam outline, but no country-boundary runtime asset/path.
- Its pinned 50m snapshot has 390 features and 19,859 points; the proposed policy selects 357 features. Recheck exact source bytes/hash before relying on those counts.
- Raw property names are uppercase; LineString and MultiLineString differ from current polygon input.
- Proposed 50m output is about 129.40 KiB gzip; total geography would be about 573.17 KiB. The new 600 KiB target is explicit, not the previous three-file 500 KiB test.

## Scope and hard constraints

In scope: builder, processed line types/parser, local GeoJSON/provenance, vector credits and input/budget tests. Out of scope: drawing borders, changing camera/materials, historical content, maritime/province/label additions or any external mutation. Use one agent and all shared source/security rules.

## Relevant files and patterns

- New `scripts/build-country-boundaries.mjs`, `public/maps/history-country-boundaries.geojson` and `.provenance.json`.
- New `lib/explorer/cinematic/country-boundaries.ts` and `tests/unit/explorer-country-boundaries.test.ts`.
- `tests/unit/explorer-globe.test.ts`, existing geographic provenance and `public/maps/globe/ATTRIBUTION.md`.

## Work item — normalize the source without losing its meaning

**Problem:** Current physical land geometry cannot provide inland national separation; blindly stripping properties or reading lowercase fields loses boundary semantics.

**Required change:** Follow B0 in the plan. Re-fetch/verify the pinned source, distinguish dataset version from repository tag, normalize `FCLASS_VN ?? FEATURECLA`, retain IDs/original/effective class, exclude and inventory nonordinary classes, preserve open/disconnected lines and round only coordinates. Add a deterministic offline-input builder path, strict processed-data parser and exact output checksum. Include all four runtime geography assets in the explicit new budget test.

**Acceptance criteria:** Source-derived/synthetic tests cover null/override/unknown classification, supported geometry and deterministic output. No uncertain/control/internal/maritime feature is mislabeled as an ordinary border. Asset gzip ≤150 KiB and total geography ≤600 KiB. No runtime UI change; source limitations and omission policy are readable.

**Verification:** Run the new source/parser tests and existing geography tests, then the shared full gate. Investigate a changed source hash/count instead of forcing the expected count. Do not run a missing future E2E file.

## Deliverables and stop conditions

Return the exact artifact/source policy, counts/hashes/sizes, files/check results and local B0 report. **STOP at B0.** Do not attach the asset to the scene or start B1. If the owner requires the old 500 KiB cap, document the 110m alternative decision before substituting it.

## Final recap

Deliver trusted compact line data and input tests, preserve production rendering, and stop after B0.
