---
name: verify-release-slice
description: Use before reporting completion, committing a change, opening a pull request or preparing a demonstration of this project.
---

# Verify a Release Slice

## Inspect scope

1. Read the request, spec, plan, and acceptance criteria.
2. Inspect `git status` and the complete diff. Identify unrelated or generated files.
3. Confirm Word documents, environment files, credentials, build output, and local indexes are not staged.
4. Execute review yourself under the owner's one-agent policy. Label it self-review; do not imply independent review.

## Verify behavior

- Run the narrow test for the changed learner or admin journey.
- Exercise the complete journey in a real browser for UI changes.
- Follow `docs/product/DESKTOP-UI-SCOPE.md`: test laptop/PC CSS viewports 1280×720, 1366×768, 1440×900, and 1920×1080 with mouse/trackpad, keyboard navigation, meaningful focus, and reduced motion. Mobile/tablet and touch-specific checks are deferred; preserve existing responsive support.
- Inspect mixed legacy E2E files before running them; select desktop cases for the current scope. Do not claim the full suite passed when only focused cases ran.
- `pnpm test:e2e:smoke` is the isolated public, credential-free CI check. The full `pnpm test:e2e` includes legacy tests that prepare/delete database records; use only an explicitly authorized disposable test environment for those cases.
- Check loading, empty, error, and no-JavaScript or static fallbacks when applicable.

## Verify trust

- Trace changed historical claims to recorded sources and uncertainty labels.
- Check authorization at the server boundary and RLS for database changes.
- Search the diff for secrets and accidental `NEXT_PUBLIC_` exposure.

## Run the gate

Run `pnpm verify` and read the full output. For browser changes, run the relevant desktop public journeys and the smoke check; run broader integration cases only with the required disposable environment. For tooling-only work, test the scripts and clean-clone contracts; browser testing is needed when browser/CI configuration changed. Do not infer success from an earlier or partial command.

## Report

State tested acceptance criteria, exact commands and outcomes, files intentionally untouched, and remaining risks. Do not say complete when any required check failed or was skipped.
