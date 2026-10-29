# Heritage Sites (HS-1.0) Release Artifact

> [!NOTE]
> superseded media; use release-v1-media-fix for corrective update on live database. Fresh database deployments receive the updated genuine media assets.

- Generated: 2026-10-28T17:02:54.674Z
- Mode: `publish` (COMMIT)
- Package: `supabase/content/heritage-sites/v1`
- Accepted sites: 64 across 34 localities
  - New locations: 62
  - Enrolled locations: 2 (`dinh-doc-lap`, `pac-bo-cao-bang`)

## Execution Instructions

1. Verify SHA-256 hashes against `snapshot.json`:
   - `import.sql`: `c1cba49e6c1fa3f0d05382bc69b86d21f87144d5f91ee9e5e2d57a58366e0633`
   - `rollback.sql`: `ca253d28506161204dc2b3567a49924aa774a7a2dd4191ef4fcd96396de30357`

2. Dry-run rehearsal (ends in ROLLBACK by default):
   ```powershell
   # On disposable DB or with dry-run
   psql -f import.sql
   ```

3. Live deployment (when authorized by project owner):
   ```powershell
   node scripts/content/heritage-sites-release-sql.mjs --package supabase/content/heritage-sites/v1 --out supabase/content/heritage-sites/release-v1 --mode publish --commit
   psql -f supabase/content/heritage-sites/release-v1/import.sql
   ```

4. Emergency rollback:
   ```powershell
   psql -f supabase/content/heritage-sites/release-v1/rollback.sql
   ```
