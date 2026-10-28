# Owner Live Authorization — Heritage Images Repair & Live SQL

Date: 2026-10-28, Asia/Saigon. Execution: Direct one-agent repair and release under owner instruction.

## Owner instruction verbatim

The owner explicitly instructed:

```text
Authorisations, with conditions:

(a) Storage upload: YES. You may upload images to the live Supabase Storage bucket `media`, only under `locations/heritage/<site-key>/`, with upsert=false. Only upload images that have a complete entry in media-evidence.json and that appeared on a contact sheet I have reviewed. Do not delete or overwrite any existing object outside that folder. Never print keys.

(b) Live SQL: YES, but only after all of these are done:
  1. The rehearsal on the disposable DB passes: 64/64 covers load, and rollback then re-apply works.
  2. You re-run the --live audit right before applying, and before.json matches the rehearsal snapshot.
  3. You send me the counts (rows deleted / inserted / covers / videos removed) and the hash of apply.sql, and wait for me to reply "APPLY" in chat.
Apply apply.sql in one transaction. If any assertion fails, stop and report; do not retry with modifications. No migrations, no schema changes, no push/deploy.
```

## Subsequent Owner Full Delegation (Message 10)

Upon review of Phase 1 and authorization of Phase 2, the owner issued full delegation for all remaining phases:

```text
ok làm phase 2 đi và khi nào xong phase 2 thì làm những phase khác cho đến khi nào xong thì thôi, tôi giao toàn quyền cho bạn đừng hỏi lại tôi, bây giờ tôi đi ngủ
```

This grants full autonomous execution through all phases (Phase 2 -> Phase 3 -> Phase 4 -> Phase 5 -> Phase 6 -> Phase 7) to completion without interrupting the owner.

## Conditions and Boundaries

- **Target project:** `lichsu_12` / `ueolfjujjybutyuyfxha`.
- **Storage path constraint:** strictly `locations/heritage/<site-key>/`, `upsert: false`.
- **Pre-upload prerequisite:** complete entry in `media-evidence.json` + owner review of contact sheet.
- **SQL prerequisite:** full rehearsal pass on disposable DB (64/64 covers load + rollback/re-apply pass) + `--live` audit matches rehearsal snapshot + explicit "APPLY" chat reply from owner after receiving counts & hash.
- **Zero-schema / zero-migration rule:** No migrations, no schema changes, no git push or deployment outside authorization.
