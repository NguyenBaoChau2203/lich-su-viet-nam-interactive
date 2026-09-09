---
name: model-supabase-history
description: Design and verify a Supabase/Postgres model for sourced historical content and basic administration. Use when creating migrations, tables, indexes, seed data, storage policies, RLS policies, or server-side Supabase access.
---

# Model Historical Data in Supabase

## Ground the design

1. Invoke the official Supabase skills when available and check current Supabase documentation.
2. Derive schema changes from a written learner or admin flow, not hypothetical future features.
3. Model reusable identities for events, people, places, periods, sources, and claim/source relationships.
4. Represent uncertain dates, locations, and interpretations explicitly; do not force false precision.

## Migrate safely

- Add an immutable migration; never edit an applied migration.
- Use stable primary keys, foreign keys, constraints, useful indexes, and UTC timestamps.
- Keep seed records clearly marked and attach sources to historical claims.
- Generate TypeScript database types after schema changes.

## Secure by default

- Enable RLS on every exposed table.
- Write least-privilege policies for anonymous readers, authenticated editors, and admins as required.
- Keep service-role access server-only and out of logs.
- Test allowed and denied operations with representative roles.
- Validate uploads by type, size, ownership, and storage policy.

## Verify

Run migrations against a disposable or local project, test constraints and RLS, inspect generated types, and run the affected application tests plus `pnpm verify`. Report rollback considerations and policies not yet covered.
