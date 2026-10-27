# Observed system publication — national figures

This is direct one-agent self-review and a read-only system observation, not independent review or historian certification.

The owner authorized publication in the [recorded instruction](2026-10-27-local-heroes-live-release-authorization.md). The feature migration and content transaction actually completed on **lichsu_12 / ueolfjujjybutyuyfxha** on 2026-10-27. Anonymous public observation time: **2026-10-27T11:19:32.343Z**.

- Observed source manifest: **06080db323af8f89364355323cd585824f3772963e96316dd8ae72aa0fc54416** (immutable research v18).
- Original draft snapshot: **bc6bdbf6f6fcd6c4259987b9b010514109b5fdffe044c50f0fa52329a5c74a53**.
- Executed target-specific release: **0dcfc960010153a91fd3501c0004ed2b9c84138ab9ce45d356555d167c3ba43d**, under `supabase/content/local-heroes/live-release-20261027-v5/`.
- Publication/approval metadata package: **eece5e9012d40371947fc93687f10478325942e54ef9a19ceabf5edb5db1f9f0**, version19 under `supabase/content/local-heroes/published-national-v1/`, parent v18 above. Its eight historical-content files are byte-identical to v18. Only coverage/public-observation and manifest/approval metadata change. It is the current **release-gate package**; `national-v1/` remains the immutable research/rehearsal input so its existing acceptance overlay and original deterministic draft artifacts remain reproducible. The public snapshot names the actually executed v18 source hash; it does not introduce a circular self-hash.
- Public results: **35 distinct people, 35 published primary stories, 34/34 represented canonical localities**, all 35 anonymous profiles contain admitted image/gallery, story, sourced claims and qualifying locality relationships. Complete ordered per-locality counts and observed response hashes are in [the machine observation](sources/2026-10-27-local-heroes-live-publication.json).
- Database totals after this additive release: **41 canonical figures, 106 sources, 66 media, 46 events, 17 event–figure links**. Nine prior figures' complete original base fields, six old figure-media records and all unrelated event/link/media fingerprints are preserved. Three existing canonical people are enrolled; 32 new figures are added. Six other legacy figures remain outside this catalog.
- The derived release preserves existing Văn Tiến Dũng/Phạm Văn Đồng/Lê Duẩn biography/life-date fields and supplies separately checked citations in [the enrollment evidence](sources/2026-10-27-local-heroes-live-legacy-evidence.json). Two new representative images use `is_cover=false` to preserve existing legacy covers. These reviewed integration differences are explicit in the release snapshot, not hidden changes to the research package.
- All six new tables have RLS enabled; exact adopted migration ledger contains `20261027000000` and `20261031000001`. No Auth/student/payment data or synthetic users were imported. Live role tests with writes were not run; actual role/invariant/concurrency mutations remain disposable evidence.

CLI `db push` exited0, but reported a post-application pg-delta catalog-cache warning for null `collate`/`ctype`. A separate read-only query verified the exact migration ledger, six RLS tables, registry34 and callable public RPCs before content publication. The full warning is retained; it was not treated as evidence of a failed or missing migration, and no collation/platform settings were changed.

Release-gate command:

```powershell
node scripts/content/check-local-heroes.mjs --package supabase/content/local-heroes/published-national-v1 --mode release
```

The guarded content rollback in the v5 artifact has been executed only on the disposable actual-baseline mirror. Its live use, any schema reversal, Git publication, Vercel deployment or unrelated service changes require a later specific instruction. Browser evidence and final local URL are recorded in the live-release handoff after observation completes.
