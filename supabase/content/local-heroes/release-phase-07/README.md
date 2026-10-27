# Phase 07 local draft rehearsal — national release blocked

This is a deterministic, **local rehearsal artifact**, not an authorized live import. It preserves all 35 first-release identities and all 34 mandatory reference localities. Only Văn Tiến Dũng and Kim Đồng have graphs admitted by the current source/media acceptance overlay; the other 33 records are explicitly incomplete identity shells. The 18 held nominees are retained in the review ledger and excluded from import. Two locally rehearsed profiles do not satisfy national release acceptance.

The original `national-v1` v17 files are unchanged. Read [the readiness audit](../../../../docs/audits/local-heroes-release-readiness.md) and [the binding source/media review](../../../../docs/audits/sources/2026-10-27-local-heroes-phase-07-content-review.json) before using these files.

## Snapshot and reproduction

| Binding input | SHA-256 / identifier |
| --- | --- |
| Manifest content hash, v17 | `84d8a8a5833ec66382aa4e96b50cfdfd9495e15fc1c524f2205c4279866e8dfb` |
| Acceptance overlay bytes | `084769e78ef13f1d1af767651713850384c4c3da0a13d536c3e7f75d6a48831b` |
| Canonical snapshot digest | `4110c2782371654e0f74621036fb680b995aebe1c1ba1795dddd67ed0d43cbc8` |
| Snapshot file bytes | `a535252da4460464277afc79de8af3e143e7595ec34147211fdb49a554ae11b0` |
| UUIDv5 namespace | `bfcdd5b2-7473-4ea9-9a21-a633400a3ca0` |

`artifact-hashes.json` lists exact SHA-256 hashes for the four generated files. `snapshotHash` hashes the canonical snapshot content; it is intentionally distinct from the hash of the formatted `snapshot.json` file. No timestamp, random identifier, credential or environment value is generated into the SQL.

From the repository root, these commands only prepare local files or mutate the descriptor-confirmed disposable test database:

```powershell
$env:NoDefaultCurrentDirectoryInExePath = '1'
node scripts/content/prepare-local-heroes-release.mjs
node tests/rls/local-heroes-import-rehearsal.mjs --target .task-reports/local-heroes-disposable-db.json
```

The rehearsal requires the existing empty, dedicated `local-heroes-phase02-disposable` project, matching Docker labels, local Docker transport, CLI configuration and loopback API. It refuses a missing/wrong descriptor or a nonempty Auth/content baseline. Do not replace it with a connected, linked, shared or remote project. Its local prerequisites and exact successful commands are recorded in the audit; this README is not proof of a pass.

## Transaction behavior

- `draft-import.sql` imports all 35 identities as **drafts**, with complete child rows only for the two admitted graphs. It ends in `ROLLBACK`.
- `local-promotion-rehearsal.sql` imports those same drafts, submits the two admitted graphs as a synthetic editor, promotes them as a synthetic reviewer, checks the anonymous public view and ends in `ROLLBACK`.
- `rollback.sql` contains the explicit `ROLLBACK` for an open rehearsal transaction. There is no committed release to delete. A live compensating deletion script would be unsafe without an authorized target inventory and is not supplied.
- `snapshot.json` contains expected person IDs/slugs, input hashes, source/media fingerprints, child rows and the decision for every selected identity. Existing canonical UUIDs take precedence; new UUIDv5 names use `national-v1/<kind>/<package-key>`.

The SQL requires `app.local_heroes_disposable='local-heroes-phase02-disposable'`; the runner verifies the actual target before setting it. A session setting alone is not target verification. **Do not remove the guard or replace `ROLLBACK` with `COMMIT`.**

The importer only inserts missing exact rows. An exact rerun preserves revisions and content. A canonical ID, name, slug, source fingerprint, changed child row or unexpected owned graph conflicts before it can overwrite legacy content. Conflicts abort the operation. The rehearsal proves unrelated rows remain unchanged, UUIDv5 agrees with PostgreSQL, protected/sluggable/source/child conflicts roll back, and each transaction restores the empty baseline.

## Boundary

All national content, approval/hash lineage and actual remote identity/schema readiness remain blocked or unverified. The intended working remote was not exposed by the configured connector. No remote schema/content/storage write, asset upload, commit, push, publication or deployment was performed. A future complete approved package must be regenerated, rehearsed and matched to a concrete target before separately instructed external work.
