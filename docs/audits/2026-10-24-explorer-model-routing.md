# Model routing for the explorer refinement tasks

Checked: 2026-10-24. These recommendations use the two owner-requested choices only. They are task-risk judgments, not a measured head-to-head benchmark on this repository and not a guaranteed cost/performance ranking.

## Model identification and primary documentation

- Interpret the owner's `GPT 6.1 max` as **GPT-6.1 Sol with reasoning effort max**, consistent with this project's earlier model wording. [Official model documentation](https://developers.openai.com/api/docs/models/gpt-6.1-sol) describes complex coding/professional work and lists max among supported efforts. If the owner's app maps its label differently, record the real model label; do not silently substitute another model.
- **Gemini 3.8 Flash, thinking high** is documented as `gemini-3.8-flash`, supporting low/medium/high thinking and multimodal inputs. [Official model page](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash), [thinking documentation](https://ai.google.dev/gemini-api/docs/thinking). The page positions it for agentic software work with Flash throughput/cost characteristics; that is a vendor description, not proof it is weaker or stronger than GPT on this app.
- Both can carry out substantive coding and use screenshots/tools in a suitable environment. Max/high do not replace evidence, source checks or real browser tests. Tool access depends on the owner's chosen app, not just model capability.
- No precise charge, token multiplier, subscription quota, speed ratio or savings percentage is asserted. API token prices would not directly price an unknown subscription/IDE workflow. Quality and total cost include retries and context handoffs.

## Assignment method

Complexity scores are implementation risk: 1=isolated visual value/copy, 2=bounded presentation, 3=one established integration pattern, 4=multiple dependent modules or source synthesis, 5=state/geometry/data invariants with subtle regressions.

Prefer GPT max for cross-module state/URL/cancellation work, camera geometry, uncertain source/topology decisions and final integration. Prefer Gemini high for bounded visual tuning and UI/layer integration after contracts and data have been fixed. This allocation is a pragmatic starting point, not a claim that Gemini cannot solve complex tasks or that GPT always produces better design.

| Task | Risk | Model | Reason |
| --- | :---: | --- | --- |
| 01 Lighten borders/Earth/atmosphere | 2/5 | Gemini 3.8 Flash high | Few material/stroke settings; screenshot iteration; avoid spending max on repeated small visual edits. |
| 02 Restore useful zoom and declustering | 5/5 | GPT-6.1 Sol max | Camera scale/near planes, real anchors, grouping/fan layout, hit/focus and legacy URLs interact. |
| 03 Multi-journey registry + 2 s dwell | 5/5 | GPT-6.1 Sol max | Single hardcoded journey must become a validated registry; stale arrival/timer state can corrupt a different journey. |
| 04 Restore animated spherical connector | 4/5 | GPT-6.1 Sol max | Spherical path/depth, progress ownership, cancellation and disposal must match the camera lifecycle. |
| 05 Verify/build the 34-province artifact | 5/5 | GPT-6.1 Sol max | Source rights/date/count/code crosswalk and shared-edge topology are unresolved; no fabricated fallback. |
| 06 Integrate the approved province layer | 3/5 | Gemini 3.8 Flash high | Reuse the established optional-line-layer pattern after Task 05 freezes validated data/types. |
| 07 Source and add three historical journeys | 4/5 | GPT-6.1 Sol max | Claim/coordinate precision, SGK mapping and published-only links need careful source synthesis. |
| 08 Journey chooser and compact reading UI | 3/5 | Gemini 3.8 Flash high | Work against an established registry/state API; focus, copy and desktop layout are bounded. |
| 09 Integrate and verify the complete slice | 5/5 | GPT-6.1 Sol max | Catch interactions among deep zoom, optional layers, multiple journeys, timer, path and navigation. |

The mix is **six GPT tasks and three Gemini tasks**. Do not force strict alternation when that would assign connected state changes to an unsuitable boundary or waste a handoff. Task 05 and Task 07 are independent after their prerequisites; they can be scheduled serially in a convenient order, but never by concurrent agents.

## Handoff and escalation

- Use the same workspace and one active agent at a time. The owner manually chooses the next model; prompts do not launch another AI/chat/CLI or independent reviewer.
- Each task updates `docs/audits/2026-10-24-explorer-refinement-progress.md` with only verified contracts, changed files, test evidence, unresolved issues and next allowed task. Each model reads that compact record plus its own prompt/spec; do not paste entire earlier conversations/logs repeatedly.
- A `.task-reports/` entry is the required local log, not the source of truth replacing code/spec/tests. Never claim another model's report independently verified without checking it.
- Re-run focused tests when changing shared files. Run the repository gate once per task handoff; do not repeat broad checks several times without a change/failure that justifies it.
- If a Gemini task reaches the same unresolved state/geometry failure after two evidence-based attempts, stop its edits and hand the concrete failure to the owner for a GPT task. Do not invent a visual hack or automatically spawn a stronger model.
- At handoff, state remaining required work. A model switch is not permission to rewrite previously passing modules or discard dirty files.
