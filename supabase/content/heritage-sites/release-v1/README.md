# Heritage Sites (HS-1.0) Release Artifact

- Generated: 2026-10-28T01:40:53.572Z
- Mode: `publish` (COMMIT)
- Package: `supabase/content/heritage-sites/v1`
- Accepted sites: 64 across 34 localities
  - New locations: 62
  - Enrolled locations: 2 (`dinh-doc-lap`, `pac-bo-cao-bang`)

## Execution Instructions

1. Verify SHA-256 hashes against `snapshot.json`:
   - `import.sql`: `d86f91d886871795b1c41671ab27647a3fb55edac35cd9be9ac7e18ed9c03541`
   - `rollback.sql`: `aaeb763981f404e4948e773df91421cc717ba8ecc82c7468e6eb5c58baf557db`

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
