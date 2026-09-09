---
name: verify-release-slice
description: Verify a completed feature slice with fresh evidence across behavior, history integrity, accessibility, security, and build quality. Use before reporting completion, committing a feature, opening a pull request, or preparing a demonstration.
---

# Verify a Release Slice

## Inspect scope

1. Read the request, spec, plan, and acceptance criteria.
2. Inspect `git status` and the complete diff. Identify unrelated or generated files.
3. Confirm Word documents, environment files, credentials, build output, and local indexes are not staged.

## Verify behavior

- Run the narrow test for the changed learner or admin journey.
- Exercise the complete journey in a real browser for UI changes.
- Test keyboard navigation, meaningful focus, reduced motion, and mobile layout.
- Check loading, empty, error, and no-JavaScript or static fallbacks when applicable.

## Verify trust

- Trace changed historical claims to recorded sources and uncertainty labels.
- Check authorization at the server boundary and RLS for database changes.
- Search the diff for secrets and accidental `NEXT_PUBLIC_` exposure.

## Run the gate

Run `pnpm verify` from a clean terminal and read the full output. Run `pnpm test:e2e` when browser behavior changed. Do not infer success from an earlier or partial command.

## Report

State tested acceptance criteria, exact commands and outcomes, files intentionally untouched, and remaining risks. Do not say complete when any required check failed or was skipped.
