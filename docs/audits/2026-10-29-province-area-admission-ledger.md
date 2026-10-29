# Province-area admission ledger (2026-10-29)

One main agent. **Complete 34/34** source-qualified admission after Khánh Hòa recovery.

## Inputs

- Pinned research snapshot: `.task-reports/explorer-refinement-task-05-work/province-source.research.json.gz` (SHA-256 `5504fab9…`)
- Merged recovery input: `.task-reports/khanh-hoa-recovery-20261029/province-source.merged.json.gz`
- Membership: `docs/audits/sources/2026-10-24-vietnam-province-membership.json`
- Assembler: `scripts/province-boundaries/build_areas.mjs`
- Checked-in complete ledger: `docs/audits/sources/2026-10-29-province-area-admission-complete.json`
- Incomplete-input negative control: `docs/audits/sources/2026-10-29-province-area-incomplete-control.json`

## Coverage

| Status | Count | Notes |
| --- | --- | --- |
| admitted | **34** | Independent ring assembly + topology gates; no invented members |
| blocked | **0** | Khánh Hòa `56` recovered via official OSM way/full JSON reads |

Public runtime asset: `public/maps/history-vietnam-province-areas.geojson` (`coverageStatus: complete`, ~79 KiB gzip after 200 m DP). Historical partial demo retained as `public/maps/history-vietnam-province-areas.partial.*` if present.

## Recovery (Khánh Hòa)

- Official OSM API `GET /api/0.6/way/{id}/full.json` via Cursor WebFetch for all 16 missing members (local TLS clients failed; no bypass).
- Node/version coordinates merged with compatibility checks (0 conflicts; 18 shared compatible nodes; 4540 new nodes).
- Documented non-geometry boundary members (`admin_centre`/`label`/`subarea`/empty-role nodes) are acknowledged, not silently treated as rings.

## Negative controls preserved

- Incomplete pinned input still blocks `56` (checked-in control JSON).
- Bow-tie and unresolved nested-relation synthetics are blocked by the hardened assembler.
- Existing shared-interior reference-line pipeline unchanged.
- No hull/bbox/nearest-center fabrication.
