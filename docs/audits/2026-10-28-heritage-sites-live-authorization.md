# Owner-authorized heritage sites release

Date: 2026-10-28, Asia/Saigon. Execution: One-agent autonomous implementation of Phases 0 through 9 under full owner delegation.

## Owner instruction verbatim

The owner explicitly instructed:
> **"khi nào xong phase 2 các phase còn lại bạn cứ tiếp tục làm không cần phải hỏi lại tôi, tôi cho phép tất cả và giao toàn quyền lại cho bạn. Bây giờ tôi đi ngủ"**

## Implementation & Release Summary

1. **Feature branch & Git publication:**
   - Completed all Phases 0 through 8.
   - Merged `feat/heritage-sites-by-locality` into `main`.
   - Release tag: `heritage-sites-v1.0`.
   - Pushed `main`, `feat/heritage-sites-by-locality`, and tag `heritage-sites-v1.0` to GitHub repository `origin` (`https://github.com/NguyenBaoChau2203/lich-su-viet-nam-interactive.git`).

2. **Schema & Data Assets:**
   - Migration: `supabase/migrations/20261101000000_heritage_sites.sql`
     - Mirrors release track copy in `supabase/releases/local-heroes-20261027/supabase/migrations/20261101000000_heritage_sites.sql`.
     - Adds `historical_locations` heritage columns (`locality_code`, `heritage_tier`, `heritage_rank`, `heritage_period`, `heritage_teaser`, `lesson_slug`).
     - Adds `heritage_story_sections`, `heritage_story_sources`, and `heritage_videos` tables with full RLS and foreign key constraints.
     - Extends `media_assets` with `usage_basis`.
   - Content package: `supabase/content/heritage-sites/release-v1/import.sql`
     - Covers all 34 canonical provinces/localities with grade-12 heritage sites.
     - Sourced citations, honest media credits, coordinates, and educational video embeds.

3. **Verification & Audit:**
   - Vitest suite: 118 test files, 1,271 tests passed (100% green).
   - Agent validation: 26 suites passed.
   - Production build: `next build` compiled cleanly with 110 static pages generated.
   - Acceptance rehearsal: `scripts/agent/heritage-rehearsal.mjs` validated all 34 localities.

## Remote Supabase Publication Steps (Production Project `lichsu_12` / `ueolfjujjybutyuyfxha`)

Because the local machine runs without an active Supabase CLI access token (`SUPABASE_ACCESS_TOKEN`), apply the release to the remote Supabase database through one of the two standard methods below:

### Option A: Using Supabase CLI (if credentials provided)
```powershell
npx supabase login
npx supabase link --project-ref ueolfjujjybutyuyfxha
npx supabase db push --workdir supabase/releases/local-heroes-20261027
npx supabase db query --file supabase/content/heritage-sites/release-v1/import.sql
```

### Option B: Using Supabase Dashboard SQL Editor (recommended, 2 steps)
1. Open the **SQL Editor** on [Supabase Dashboard (project `ueolfjujjybutyuyfxha`)](https://supabase.com/dashboard/project/ueolfjujjybutyuyfxha/sql).
2. Paste and run the contents of [`supabase/migrations/20261101000000_heritage_sites.sql`](../../supabase/migrations/20261101000000_heritage_sites.sql).
3. Paste and run the contents of [`supabase/content/heritage-sites/release-v1/import.sql`](../../supabase/content/heritage-sites/release-v1/import.sql).
