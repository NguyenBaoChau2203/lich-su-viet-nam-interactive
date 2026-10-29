# Restored Province Camera Safety — Focused Implementation Plan

> **Executor:** Cursor Agent/Auto, one main agent, inline execution and self-review. Preserve the current checkout; no automatic commits or external actions.

**Goal:** A selected province loaded through an existing close-view URL is camera-safe on its first visible frame, including accepted legacy zooms, without changing the saved view or regressing F1–F5.

**Architecture:** Reuse the existing scene pose, async layer epoch, province layer and camera-clearance pipeline. Initialize the presentation layer with current camera state at attachment; make its drawable base/lift/pick/depth policy coherent at close views.

**Sources:** `docs/audits/2026-10-29-f1-f5-rereview.md`, the approved whole-province behavior, and the existing all-34 follow-up contract. This plan addresses C1 only; national data/source recovery and the original F1–F5 runtime fixes are retained.

## Task 1 — Pin the direct-entry regression

**Files:** `tests/e2e/home-province-areas-lifecycle.spec.ts`, focused layer/camera unit tests and the existing isolated province config.

- [ ] Add `F34-restored-camera` cases for `/?noi-dung=dia-phuong&dia-phuong=ha-noi&ban-do=21.028,105.854,11` and zoom 18.
- [ ] Test the four approved desktop sizes, reduced and normal motion, without performing a resize/wheel/zoom before the safety assertion.
- [ ] Delay the area asset/build while the current camera changes, then finish loading. Require the latest pose/nonce to govern attachment and no stale mesh resurrection.
- [ ] Assert actual cap/wall/outline visibility safety and camera/near-plane clearance from the current pose; positive mesh counts alone do not prove this. Preserve exact view/URL, selected code and cards.

**Red baseline:** At 1280×720, zoom 11 places the camera at ~1.0058476425 while cap vertices remain ~1.0064. Zoom 18 places it at ~1.0000456847, below even the fixed 1.0004 base.

## Task 2 — Initialize and maintain coherent clearance

**Files:** `lib/explorer/cinematic/scene.ts`, `province-areas.ts`, narrowly necessary projection/audit types and helpers.

- [ ] After async construction and current-epoch checks, pass the latest pose/near plane and viewport resolution into the new layer before it can be selected or drawn. Do not trigger another camera flight or history update to accomplish initialization.
- [ ] Handle accepted close views whose camera is below the old constant base. Reuse the established camera-safe surface-radius pattern where appropriate; keep wall bottoms, top radius, outline, static picking transforms and audit values consistent.
- [ ] Prefer safe real geometry. If floating-point/depth limits require a geometry-only fallback at an extreme view, qualify it with a test, retain meaningful state and restore the lift as the camera moves to a drawable range. Do not silently clamp/drop a valid saved view or replace the ordinary province feature with labels.
- [ ] Retain desired versus departing selection, single-owner state, finite rendering, stable buffers, stale async disposal and all source-qualified parts/holes. No geometry-source regeneration is needed for this bug.

**Acceptance:** Initial selection is as safe as later camera interactions; a resize or zoom is not required to repair the first frame. Camera remains outside drawable geometry and it respects near-plane constraints throughout load/transition/resize. All accepted direct-entry states remain shareable and readable.

## Task 3 — Verify the narrow fix and preserved behavior

- [ ] Run focused layer tests and the new restored-view browser cases first, with first-failure bounds.
- [ ] Rerun the existing five lifecycle cases × four desktops, including X, clear and outline identity.
- [ ] If pick/base transforms change, verify the two source-qualified interior samples per province, disconnected parts and hole negatives; retain the review's independent-sample coverage in permanent tests where practical.
- [ ] Run `pnpm verify`, rebuild the dedicated fixture after source changes, and complete the existing isolated national/feature/regression/smoke release gates required by the all-34 contract. Keep configs sequential and results separate.
- [ ] Self-review the diff, save initial-load/zoom-out evidence and create `.task-reports/YYYY-MM-DD-HHmm-restored-province-camera-safety.md` with exact commands/results.

Use `$env:NoDefaultCurrentDirectoryInExePath = '1'`. Never rebuild an output while serving it. Preserve unrelated checkout work, Word files and secrets. No stage/commit, push, PR, merge, deploy or remote media/database changes.

Stop at locally verified C1 handoff. Report any failed/skipped mandatory property as incomplete; do not reopen completed source research or broad interface redesign.
