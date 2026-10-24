# Prompt — Task 07: source and register three additional historical journeys

**Recommended model:** GPT-6.1 Sol, reasoning max. **Complexity:** 4/5. Execute one task inline.

## Mission

Add three source-backed grade-12 historical milestone sequences beside the existing Hồ Chí Minh journey, using the verified registry without changing playback or camera ownership.

## Definition of done

- Four valid selectable registry entries exist, including the unchanged existing journey.
- Every new stop has evidence for its date/claim and an honestly scoped geographical anchor.
- Content, curriculum mapping, repeated locations and published-only links are verified; unsupported material stays outside production.

## Sources of truth

Read `shared-contract.md`, Task 07 in the plan, candidate sequences in the design/research review, verified Task 03 registry contracts, local SGK curriculum and existing sourced event records. Use `research-history-sources` for claim/coordinate provenance. A search snippet or failed page fetch is a research lead, not verified content.

## Verified starting state

The existing project curriculum names grade-12 Kết nối tri thức and lessons 6/7/8, but its comments still require printed/publisher-edition checking. The review establishes candidate themes, not a complete verified stop manifest. Existing public event anchors include distinct Hanoi/Sài Gòn venues; reuse when appropriate instead of relocating them. The 34-province research gate is independent of this task.

## Scope and hard constraints

In scope: source/claim/coordinate ledger, three authored data modules, registration and content tests. Out of scope: DB publication, invented event records/slugs, textbook transcription, camera/timer/path rewrites or changes to the existing Hồ Chí Minh content without separate evidence. Apply all shared constraints. These are schematic milestone connections, not exact military routes or one person's travel itinerary.

## Relevant files and patterns

Inspect `lib/sgk/curriculum.ts`, existing sourced event markdown/public inventory, `lib/explorer/journeys/registry.ts`, the extracted existing journey module and the actual `JourneyStop`/source types. Proposed modules: `mua-thu-doc-lap-1945.ts`, `khang-chien-chong-phap-1946-1954.ts`, `mua-xuan-1975.ts`; source ledger in the project's documented content-research location. Add focused content/registry tests.

## Work item — verify dates, scope and representative locations

**Problem:** Adding titles or copying chronological search results cannot provide credible selectable journeys. A source confirming a battle date does not establish an exact map coordinate.

**Required change:**

1. Confirm the project's actual textbook series/edition and relevant topic mapping using readable publisher/official materials. If precise lesson numbering cannot be checked, disclose that gap and use supported topic mapping rather than claiming page-level textbook verification.
2. Research these candidate authored sequences: `Mùa thu độc lập 1945` (Hanoi uprising → Huế uprising → Sài Gòn uprising → declaration in Hanoi; four stops); `Những mốc kháng chiến chống Pháp` (Hanoi/Toàn quốc kháng chiến → Việt Bắc 1947 → Biên giới 1950 → Điện Biên Phủ 1954 → Genève 1954; five stops); `Mùa Xuân 1975` (Buôn Ma Thuột → Huế → Đà Nẵng → Sài Gòn; four stops).
3. Record institution/author, URL/document locator, access date, supported claims, date precision and geographical precision for every stop. Distinguish the attack on Buôn Ma Thuột from full capture; broad campaigns use disclosed representative areas. No random/generated coordinates or fabricated precision. Keep returning to Hanoi in the authored 1945 chronology.
4. Write short original Vietnamese summaries and honest schematic-route notes. Reuse validated published anchors and source metadata where they support the stop; independently support any new venue/coordinate. `needs_evidence` research stays outside the production registry.
5. Register stable IDs from the plan only after required claims pass. Editorial source-only stops may have no event-detail link; link only to an actually published slug. Do not create DB events to satisfy a menu count.

**Acceptance criteria:** Four journeys total after all three datasets pass; stable pair identity, chronological authored order, readable original summaries, valid coordinates with explicit precision, and stop-level source coverage. Unsupported dates/coords stay unpublished with an exact blocker. The existing Hồ Chí Minh links/content remain compatible.

**Verification:** Add content tests for required source metadata/precision, registry pairs/order, repeated-city stops and valid published links; do not make fixtures claim external source verification. Recheck source passages directly and record their scope. Run focused content/registry tests, `pnpm history:data:check`, `pnpm verify`, diff/status. Smoke-load new shared URLs without changing their paused semantics.

## Deliverables and stop conditions

Return accepted source ledger, registered sequences/IDs and precision decisions, test evidence, missing claims if any, progress and local Task 07 report. **STOP after 07.** Do not implement the chooser or silently substitute unrelated content to reach four choices. A blocked province task does not prevent this independent content task.

## Final recap

Add three historically sourced sequences through the existing registry, preserve honest location/date uncertainty, and stop at the content handoff.
