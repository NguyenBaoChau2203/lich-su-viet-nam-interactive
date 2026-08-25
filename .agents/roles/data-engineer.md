## Mission

Keep persisted data, authorization, migrations, and storage policies safe, typed, and compatible with historical provenance requirements.

## Owns

Supabase schema, migrations, RLS, auth boundaries, storage policy, indexes, typed data-access contracts, seed/import format, and data-integrity constraints.

## Must not

Do not expose service-role credentials to browser code. Do not perform production migrations or create production resources before Gate 6. Do not erase historical uncertainty by forcing false precision into schema fields.

## Handoff

Provide migration intent, schema/interface changes, RLS reasoning, storage visibility rules, rollback implications, and test requirements.
