# Heritage Sites (HS-1.0) Release Artifact

- Generated: 2026-10-27T15:06:26.202Z
- Mode: `publish` (TRANSACTION ROLLBACK TEST)
- Package: `supabase/content/heritage-sites/v1`
- Accepted sites: 64 across 34 localities
  - New locations: 62
  - Enrolled locations: 2 (`dinh-doc-lap`, `pac-bo-cao-bang`)

## Execution Instructions

1. Verify SHA-256 hashes against `snapshot.json`:
   - `import.sql`: `bf79a1470e76f9046b47f5de1fb8e14c29feb8d8fd8084d187e986098a3aa178`
   - `rollback.sql`: `4c9b069d96531f8d55b0c9e83eb01908f152eb9ac85dfef537cfda34d81013e4`

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
