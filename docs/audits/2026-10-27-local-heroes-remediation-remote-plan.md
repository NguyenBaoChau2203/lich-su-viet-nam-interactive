# Remote preparation checkpoint — national figures

**Status: prepared for owner review; external execution blocked and unexecuted.** One-agent self-review, 2026-10-27. The owner's instruction to finish blockers permits this local preparation and read-only inventory. It does not approve a remote migration/import/publication target or overwrite legacy content.

## Concrete target and artifact

Intended project: **lichsu_12 / ueolfjujjybutyuyfxha / ap-northeast-1**. [Read-only inventory](sources/2026-10-27-local-heroes-remediation-remote-preflight.json) and [exact SELECT transaction](sources/2026-10-27-local-heroes-remediation-remote-preflight.sql) identify the actual state; the configured MCP exposes other projects, so the authenticated installed CLI was used for this named target only. Query contains BEGIN READ ONLY, SELECT and COMMIT; no migration, repair, DML or upload ran.

Reviewable local artifact: [draft-import.sql](../../supabase/content/local-heroes/release-phase-07-remediation/draft-import.sql), [local-promotion-rehearsal.sql](../../supabase/content/local-heroes/release-phase-07-remediation/local-promotion-rehearsal.sql), [rollback.sql](../../supabase/content/local-heroes/release-phase-07-remediation/rollback.sql), [snapshot and fingerprints](../../supabase/content/local-heroes/release-phase-07-remediation/snapshot.json). Manifest hash `06080db323af8f89364355323cd585824f3772963e96316dd8ae72aa0fc54416`; snapshot hash `bc6bdbf6f6fcd6c4259987b9b010514109b5fdffe044c50f0fa52329a5c74a53`. Default SQL is draft-only and rolls back. It is a disposable rehearsal artifact, not a ready-to-run production enrollment script.

## Actual read-only findings

- PostgreSQL 17.6; 9 existing published canonical figures, 46 events, 30 source rows, 6 figure media rows. No local-heroes feature tables/columns and no supabase_migrations.schema_migrations ledger. Local migration history cannot be replayed or repaired against that remote by assumption.
- All nine legacy identities remain represented by their existing IDs in the research manifest. The selected three below already own event links. Other six remain held nominees; no catalog enrollment is inferred.
- No exact URL overlap was found between the 73 admitted source records and the 30 inventoried remote sources. This is not semantic deduplication or a license/storage audit. Existing Phạm Văn Đồng/Lê Duẩn media ownership and links are preserved. New representative images remain direct source URLs, with no uploaded copy.

| Selected canonical person | Existing UUID | Slug | Existing event links | Safe result of current local importer |
| --- | --- | --- | --- | --- |
| Lê Duẩn | `dff00764-7ef6-4b82-981e-9f66f080d653` | le-duan | 1 | Refuse whole transaction; preserve published legacy record |
| Phạm Văn Đồng | `c6eb511d-898f-4fab-8875-42ddd0700cd4` | pham-van-dong | 1 | Refuse whole transaction; preserve published legacy record |
| Văn Tiến Dũng | `c0bcb4b3-9a6a-4f02-aae5-2d38dbc3c15a` | van-tien-dung | 1 | Refuse whole transaction; preserve published legacy record |

The importer also refuses a different ID with the same folded name/slug, source fingerprint mismatch, changed child graph or unexpected child link. Its conflict failure and rollback were rehearsed on a disposable DB. Removing those guards to force a live import is not an accepted remedy.

## Exact external steps requiring separate owner instruction

1. Review the full 35/34 content package, media scope, acceptance decisions and exact manifest/snapshot hashes. Record actual matching hash approval without replacing the existing v14 roster approval.
2. Explicitly select the project above and authorize the bounded remote operation. Re-run this read-only preflight immediately before execution, establish the owner's backup/rollback point, inspect the full schema/extension/policy/function baseline and reconcile the absent migration ledger. Prepare and review a schema-adoption plan; do not issue migration repair/push from the local history by assumption.
3. Prepare a separately reviewed additive enrollment change for Văn Tiến Dũng, Phạm Văn Đồng and Lê Duẩn. Preserve UUIDs/slugs/event links/current publication, source/media ownership and imported modules. Resolve any content conflict explicitly; never overwrite canonical published biography/media or create duplicate people. Rehearse the exact remote schema snapshot and enrollment transaction on a new disposable copy before target writes are proposed. No production enrollment SQL has been approved or executed here.
4. After approval of that concrete plan and target, apply only authorized schema/draft steps, with authenticated server roles and post-migration RLS/invariant checks. The artifact here is local-only and is not substituted as a remote command. Draft import, storage upload and publication each require a named authorized scope.
5. Review any hosting/reuse rights beyond coursework_reference before copying assets or expanding distribution. No open-license or public-domain status is inferred; no asset upload occurred.
6. Only after a separately authorized publication transaction: verify 35 distinct selected people and all 34 canonical localities through public queries, verify source/image delivery and learner/admin journeys on that target, and record actual publicSnapshot values. Keep prior workflows and legacy event links intact. A deploy/push/PR/commit is a separate owner action.

The unavailable historical v16 snapshot remains an explicit provenance gap in the acceptance overlay. V18 is directly checked and links to preserved v17; no reconstruction or approval of unavailable bytes is claimed. This checkpoint does not waive any failed release gate.
