# Locality province-area admission gate

Date: 2026-10-28, Asia/Bangkok. Method: one main agent, local source validation and bounded read-only requests. This records a blocked geography requirement, not province-area approval.

The [remediation plan](../superpowers/plans/2026-10-28-locality-province-selection-remediation-plan.md) requires complete admissible polygons for all 34 canonical localities before area picking or lift. The existing shared-interior reference lines are insufficient and remain unchanged.

The current source is the pinned Geofabrik/OpenStreetMap snapshot at `2026-10-23T20:20:51Z`, source SHA-256 `c2d0d493638ba152370c89252f9b9a5f0844e7936505f3ab617fadd7023a5c90`, under ODbL-1.0. The [original source ledger](sources/2026-10-24-vietnam-province-source-evidence.json) and [canonical membership mapping](sources/2026-10-24-vietnam-province-membership.json) remain authoritative for that input.

Fresh execution of `scripts/validate-vietnam-province-source.mjs` on the preserved research input exited **2**: 34 matched identities, 2,342 referenced ways, 2,326 available ways, 218,035 available nodes, and 16 missing ways. `structurallyComplete=false`, `productionReady=false`; polygon validity is not certified by this control. All missing ways belong to locality `56`, Khánh Hòa, relation `1887959`:

| Role | Missing way IDs |
| --- | --- |
| outer | 1120240923, 1120240925, 1120240927, 1120240928, 1120240930, 1120240932, 1120240934, 1120240941, 1120240942, 1120240947, 1120240954, 1120240955, 1199677144, 1319181446, 1368675506 |
| inner | 1120240931 |

A request for exactly these ways and their nodes, pinned to the same timestamp, was attempted against `https://overpass-api.de/api/interpreter` and `https://overpass.kumi.systems/api/interpreter`. Initial GET responses were HTTP 406 and 429. The latter asked for a meaningful User-Agent. Subsequent POST requests included a descriptive coursework/source-verification User-Agent and each ended at the explicit 40-second client bound. No way/node geometry was recovered, no snapshot was mixed, and certificate validation remained enabled. The timestamp query uses the publisher's documented [Overpass QL historical date setting](https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL#Date).

Replacement candidates were inspected rather than silently substituted:

- The [Vietnamese provinces database GeoJSON ledger](https://github.com/thanglequoc/vietnamese-provinces-database/blob/master/dataset-generation-scripts/resources/gis/geojson_11Mar2026/README.md) describes a 34-province Bando-derived collection fetched on March 13, 2026. Its data license section explicitly defers usage restrictions to Bando. Admissible redistribution rights for that geometry were not established in this task; an open license on repository software would not settle the upstream data rights. No artifact from it was admitted.
- The [Vietnam 3D Map pipeline](https://github.com/lamngockhuong/vietnam-3d-map/blob/main/docs/data-pipeline.md) names GIS.vn as the geometry source and Bando as metadata source. It does not establish the provenance/topology/data-license gate required here. Its stated preprocessed province tolerance is about 800 m and cannot be substituted for the source-relative validation in this project. No artifact from it was admitted.

Therefore the gate is **blocked by the 16 missing Khánh Hòa member ways, including a hole, and the absence of a qualified complete replacement snapshot**. This is a session finding, not a claim that recovery or another admissible source is impossible. Do not weaken the old negative control, generate hulls/boxes/connectors to close rings, promote 33 units as 34, or discard islands/coasts to force success.

No `history-vietnam-province-areas.geojson`, picking mesh, raised cap, side wall or area hit-test is shipped. The safe UI work uses the existing locality reference centers only as presentation anchors; its projection is explicitly tagged `kind: "reference-center"`, with `bounds: null`. Decorative connectors indicate content association, not historical travel or administrative membership. This does not satisfy the blocked area-picking/lift requirement.

Local request bytes, timestamps, hashes, timeout outcomes and fresh control output are retained under `.task-reports/locality-remediation-20261028/`. Those ignored files are local evidence, not portable production inputs. The current national/island/coastline assets and old reference-line provenance were not modified. The separate [heritage media owner handoff](../agent/prompts/2026-10-28-heritage-media-owner-handoff.md) remains outside this geography gate.
