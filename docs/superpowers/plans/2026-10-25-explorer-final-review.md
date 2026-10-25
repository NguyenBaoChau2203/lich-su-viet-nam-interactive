# Final explorer review and bounded remediation

Scope: inspect the completed refinement against its design, fix demonstrated local defects, optimize measured avoidable work, run fresh gates and leave a local browser/server available for owner testing. One main agent, no external writes or historical/geography invention.

## Starting evidence

- Current branch began at `codex/refinement-task-09`; previous acceptance is partial because the real 34-unit province artifact is incomplete. Do not relabel renderer fixtures as approved geography.
- The optional country attachment has no catch for the segment-budget exception that the province attachment already handles.
- One legacy country rendering test returns a constant true instead of comparing its captured pixels.
- `GlobeMarkers` recreates ResizeObserver/MutationObserver subscriptions when the per-frame viewport changes. Measure actual observer churn before deciding on a fix.

## Work items and gates

1. Reproduce country rendering-budget failure with an envelope-valid synthetic fixture. Require core-ready, unavailable optional layer, no unhandled page error and usable event controls. Fix the attachment boundary without raising geometry budgets.
2. Replace the false-positive rendering check with a same-camera real canvas comparison. Prove the check fails if the country layer is absent.
3. Measure observer construction during a real flight. If churn is confirmed, retain subscriptions across viewport updates while preserving measured occlusion/cluster/focus behavior. Add a behavioral lifecycle regression, run red before implementation, compare before/after counters and idle rendering.
4. Inspect remaining integrated flows and existing source/precision disclosures. Run the relevant public desktop suites across the four specified sizes, keyboard/reduced-motion/fallback, plus `pnpm verify` after final edits. Record exact omitted suites and known unresolved symptoms.
5. Inspect task-owned diff/status and baseline hashes, create the ignored local report, then start a fresh production server and open the home page for owner testing. Leave the final server running and state its URL/ownership. Do not touch Word, secrets, dependencies, database state or unrelated dirty files.

Acceptance: reproduced defects are fixed with fresh evidence, measured optimization preserves behavior, local page is available, and required province-data work remains explicitly outstanding if still unresolved. No claim that all product features are complete while that source gate is missing.
