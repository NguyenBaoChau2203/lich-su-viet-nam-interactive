# Local Revolutionary Figures, Stories and Images — Approved Design

Date: 2026-10-26, Asia/Bangkok.
Status: **OWNER APPROVED on 2026-10-26; Phase 01 is deferred for the owner to invoke with another model.** This approval-record task does not authorize or start product implementation.
Phase 00 revision: **LH-1.0.0-draft.1**. The [concrete contract](../../audits/2026-10-26-local-heroes-contract.md), [research-package JSON Schema](../../audits/2026-10-26-local-heroes-manifest.schema.json) and [versioned handoff](../../audits/2026-10-26-local-heroes-phase-00-handoff.md) now define exact interfaces and evidence gates. **Owner approval is recorded in the handoff.** Use this approved contract revision; no Phase 01 work has started.
Owner request: a new homepage feature for discovering revolutionary heroes associated with each locality, including their stories and images, with a phased execution plan assigned to Gemini 3.8 Flash High and GPT-6.1 Sol Max.

**Owner clarification in this task:** the first release must cover every province/city. A partial regional pilot is not an acceptable first public release. Use the project's 34-locality reference framework and confirm the exact canonical list in Phase 00.

## 1. Goal and learning outcome

A grade-12 learner can choose a locality, find documented revolutionary figures associated with it, understand each person's contribution through a sourced narrative and historical images, and follow the evidence and related published events.

The catalog must describe its coverage honestly. An expanding editorial catalog cannot establish that it contains every historically deserving person.

## 2. Verified starting point

Investigation on 2026-10-26:
- Before branching, local `main` and freshly fetched `origin/main` both pointed to `6a38f58`; `git rev-list --left-right --count HEAD...origin/main` returned `0 0`.
- The new local feature branch is `feat/local-revolutionary-heroes`, created from that commit. There were no tracked changes at entry; pre-existing untracked academic documents, PDFs, prompts and images remain owner files.
- `pnpm agent:status` reported 762 supported source files with no pending changes.
- `app/(public)/page.tsx` loads published events, parses explorer URL state, and renders `HistoryExplorer`. The current cinematic globe, not the older renderer recommendation in the original design, is the implementation to preserve.
- `lib/queries/figures.ts` and `app/(public)/nhan-vat/[slug]/page.tsx` already provide published figure detail, biography, media and related published events.
- `components/content/detail/FigureDetailView.tsx` already renders biography, a portrait/gallery, image credits and related events. Do not create a competing person identity or second biography route.
- `components/admin/forms/FigureForm.tsx` and `lib/actions/content.ts` already support figure editing and workflow. Extend that slice. Phase 00 corrected the earlier shorter form path against current source.
- `media_assets` already supports `figure_id`, attribution, original source page, license, era, image dimensions, focal point and honesty labels.
- Local migrations have `event_sources` but no `figure_sources` or figure-to-locality/story model. The current public `sources` policy is based on links to published events. New figure citations need deliberate public-read and source-lock extensions.
- Province data uses the `VN-34-2025` reference framework. It contains shared interior lines, not complete selectable province polygons. `lib/provinces.ts` has display names and approximate administrative centers, but no stable province codes.
- No live database inspection, complete hero inventory, image-rights review, new historical claim or model benchmark was performed by this planning task.

Repository evidence is a starting map, not proof of current remote database state. Every phase must recheck its actual starting state.

## 3. Owner-approved Phase 00 scope

The owner approved these choices on 2026-10-26, retaining the separate later review of actual candidate names:
1. Use a broad, sourced editorial category: people with documented contributions to revolutionary movements, national liberation and resistance. Display formal state honors only when sourced; do not imply everyone has an awarded `Anh hùng` title.
2. Research documented contributions whose interval intersects the inclusive years 1858–1975. A person's lifespan or later formal-award date need not fall wholly within that period. This is an approved editorial research boundary, not certification of a textbook edition.
3. Use all 34 units in the existing modern reference framework as discovery options; retain historical place names separately. Phase 00 rechecked every code/name against Appendix I, PDF pages 4–5, of Decision 19/2025/QD-TTg and pinned the code/slug/name tuples in contract section 3. This verifies the frozen reference roster, not historical-place membership or GIS geometry.
4. Prove interactions internally with a small fixture/content sample, but do not release a regional pilot. The first release requires all 34 localities to be represented by complete, sourced person/story/image records.
5. Build a finite pool from relevant existing identities, a finite owner nomination list and two recorded discovery passes (up to three source-backed leads per locality per pass; pass 2 targets gaps). Record every candidate's accepted/held/excluded decision, then present the actual names and manifest hash to the owner at the Phase 01 checkpoint. Process every accepted person; no accepted-person cap per locality. At least one complete accepted person per locality is the coverage floor, not a claim of exhaustive person coverage. Remaining gaps after the bounded passes need an explicit additional-pass proposal, never a regional public release.
6. Reuse an authentic portrait where available. A clearly captioned archival document or relevant historical image can represent a person when no authentic portrait is available; never pass context imagery off as their likeness.

The national coverage, category, period, story target, image fallback, relationship/selection policies and technical contract are owner-approved for LH-1.0.0-draft.1. The owner explicitly left Phase 01 for a different model to run later. Actual roster approval still follows Phase 01 and precedes Phase 02; no candidate approval is implied.

## 4. Approaches considered

| Approach | Result | Tradeoff |
| --- | --- | --- |
| Add a discoverable people mode to the existing homepage, with locality selector and reuse of person detail | Recommended | Meets the requested homepage entry, preserves the globe and reuses administration/media. Requires careful URL and workflow integration. |
| Add only a standalone national directory | Supporting fallback route, not the primary experience | Straightforward SSR and sharing, but insufficient as the only delivery because the owner requested the feature on the homepage. |
| Make every province polygon clickable and display every face on the globe | Defer | Current line assets cannot implement reliable polygon picking. Adds geography, overlap and performance work without being needed for locality discovery. |

The owner approved the first approach through LH-1.0.0-draft.1. The supporting SSR paths and geography limitation remain part of that contract.

## 5. Learner experience

### Homepage

Add an entry labelled `Nhân vật theo địa phương` beside existing discovery controls. The default globe composition remains available.

Activating the entry opens one nonmodal HTML panel:
- Heading `Nhân vật cách mạng theo địa phương` and a brief coverage note.
- A labelled native locality selector with `Tất cả địa phương` and the canonical locality options.
- Search by name, documented aliases and contribution summary, supporting Vietnamese input with and without diacritics.
- Paginated results, 12 distinct people per page; each result has image, name, lifespan when known, short contribution and the evidenced locality relationship.
- A person associated with several places appears once in the nationwide result, and once in each matching locality result.
- Locality membership and the coverage floor require a verified birthplace, home/origin or activity relationship with a sourced modern crosswalk. Commemoration and uncertain supplementary relationships are explained separately on detail and do not inflate locality results or coverage.
- Visible result count and locality coverage; alphabetical ordering by Vietnamese name with stable slug as tie-breaker. Do not rank moral worth or invent a contribution score.
- `Xem câu chuyện` links to the existing person route. Controls have visible focus and meaningful labels.
- `Chưa có hồ sơ đã được thẩm định cho địa phương này` for a valid empty locality. This does not mean the locality had no revolutionary figures.
- Failed data/thumbnail requests remain distinguishable from an empty result; retry does not reset filters.

The initial locality choice does not fly the camera or place a false location marker. A textual association is evidence; a camera target is presentation.

### Person detail

Extend `/nhan-vat/[slug]`:
1. Identity, sourced lifespan/aliases, portrait or explicitly labelled archival/context image.
2. `Đóng góp tiêu biểu` with citations and uncertainty where needed.
3. `Gắn với địa phương`, distinguishing birthplace, home/origin, activity and commemorative association.
4. One or more separately titled sourced stories; target 350–700 Vietnamese words for the first release's main story per person, without padding unsupported detail.
5. Related published events and existing timeline.
6. Gallery with alt text, captions, author/institution, original source page and usage basis.
7. `Nguồn tham khảo` and a safe return link to the precise homepage people filters and page.

Stories are educational paraphrases, not fictionalized scenes. Do not invent dialogue, thoughts, exact dates, places or quotes. The story length target applies to the first national release; no partial public pilot is planned.

## 6. URL, interaction and lifecycle contract

Proposed feature keys:
- `noi-dung=nhan-vat` activates the mode; absence retains the current default.
- `dia-phuong=<canonical-locality-slug>`; absence means all.
- `q-nhan-vat=<search>`, normalized and limited to 120 Unicode characters.
- `trang-nhan-vat=<positive-page>` with page size 12; invalid values normalize to page 1, excessive pages clamp after total count is known.

Keep event/year/camera/journey keys compatible with existing URLs. People searches do not reuse the event time range as a person's lifespan filter. Preserve locality IDs as strings; never lose leading zeros.

One state owner coordinates panel, history, intro and journey:
- Entering people mode cancels intro and pauses an active journey without discarding its snapshot.
- Only one primary reading panel is visible. Hide event/journey reading panels while the people panel is active.
- Switching back restores the previous event/journey selection and camera; journey remains paused until the user explicitly resumes.
- Locality/search changes reset only the people page, not unrelated event/camera values.
- Back/forward, reload, copied URLs and return from detail restore the same meaningful selection.
- Cancel stale searches/requests; an old response cannot overwrite a newer selection.
- Closing restores focus to the triggering control. No focus trap in the nonmodal panel.
- Return URLs use an allowlisted local parser/builder. Reject external schemes, protocol-relative URLs, malformed encoded input and unrelated admin paths.

SSR GET forms and ordinary links expose locality results and person stories with JavaScript disabled. Without WebGL, the HTML controls and list still work. Do not use a production fixture catalog when the database fails.

## 7. Data design and publication contract

The Phase 00 contract freezes exact SQL/type/action signatures, constraints, indexes, mutation guards and role tests. Proposed structure:

| Storage | Responsibility |
| --- | --- |
| Existing `historical_figures` | Canonical person identity/slug/biography/workflow; additive catalog flag and contribution summary with safe defaults |
| New `history_localities` | Reviewed locality codes, slugs, names, reference framework and source metadata; no inferred historical coordinates |
| New `figure_localities` | Many-to-many relation, relationship kind, original historical place label, explanation, source reference and claim certainty |
| New `figure_sources` | Figure claim keys/sections linked to existing `sources`, evidence locator and certainty |
| New `figure_stories` | Stable story identity, person FK, title, summary, body, ordering and existing workflow status semantics |
| New `figure_story_sources` | Story/claim-to-source evidence and locators |
| Existing `media_assets` + new `figure_media_evidence` | Keep figure-owned media/credit fields; separately record identity/context evidence and accepted/held usage decisions, without pretending coursework use is a license |

Proposed relation kinds: `birthplace`, `home_origin`, `activity`, `commemoration`. A commemorative association alone does not establish birthplace or activity; show and filter it separately.

Reuse the current workflow enum: `draft`, `pending_review`, `needs_revision`, `published`, `hidden`. Claim certainty is separate: `verified`, `approximate`, `disputed`, `editorial`. `Published` does not mean every date is exact.

A new catalog entry is publicly eligible only when:
- The person is published and explicitly included in the reviewed feature catalog.
- Its contribution summary and identity have scoped reliable sources.
- At least one verified, sourced birthplace/home-origin/activity association and its historical-to-reference locality mapping exist.
- At least one published, sourced story exists.
- At least one identity-checked image or clearly labelled historical context image has required provenance and an accepted usage basis.
- Draft/hidden stories, associations under revision, private review notes and unsupported honors are excluded.

Prepare the graph as draft; submit the selected primary/other stories and person together to pending review without requiring prior publication. Promote the selected pending stories and person atomically. Deferred DB checks maintain readiness on every reverse mutation. A shared transaction advisory lock, parent CAS revision and guards on raw relation/source/media writes serialize the low-volume editorial changes. Reviewer changes remain status-only. See contract sections 4–8 for exact names and transitions; none have been implemented yet.

Protect old records with defaults so unrelated published figures/media remain readable as before. Do not bulk promote legacy entries, relabel unknown media as approved, or weaken existing reviewer restrictions.

Role matrix:
- Anonymous and ordinary learners read only the public eligible graph; they cannot write.
- Active editors manage editable drafts and submit them; they cannot publish or edit published child content through a join table.
- Reviewers perform existing permitted status transitions; new relation access must not enable arbitrary content rewriting.
- Locked staff have no staff permissions. System admins follow current explicit privileges.
- New grants, RLS, public source reachability and source locking are tested together. Avoid recursive policies and definer views that reveal hidden rows.
- No new object-storage upload is needed for initial remote-source URLs. If local asset hosting is chosen, its storage and validation changes need an explicit scoped design.

## 8. Evidence and images

Every accepted record carries source title, author/institution, URL/document reference, access date, supported claims, locator and uncertainty. Use two independent sources for unstable/disputed claims. A page mentioning a person does not automatically prove birthplace, honor or the depicted image identity.

Each image needs original page, media URL or checked local path, caption, alt text, identity/context verification, creator/institution when known, usage basis/license when established, era, transformation labels and dimensions. Record unknown authorship honestly. A search-result thumbnail is a lead, not sufficient evidence.

Use the project's existing accepted coursework-use policy only within its documented scope; educational use is not an open license. Unresolved rights/identity remain a held candidate. Do not generate a photorealistic likeness of a historical person as evidence or silently colorize/reconstruct an archival image. Current photos of monuments can be labelled context and cannot become historical portraits.

Never use province administrative-center coordinates to invent a person's exact historical location. Do not infer a locality from event participation alone or from a rectangular geographic bound.

## 9. Coverage and delivery levels

Track every canonical locality in a versioned coverage ledger with:
`not_started`, `researching`, `ready_for_review`, `represented`, `blocked`; record candidates, accepted distinct people, stories, usable media and explicit gaps.

Three distinct milestones:
- **Internal technical check:** a small sample proves the complete learner/admin flow; this is not a public release or satisfaction of the requested locality coverage.
- **First national release coverage:** every one of the 34 reference localities has at least one accepted person with a documented relationship, sourced story and usable image. This is a mandatory first-release condition and says nothing about exhaustive person coverage.
- **Accepted roster complete:** every item in the finite, owner-confirmed roster has an accepted or explicitly held/excluded decision, and every accepted item has passed the data gates. Held items remain visible in the editorial ledger and are not counted as delivered public profiles.

The first release cannot be marked ready if any locality is still blocked or an accepted first-release roster item is incomplete. Report the actual numerator/denominator instead of inventing a person to meet a quota. Additional stories/people can expand the catalog after the complete national first release.

## 10. Performance, accessibility and acceptance

Desktop CSS viewports: 1280×720, 1366×768, 1440×900 and 1920×1080. Preserve existing responsive behavior; mobile/tablet redesign is deferred.

Proposed measurable budgets to confirm in Phase 00:
- Default event mode does not fetch the complete people catalog or eagerly download hero photos.
- People mode fetches one page of 12 and counts through bounded queries; no one-query-per-person pattern.
- Portrait thumbnails request at most 480px width and target at most 100 KiB per transferred thumbnail; load offscreen images lazily with reserved dimensions.
- Incremental compressed client JS for the feature targets at most 35 KiB compared with a recorded baseline. Record evidence and get a budget revision if unmet.
- No new renderer, continuous idle animation, map geometry download or dependency for the feature.
- No horizontal page overflow, obscured required controls or inaccessible pagination at the four viewports.

Test keyboard, focus restoration, WCAG AA, reduced motion, no-JS/no-WebGL, error/retry, empty state, image failure, stale responses, URL safety, multi-locality deduplication, Vietnamese search, RLS and publication races.

Use synthetic fixtures clearly separated from historical content. Browser mocks prove UI behavior, not live database permissions or historical verification.

## 11. Authority and handoff

The prior planning task created the local feature branch. Phase 00 performs read-only investigation and local contract/schema/design/plan edits on that branch; it does not create another branch or implement/publish content, create a PR, push, deploy or alter Supabase. The recommended workflow is serial: the owner selects the assigned model and runs one phase prompt at a time, with one main agent per phase and no automatic model calls or subagents.

See the accompanying implementation plan and `docs/prompts/local-revolutionary-heroes/README.md`. Phase 00 now has actual owner approval recorded in the handoff. Later phases consume that approved revision; Phase 01 remains unstarted until the owner invokes the chosen model.

## 12. Technical references

Accessed 2026-10-26:
- [GPT-6.1 Sol official model documentation](https://developers.openai.com/api/docs/models/gpt-6.1-sol): complex coding/professional work and supported `max` effort.
- [Gemini 3.8 Flash official model documentation](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash/): software engineering, multimodal input, structured output and `high` thinking; text output, not native image generation.
- [Gemini thinking](https://ai.google.dev/gemini-api/docs/thinking): thinking configuration.
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security): grants, policies and database tests.
- Installed Next.js guide: `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`.

Model allocation is a workload/risk recommendation inferred from these capabilities, not a measured head-to-head ranking. Account/IDE availability must be checked in the actual selected client.
