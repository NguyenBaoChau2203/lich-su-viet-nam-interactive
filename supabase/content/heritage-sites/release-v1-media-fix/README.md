# Heritage Sites Media Corrective Release (release-v1-media-fix)

- Generated: 2026-10-28T17:14:51.000Z
- Mode: `publish` (ROLLBACK)
- Package: `D:\Lich_su_new\lich-su-viet-nam-interactive\supabase\content\heritage-sites\v1`
- Base Storage URL: `https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media`

## Counts
- Sites affected: 64 across 34 localities
- Media rows deleted (broken/fabricated): 64
- Media rows inserted (genuine/verified): 64
- Video rows deleted (404/fabricated): 4

## Execution
1. Apply corrective SQL (must be run in a single transaction):
   ```sql
   \i apply.sql
   ```
2. Rollback if needed:
   ```sql
   \i rollback.sql
   ```
