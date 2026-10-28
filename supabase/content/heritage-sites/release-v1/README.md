# Heritage Sites (HS-1.0) Release Artifact

- Generated: 2026-10-28T02:01:07.696Z
- Mode: `publish` (COMMIT)
- Package: `supabase/content/heritage-sites/v1`
- Accepted sites: 64 across 34 localities
  - New locations: 62
  - Enrolled locations: 2 (`dinh-doc-lap`, `pac-bo-cao-bang`)

## Execution Instructions

1. Verify SHA-256 hashes against `snapshot.json`:
   - `import.sql`: `064aabf962944d9283693082a791220e56126e380c445715d584eccc3177488e`
   - `rollback.sql`: `bacaf3d1198fab4c991bd8dfc2830dab4288e7754490a9393d0d7aefd162b87d`

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
