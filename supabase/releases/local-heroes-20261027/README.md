# System Supabase adoption track — 2026-10-27

This track belongs only to `lichsu_12 / ueolfjujjybutyuyfxha` and the [recorded owner instruction](../../../docs/audits/2026-10-27-local-heroes-live-release-authorization.md). It does not assert that the repository's old root migrations ran against this database.

The captured public schema already exists on the inspected target. **Do not execute `20261027000000_system_public_baseline.sql` on that existing database.** After verifying the actual schema/content before images, record only this baseline version as adopted. The sole new schema migration is the unchanged `20261031000001_local_hero_catalog.sql`, SHA-256 `762beb458820fb7e0df7fcbbb539fe00ca2fff17563af1c5739ad4bcf3f8d655`.

Use this workdir explicitly; do not substitute root `supabase db push`, replay historical migrations, include seed data or include roles:

```powershell
supabase migration repair 20261027000000 --status applied --linked --workdir supabase/releases/local-heroes-20261027
supabase db push --dry-run --linked --workdir supabase/releases/local-heroes-20261027
supabase db push --linked --workdir supabase/releases/local-heroes-20261027 --yes
```

The dry run must name only the feature migration. Stop on unexpected schema, identity, content or history differences.

Content publication uses the separately generated, hash-checked `../../content/local-heroes/live-release-20261027-v5/publish.sql`, in one transaction. Its release hash is `0dcfc960010153a91fd3501c0004ed2b9c84138ab9ce45d356555d167c3ba43d`. The original draft-only importer remains unchanged and must still reject existing legacy/event-linked rows. The live artifact explicitly enrolls three exact before-image canonical identities, preserves all their old fields/media/event links, refuses existing unpublished catalog preparation and checks all 35 public graphs before commit.

The matching `rollback-content.sql` removes only this release's new rows, preserves all nine existing canonical figure rows and unrelated historical data, and refuses later edits or added references. It was executed and followed by a successful republish on the disposable actual-schema/content mirror. **Do not run rollback routinely after publication.** It is a separately instructed recovery action; first confirm the exact release hash, unchanged rows, current dependent records and fresh backups. A content rollback leaves the additive schema and truthful adopted migration history in place. Reversing the schema requires a separately reviewed dependency-aware migration, never replaying the baseline dump over live data.

Safe before images and full execution/rehearsal logs are retained under the ignored `.task-reports/local-heroes-live-release-20261027/`; portable content before images are in `tests/unit/fixtures/local-heroes-live-baseline.json`. These contain public historical records, not copied Auth/student/payment data. See `adoption-manifest.json` and the versioned live-release handoff for hashes and actual outcomes. Authorization and successful rehearsal alone are not proof of live publication.
