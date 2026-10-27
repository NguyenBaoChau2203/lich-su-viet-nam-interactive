# Local revolutionary figures — implementation contract

Contract ID: **LH-1.0.0-draft.1**. Date: **2026-10-26, Asia/Bangkok**.

**Approval: OWNER APPROVED on 2026-10-26.** The owner approved LH-1.0.0-draft.1 and explicitly deferred Phase 01 to a different model that the owner will invoke later. This follow-up records approval only; it starts no research or implementation. The category, period, selection, evidence and technical contract are approved. Actual candidate names, historical claims/media and the national roster are not yet researched or approved. See the [owner approval record](2026-10-26-local-heroes-phase-00-handoff.md#owner-approval-record).

Authority: [design](../superpowers/specs/2026-10-26-local-revolutionary-heroes-design.md), [plan](../superpowers/plans/2026-10-26-local-revolutionary-heroes-plan.md), [desktop scope](../product/DESKTOP-UI-SCOPE.md), [prompt standard](../agent/AI-AGENT-PROMPT-STANDARD.md). The companion [JSON Schema](2026-10-26-local-heroes-manifest.schema.json) is part of this contract. Its definitions are documentation artifacts; the feature validator, tables, RPCs, types and tests named below do not exist yet.

## 1. Authority, baseline and evidence limits

Phase 00 rechecked branch `feat/local-revolutionary-heroes` and HEAD `6a38f582515102c03ccc7ac806ae6d3f1becbbb0`. Entry had no tracked changes and 52 untracked owner/planning artifacts. No fetch was needed or performed here: equality with a freshly fetched remote belongs to the previous planning handoff, not this invocation.

`pnpm agent:status` reported 762 supported source files, complete, without pending changes. CodeGraph supplied current source and call paths. Some responses emitted transient staleness banners while also returning current on-disk snippets; omitted sections and unsupported Markdown/JSON/SQL were read directly. The graph is not evidence about a live database.

| Evidence ID | Current source anchor | Contract implication |
| --- | --- | --- |
| E01 | [homepage:22](../../app/(public)/page.tsx#L22) | Server page awaits search params, loads events, then supplies the existing explorer. Add mode-conditional people loading here. |
| E02 | [figure query:26](../../lib/queries/figures.ts#L26), [detail route:31](../../app/(public)/nhan-vat/[slug]/page.tsx#L31) | Reuse identity, slug, published detail and staff preview; no second person route. |
| E03 | [figure presentation:21](../../components/content/detail/FigureDetailView.tsx#L21), [media:7](../../lib/media.ts#L7) | Reuse gallery, credits and honesty labels. The legacy portrait fallback has no catalog evidence guarantee. |
| E04 | [figure form:28](../../components/admin/forms/FigureForm.tsx#L28), [media manager:367](../../components/admin/MediaManager.tsx#L367), [content actions:123](../../lib/actions/content.ts#L123), [source actions:283](../../lib/actions/content.ts#L283), [media ownership:334](../../lib/actions/content.ts#L334) | The actual form is under admin/forms; the earlier prompt's shorter form path is stale. Existing after-save link updates are separate requests, unsuitable for an atomic graph save. |
| E05 | [readiness:58](../../lib/admin/readiness.ts#L58), [review transitions:16](../../lib/admin/review.ts#L16), [review action:64](../../lib/actions/review.ts#L64) | Catalog readiness must be stricter and conditional; preserve existing review transitions and status-only reviewer behavior. |
| E06 | [admin restore:94](../../lib/actions/admin-content.ts#L94), [permissions:42](../../lib/admin/content-kinds.ts#L42), [auth:40](../../lib/auth.ts#L40) | Reuse authenticated staff lookup and explicit admin restoration; locked staff have no staff permissions. |
| E07 | [explorer:39](../../components/explorer/HistoryExplorer.tsx#L39), [history:59](../../components/explorer/HistoryExplorer.tsx#L59), [playback:55](../../lib/explorer/journeys/playback.ts#L55) | HistoryExplorer owns runtime, history and dwell scheduling. Add people transitions to this owner. |
| E08 | [return parser:120](../../lib/explorer/url.ts#L120), [map builder:18](../../lib/explorer/map-state.ts#L18) | The existing allowlist excludes people keys and limits returns to 240 characters; extend intentionally, with tests. |
| E09 | [camera contract:23](../../lib/explorer/globe-contract.ts#L23), [cinematic intro:234](../../components/explorer/cinematic/CinematicEventMap.tsx#L234) | Current props have no reading-mode suspension input. Explicit cancellation must reach this adapter, without mounting another renderer. |
| E10 | [base schema](../../supabase/migrations/20260924000001_create_tables.sql), [RLS](../../supabase/migrations/20260924000003_rls_policies.sql), [source policies](../../supabase/migrations/20260925000003_sources_editor_rls.sql), [media policies](../../supabase/migrations/20260929000001_media_library.sql) | No figure story/locality/citation tables exist in local migrations. Public sources are reached through published events; broad reviewer/admin relation policies need catalog-specific guards. |
| E11 | [reviewer trigger](../../supabase/migrations/20260925000005_reviewer_status_only_fix_geom.sql) | Its allowed-column comparison must continue to reject reviewer content changes. Derived revision updates must run after that comparison. |
| E12 | [province audit](2026-10-25-province-boundaries-final-review.md), [membership](sources/2026-10-24-vietnam-province-membership.json), [provenance](../../public/maps/history-vietnam-province-boundaries.provenance.json) | Modern shared-interior reference lines; no province polygons, historical borders or point-in-province assignment. |
| E13 | [read-only browser fixture](../../tests/e2e/journey-catalog-server.mjs), [smoke config](../../playwright.smoke.config.ts), [build environment](../../scripts/agent/smoke-env.mjs) | Reuse the separation of fixture UI evidence and real DB evidence, not the existing fixed ports or shared build output. |
| E14 | [media-use ledger](2026-10-25-journey-popup-media-sources.md), [claim/media records](sources/2026-10-25-journey-media.json) | Existing coursework permission is bounded; it does not establish an open license or verify a different person's image. |

The prior task's local report was inspected for context. It is not a versioned approval record. No previous versioned Phase 00 contract/handoff existed. Current remote schema/content, a disposable DB, actual RLS outcomes, nationwide person/media evidence and fresh browser/GPU timings remain **unverified**.

## 2. Owner-approved decisions

| Decision | Approved value | Owner confirmed? |
| --- | --- | --- |
| First public release | All 34 reference localities have a complete eligible person, sourced main story and usable image; every accepted roster person is complete | **Yes** |
| Category | Sourced contributions to revolutionary movements, national liberation and resistance; public heading `Nhân vật cách mạng theo địa phương` | **Yes — 2026-10-26** |
| Formal honors | Display only a separately sourced formal title; catalog membership confers no title | **Yes — 2026-10-26** |
| Research period | A documented contribution interval intersects inclusive years **1858–1975**; lifespan and later award dates need not be inside it | **Yes — 2026-10-26** |
| Coverage relationship | Verified `birthplace`, `home_origin` or `activity`, with evidenced mapping to the reference locality | **Yes — 2026-10-26** |
| Supplementary relationships | Approximate/disputed relationships and `commemoration` may be explained honestly on detail; they do not satisfy coverage or locality-list membership | **Yes — 2026-10-26** |
| Main story | One primary sourced narrative per accepted person, 350–700 whitespace-delimited Vietnamese words; no invented padding | **Yes — 2026-10-26** |
| Image fallback | Authentic portrait, or clearly labelled authentic archival document/historical context; no generated likeness, present-day monument substitute or unlabelled reconstruction | **Yes — 2026-10-26** |
| Initial discovery | Homepage HTML selector/search/list, existing detail route, retained globe; no polygon picking or camera flight on locality selection | **Yes — 2026-10-26** |
| Finite roster | The two-pass nomination and explicit decision/freeze process below; actual names require a later owner review of the Phase 01 manifest | **Yes — 2026-10-26** |

The period is an editorial research boundary, not a claim about a certified textbook edition. An unsupported identity, contribution or qualifying relationship blocks acceptance. An uncertain optional date may remain null or explicitly approximate/disputed.

### Finite first-release roster policy

1. Phase 01 takes a dated, read-only identity snapshot of existing figures when available. Include existing matching identities as candidates, not automatically as accepted content. If remote identity access is unavailable, mark reconciliation incomplete and block any import that could duplicate them.
2. Discovery pass 1 records up to three distinct, source-backed leads per locality, plus a finite owner-supplied nomination list and relevant existing identities. Record source and originating locality for each nomination; deduplicate by canonical person before decisions.
3. Discovery pass 2 records up to three additional leads for each locality without a complete qualifying candidate. Finish this bounded pass and report any remaining gaps. Do not claim to have discovered every deserving historical person.
4. Every nominated identity receives `accepted`, `held` or `excluded` with a reason. `accepted` means selected for this release and meeting the category/period/relationship policy in principle; it is separate from `complete` evidence readiness. A missing story/image can still leave an accepted person incomplete and block release.
5. Freeze the finite pool, decisions, version and content hash. The owner reviews the actual names and decisions at the Phase 01 checkpoint before Phase 02 uses the roster as release scope. This second checkpoint cannot be substituted with approval of this empty policy.
6. Every accepted person must be completed. There is no per-locality accepted-person cap. Additional qualified nominations need a visible manifest revision; removing/downgrading an accepted person needs an explicit owner decision with the previous/new hashes and reason. Never shrink the denominator or silently drop difficult records.
7. If a gap remains after the two passes, report its exact missing evidence and propose a bounded additional nomination pass for owner review. No regional public release is a fallback. Phase 06 batches at most ten distinct people, in ascending uncovered locality code then person key, followed by remaining accepted person keys.

Distinct-person total can be below 34: one genuinely multi-locality person may count in several localities. Coverage is a set of locality codes, not a count of person rows.

## 3. Canonical reference registry

Framework ID: `VN-34-2025`. Codes are **two-character strings**, never numeric IDs or OSM ISO tags. Slugs below are frozen discovery identifiers; they do not assert historical naming.

The 34 code/name pairs were checked against the existing audited crosswalk and visually rechecked on **PDF pages 4–5, Appendix I**, of the Prime Minister's [Decision 19/2025/QD-TTg](https://datafiles.chinhphu.vn/cpp/files/vbpq/2025/7/19ttg.signed.pdf), dated 2025-06-30. Fresh bytes on 2026-10-26: 2,631,808; SHA-256 `2fd391335947affbfb86fa2b9438f0fdca90694e80887e205266542c3236aea1`. The Government portal's [Resolution 202/2025/QH15 page](https://xaydungchinhsach.chinhphu.vn/toan-van-nghi-quyet-so-202-2025-qh15-ve-sap-xep-don-vi-hanh-chinh-cap-tinh-119250612174148722.htm), accessed 2026-10-26, supports the 34-unit reference. These sources establish identities for this frozen framework, not GIS rights or a perpetual claim about current boundaries.

| Code | Slug | Official reference name |
| --- | --- | --- |
| 01 | ha-noi | Thành phố Hà Nội |
| 04 | cao-bang | Tỉnh Cao Bằng |
| 08 | tuyen-quang | Tỉnh Tuyên Quang |
| 11 | dien-bien | Tỉnh Điện Biên |
| 12 | lai-chau | Tỉnh Lai Châu |
| 14 | son-la | Tỉnh Sơn La |
| 15 | lao-cai | Tỉnh Lào Cai |
| 19 | thai-nguyen | Tỉnh Thái Nguyên |
| 20 | lang-son | Tỉnh Lạng Sơn |
| 22 | quang-ninh | Tỉnh Quảng Ninh |
| 24 | bac-ninh | Tỉnh Bắc Ninh |
| 25 | phu-tho | Tỉnh Phú Thọ |
| 31 | hai-phong | Thành phố Hải Phòng |
| 33 | hung-yen | Tỉnh Hưng Yên |
| 37 | ninh-binh | Tỉnh Ninh Bình |
| 38 | thanh-hoa | Tỉnh Thanh Hóa |
| 40 | nghe-an | Tỉnh Nghệ An |
| 42 | ha-tinh | Tỉnh Hà Tĩnh |
| 44 | quang-tri | Tỉnh Quảng Trị |
| 46 | hue | Thành phố Huế |
| 48 | da-nang | Thành phố Đà Nẵng |
| 51 | quang-ngai | Tỉnh Quảng Ngãi |
| 52 | gia-lai | Tỉnh Gia Lai |
| 56 | khanh-hoa | Tỉnh Khánh Hòa |
| 66 | dak-lak | Tỉnh Đắk Lắk |
| 68 | lam-dong | Tỉnh Lâm Đồng |
| 75 | dong-nai | Tỉnh Đồng Nai |
| 79 | ho-chi-minh | Thành phố Hồ Chí Minh |
| 80 | tay-ninh | Tỉnh Tây Ninh |
| 82 | dong-thap | Tỉnh Đồng Tháp |
| 86 | vinh-long | Tỉnh Vĩnh Long |
| 91 | an-giang | Tỉnh An Giang |
| 92 | can-tho | Thành phố Cần Thơ |
| 96 | ca-mau | Tỉnh Cà Mau |

The registry stores no coordinates. Each relationship preserves the historical place label and a citation establishing the modern crosswalk. A source naming an old province is insufficient to assign a modern locality without that mapping.

## 4. Persistence contract

All objects in this section are **to be created in Phase 02**. Use an additive CLI-generated migration with a version greater than the actual highest existing migration (currently `20261031000000`). Do not edit applied migrations. Validate prerequisites on a disposable local DB: UTF-8, PostgreSQL 15+, ICU support, current migrations and generated types. Missing prerequisites block the DB gate; do not silently choose another collation.

### Common domains and constraints

- Reuse `public.content_workflow_status`: `draft | pending_review | needs_revision | published | hidden`.
- Certainty is text with a named CHECK: `verified | approximate | disputed | editorial`. It is independent of workflow.
- Relationship kinds: `birthplace | home_origin | activity | commemoration`.
- UUID defaults are `gen_random_uuid()`. New timestamps are `timestamptz NOT NULL DEFAULT now()`, UTC on the wire.
- All new text fields are NFC; nonblank required text is `length(btrim(value)) > 0`. Reject control characters, unsafe URLs and unsupported rich text at the action boundary and offline validator.
- Named PKs are `<table>_pkey`; named FKs are `<table>_<column>_fkey` unless specified below. UUID identity columns are immutable. Parent reassignment is forbidden; create a new relation instead.

### Existing historical_figures: additive columns only

| Exact column | Type / default | Constraint or derivation |
| --- | --- | --- |
| is_local_hero | boolean NOT NULL DEFAULT false | No legacy row is enrolled by migration |
| contribution_summary | text NULL | `historical_figures_contribution_summary_check`: null or 1–600 characters |
| contribution_start_year | integer NULL | Paired with end; source-backed contribution interval |
| contribution_end_year | integer NULL | `historical_figures_contribution_years_check`: both null, or both in 1–2200 and start <= end |
| catalog_aliases | text[] NOT NULL DEFAULT '{}' | `historical_figures_catalog_aliases_check`: <=20 nonblank entries, each <=160 characters, no duplicates |
| local_hero_revision | bigint NOT NULL DEFAULT 0 | `historical_figures_local_hero_revision_check`: >=0; server-owned, returned as decimal string |
| local_hero_search_text | text NOT NULL DEFAULT '' | Server-derived folded name + verified catalog_aliases + contribution_summary |

Keep all existing identity, biography, portrait, workflow and event relationships. New catalog presentation uses sourced `catalog_aliases`; it does not infer aliases by splitting legacy prose. A nonempty displayed biography needs its scoped citation. Unknown life dates remain null.

Indexes: `historical_figures_local_hero_order_idx` on `(name COLLATE public.local_heroes_vi, slug COLLATE "C") WHERE is_local_hero AND workflow_status = 'published'`. Create `public.local_heroes_vi` with `provider = icu, locale = 'vi', deterministic = true`. Keep the existing unique slug. No new search extension is required for this bounded catalog.

### New tables and exact fields

In the rows below, `text!` means `text NOT NULL`, `uuid!` means `uuid NOT NULL`. Fields with no explicit default require an input. All six tables enable RLS at creation.

| Table | Exact columns and defaults | Keys / checks / indexes |
| --- | --- | --- |
| history_localities | `code text!`; `slug text!`; `official_name text!`; `reference_framework text! DEFAULT 'VN-34-2025'`; `source_url text!`; `source_locator text!`; `source_accessed_at date NOT NULL` | PK code; `history_localities_slug_key` UNIQUE(slug); `history_localities_code_check` exactly the 34 codes; `history_localities_framework_check` exact framework; `history_localities_reference_check` verifies each code/name/slug tuple from section 3 through migration seed and test. No application DML after seed. |
| figure_sources | `figure_id uuid!`; `claim_key text!`; `source_id uuid!`; `claim_text text!`; `locator text!`; `scope_note text!`; `certainty text!`; `uncertainty_note text NULL` | PK(figure_id,claim_key,source_id); FK figure -> historical_figures ON DELETE CASCADE; source -> sources ON DELETE RESTRICT; `figure_sources_claim_key_check`; `figure_sources_certainty_check`; `figure_sources_evidence_check` nonblank text/locator/scope; `figure_sources_source_idx`(source_id,figure_id). |
| figure_localities | `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`; `figure_id uuid!`; `locality_code text!`; `relationship_kind text!`; `historical_place_label text!`; `explanation text!`; `claim_key text!`; `primary_source_id uuid!`; `certainty text!`; `uncertainty_note text NULL` | `figure_localities_identity_key` UNIQUE(figure_id,locality_code,relationship_kind); figure FK CASCADE; locality FK RESTRICT; `figure_localities_claim_fkey` (figure_id,claim_key,primary_source_id) -> figure_sources(figure_id,claim_key,source_id) RESTRICT; named kind/certainty/text checks; `figure_localities_locality_idx`(locality_code,figure_id); `figure_localities_source_idx`(primary_source_id). |
| figure_stories | `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`; `figure_id uuid!`; `slug text!`; `title text!`; `summary text!`; `body text!`; `sort_order integer NOT NULL DEFAULT 0`; `is_primary boolean NOT NULL DEFAULT false`; `workflow_status content_workflow_status NOT NULL DEFAULT 'draft'`; `review_note text NULL`; `created_at timestamptz NOT NULL DEFAULT now()`; `updated_at timestamptz NOT NULL DEFAULT now()` | figure FK CASCADE; `figure_stories_figure_slug_key` UNIQUE(figure_id,slug); `figure_stories_id_figure_key` UNIQUE(id,figure_id); `figure_stories_content_check`: slug pattern, title 1–200, summary 0–600, body 0–20000 chars, sort_order >=0; `figure_stories_public_note_check` published -> review_note IS NULL; `figure_stories_one_primary_idx` UNIQUE(figure_id) WHERE is_primary; `figure_stories_public_order_idx`(figure_id,workflow_status,sort_order,id). |
| figure_story_sources | `story_id uuid!`; `claim_key text!`; `source_id uuid!`; `claim_text text!`; `locator text!`; `scope_note text!`; `certainty text!`; `uncertainty_note text NULL` | PK(story_id,claim_key,source_id); story FK CASCADE; source FK RESTRICT; named claim-key/certainty/evidence checks as figure_sources; `figure_story_sources_source_idx`(source_id,story_id). |
| figure_media_evidence | `media_id uuid PRIMARY KEY`; `figure_id uuid!`; `depiction_kind text!`; `decision text NOT NULL DEFAULT 'held'`; `identity_source_id uuid!`; `identity_locator text!`; `identity_certainty text!`; `usage_basis text!`; `usage_source_id uuid NULL`; `usage_locator text NULL`; `usage_note text NULL`; `checked_at timestamptz NULL` | `media_assets_id_figure_key` UNIQUE(id,figure_id) on existing media_assets; `figure_media_evidence_owner_fkey`(media_id,figure_id) -> media_assets(id,figure_id) ON DELETE CASCADE; figure FK CASCADE; identity/usage source FKs RESTRICT; `figure_media_evidence_depiction_check` portrait/historical_context; `figure_media_evidence_decision_check` accepted/held; `figure_media_evidence_certainty_check` verified/approximate/disputed/editorial; `figure_media_evidence_usage_check` open_license/public_domain/permission/coursework_reference/unknown; `figure_media_evidence_acceptance_check` applies rules below; indexes `figure_media_evidence_figure_idx`(figure_id,decision), `figure_media_evidence_identity_source_idx`(identity_source_id), `figure_media_evidence_usage_source_idx`(usage_source_id). |

The named relationship checks are `figure_localities_kind_check`, `figure_localities_certainty_check`, `figure_localities_text_check` and `figure_localities_claim_key_check` (claim_key equals locality:code:kind). Citation claim keys match `^[a-z][a-z0-9_-]*(?::[a-z0-9_-]+)*$` and are at most 160 characters. Within an owner/claim-key group, claim_text, certainty and uncertainty_note agree; enforce with deferred validation. Incomplete drafts may omit evidence collections, keep contribution fields null and save an empty story body/summary; pending/published readiness requires their real nonempty values.

CHECK constraints use only their row. `figure_media_evidence_acceptance_check` checks accepted -> verified identity, nonblank identity locator, checked_at, nonunknown usage, and either usage source+locator or a coursework usage_note; base image/parent/source requirements are cross-table deferred checks. `history_localities_reference_check` is a literal IN list of the 34 tuples, not a query against another table. `historical_figures_catalog_aliases_check` calls pure `public.local_hero_aliases_valid(p_values text[]) RETURNS boolean IMMUTABLE SECURITY INVOKER` for array length, nonnull/nonblank <=160-character entries, NFC and uniqueness; grant its EXECUTE only to authenticated, with no private-table access. Named text/kind/certainty checks on citations and relationships enforce the row-local rules above; group consistency is deferred.

Required figure claim keys: `identity`, `contribution`, `period`; `biography`, `birth_year`, `death_year` and `aliases` when their displayed values are present. A relationship uses exactly `locality:<two-digit-code>:<relationship-kind>`. Optional formal honors use `honor:<stable-slug>`; render only verified, explicitly sourced titles. A locator identifies the paragraph/page/section that supports this claim, not merely the person's name somewhere on a page.

### Evidence and media readiness

Sources reuse existing `sources` fields, with nonblank title/citation and at least one of author_org/publisher, a URL or catalog reference, and accessed_at for every catalog citation. Web URLs must be HTTPS without credentials. A source can support several claims with separate locators. Disputed claims need at least two independently originated sources and a conflict note; syndication is not independence.

An accepted representative image has: matching figure ownership; media_type=image; era=historical or an explicitly labelled historical illustration; verified identity/context, checked_at, alt text, caption, source_page_url, positive dimensions, credit or honest unknown-author text, and an accepted usage basis. Portraits cannot be illustrations, reenactments or colorized reconstructions presented as an original likeness. A context image must say `Tư liệu bối cảnh, không phải chân dung`. Present-day media may remain in the legacy gallery but cannot satisfy catalog readiness.

`open_license`, `public_domain` and `permission` require usage_source_id and a specific usage_locator. `coursework_reference` requires a usage_note citing the existing owner policy and original source attribution; it does not manufacture a license, and does not authorize asset upload or broader publication. `unknown` and held/uncertain identity cannot satisfy readiness. A failed runtime image uses a labelled visual fallback and never changes the stored research decision.

Keep existing `media_assets` attribution/URL/cover/era/size fields and storage ownership policies. Do not automatically copy portrait_url into accepted media or label old images accepted. `figure_media_evidence` supplies missing review/usage facts rather than overloading the license field.

Catalog readiness branches from the existing readiness snapshot by is_local_hero. It checks accepted usage evidence rather than inheriting the old “every image needs a nonempty license string” gate; coursework_reference with an honest null license is allowed when the bounded usage rule passes. Legacy readiness is unchanged. Keep current media-form limits (alt text <=300, caption <=500, photographer <=200); do not invent a license string to make the old checklist green.

## 5. Publication, mutation and concurrency

### Readiness invariant

For a catalog person to be pending review: selected stories may be `pending_review` (not yet published); the complete identity/contribution/period claims, one verified noncommemorative locality mapping and one accepted image must already pass readiness. The selected primary story is sourced and 350–700 words. Unselected draft/held stories are excluded from readiness and public reads.

For `is_local_hero = true AND workflow_status = published` at commit:

1. Required displayed claim groups are sourced; identity/contribution/period and at least one qualifying locality claim are verified. The contribution interval intersects 1858–1975.
2. Exactly one primary story is published and sourced, meeting the word target; every published story has valid citations. Other stories may remain draft/needs_revision/hidden and are not public.
3. At least one matching accepted image passes the media rules. Representative selection is deterministic: eligible is_cover first, then sort_order NULLS LAST, then media ID.
4. Published person and stories have review_note=NULL. No private review notes enter public DTOs.

Legacy figures with is_local_hero=false bypass only these new catalog-specific requirements. Existing rules remain. Enrolling an already published legacy identity uses an intentional admin restore/edit/review flow, preserving its ID and event links; do not quietly toggle its flag or rewrite it during migration. Restoring temporarily withdraws that profile, as the existing admin action explains.

### Atomic commands

Every graph RPC is SECURITY INVOKER, uses the caller's session, checks auth.uid() and current active staff role from the DB, and runs in one transaction. No service-role action or client-supplied role is accepted.

| Command | Allowed actor/state | Exact transaction effect |
| --- | --- | --- |
| saveLocalHeroGraph | active editor/system_admin; parent draft/needs_revision, or new draft | Lock parent, compare revision, validate all IDs/ownership and references; update permitted identity/catalog fields and replace submitted relation/citation/story/evidence collections atomically. Omitted graph rows are deletions. Never delete base media/source records as a side effect. |
| submitLocalHeroGraph | active editor/system_admin; draft/needs_revision | Validate the intended graph with chosen story IDs, including primary; move those draft/needs_revision stories to pending_review, then parent to pending_review. Leave unselected drafts private. Deferred checks see the final pending graph, avoiding circular published prerequisites. |
| reviewLocalHeroGraph: publish | reviewer/system_admin; parent pending_review | Recheck readiness and expected revision; promote all and only this parent's pending_review stories, then parent, to published; clear their review notes. No content fields change. |
| request_revision | reviewer/system_admin; parent pending_review | Move pending_review stories and parent to needs_revision; persist the 5–2000 character reason. |
| hide | reviewer/system_admin; parent published | Hide published stories and parent together; keep review notes as current semantics require. No content deletion. |
| republish | reviewer/system_admin; parent hidden | Publish only explicitly selected hidden stories, including primary, and parent, after revalidation; clear notes. Other hidden/draft stories stay private. |
| restoreLocalHeroDraft | system_admin only; any existing state | Withdraw parent and reset its nondraft stories to draft in one transaction; clear review notes. Equivalent withdrawal intent to existing admin restoration. Content remains unchanged. |

Existing generic figure submit/review/restore actions dispatch catalog people to these commands. Noncatalog paths retain current behavior. Generic media and source actions still use their existing ownership checks, plus the DB guards below. Editing a pending/published/hidden catalog graph is denied for every staff role until explicit restoration; reviewer ability is status-only, including through joins.

Save ordering is fixed: lock/CAS and validate references; save the editable parent; upsert figure claim/source groups; clear a displaced primary-story flag before assigning the new primary; upsert story rows and their citations; upsert locality/evidence rows; remove omitted dependent locality/media-evidence/story-source/story rows; remove now-unreferenced omitted figure citations last. Never delete a cited source first or rely on RESTRICT FKs being deferred. Base media/source creation/deletion remains outside this graph replacement. Validate all deferred graph constraints before returning success.

### DB enforcement and reverse maintenance

- `private.local_hero_lock_writes() RETURNS trigger` acquires **transaction** advisory lock `pg_advisory_xact_lock(18012,3401)`. Install BEFORE STATEMENT `trg_lh_lock_writes` on historical_figures, sources, media_assets and the five mutable new tables. Acquire the same lock at RPC entry before row locks. The registry is immutable. This deliberately serializes low-volume editorial writes, including shared source updates, and closes link-insertion/source-edit races without session locks.
- `private.local_hero_guard_mutation() RETURNS trigger`, BEFORE ROW `trg_00_lh_guard`, checks OLD and NEW ownership, actor/state, immutable IDs, allowed status transitions and server-owned input fields. A published/pending/hidden parent blocks content changes to citations, locality rows, stories, media and media evidence through *all* action and raw REST paths. A reviewer cannot insert/delete/update source, locality or image content merely because an old permissive policy exists.
- `private.local_hero_assert_graph(p_figure_id uuid) RETURNS void` checks the final stored graph. `private.local_hero_check_deferred() RETURNS trigger` invokes it for affected parents. Install AFTER ROW constraint trigger `trg_lh_graph_integrity`, **DEFERRABLE INITIALLY DEFERRED**, on those same eight mutable tables. On source changes inspect every referencing figure, including media identity/usage and story sources. On deletion/reassignment inspect OLD and NEW owners. Public guards do not rely on a UI action having run.
- `private.local_hero_touch_parent() RETURNS trigger` bumps parent revision on child/media/source changes by a no-op parent UPDATE. `private.local_hero_derive_fields() RETURNS trigger`, `trg_zz_lh_derive` on parent BEFORE INSERT/UPDATE, computes revision/search text **after** the existing `trg_reviewer_status_only` has compared incoming content. `trg_00_lh_guard` rejects any caller-supplied revision/search alteration. Derived updates cannot become a reviewer write exemption. Revision is opaque, may advance more than once per graph command, and never comes from client arithmetic.
- Mutation/derived/invariant trigger functions may be SECURITY DEFINER only where necessary for complete graph visibility/parent revision writes. Keep them in the unexposed `private` schema, search_path='', fully qualified objects, no dynamic caller SQL, no user-granted EXECUTE, no data-returning definer view. They are trigger-only, with authorization performed before any privileged mutation. No public helper bypasses RLS.
- Source FKs RESTRICT deletion of new evidence links. Additionally protect metadata UPDATE/DELETE if *any* referencing catalog parent is pending_review/published/hidden, for editor, reviewer and system_admin alike. This includes source paths through figure_sources, figure_story_sources, figure_localities and figure_media_evidence identity/usage, and existing media_assets.source_id. An admin must restore every affected protected catalog before correction. Preserve existing event/media source locks and extend `public.source_locked_for_editor(uuid)` with these new paths.
- Revoke/replace old broad policies where necessary; adding another permissive policy does not restrict existing ones. Maintain named policies below and universal guard triggers so the old reviewer_admin_manage route cannot rewrite catalog children.
- Every last-source/story/image/association mutation either is denied before changing a protected graph, or fails the deferred invariant and rolls back the entire transaction. No “save parent then fail links” partial success is allowed.
- Perform explicit `SET CONSTRAINTS ALL IMMEDIATE` at the end of mutation RPCs before constructing success, so failed deferred checks cannot return an apparently successful JSON result.

Fresh-read CAS under the global transaction lock rejects a stale expectedRevision before writing. If concurrent sessions remove different required links or race publication/source edits, at most the valid transaction commits; the later actor rechecks current graph/revision. Serialization/deadlock errors map to STALE and require reload, without automatic replay of edits.

## 6. Grants, RLS and public source reachability

Each new table first REVOKEs inherited/default grants from PUBLIC/anon/authenticated, ENABLEs RLS, then grants SELECT to anon/authenticated. Only mutable tables grant INSERT/UPDATE/DELETE to authenticated, restricted by RLS and triggers. history_localities has SELECT only. Do not change default privileges for unrelated functions/tables.

Public predicates form an acyclic graph: historical_figures published flag -> new child visibility -> source reachability. Do **not** make the parent SELECT policy call child readiness, which would recurse through child policies. At commit the database invariant guarantees a published enrolled parent is ready.

| Object / policy name | Public SELECT predicate | Staff/mutation policy |
| --- | --- | --- |
| history_localities / `lh_localities_read` | canonical seeded rows | no application mutation |
| figure_sources / `lh_figure_sources_public` | parent is published and enrolled | `lh_figure_sources_staff` active staff SELECT; `lh_figure_sources_editable` editor/admin only, parent draft/needs_revision, USING and WITH CHECK |
| figure_localities / `lh_localities_public` | published enrolled parent, supported verified/approximate/disputed row with note where needed | `lh_localities_staff` active staff SELECT; `lh_localities_editable` editor/admin editable parent, OLD/NEW checked |
| figure_stories / `lh_stories_public` | story published and parent published/enrolled | `lh_stories_staff` active staff SELECT; `lh_stories_editable` editor/admin editable parent, draft/needs_revision story; `lh_stories_review` reviewer/admin status transitions only, guarded at DB |
| figure_story_sources / `lh_story_sources_public` | story and parent published/enrolled | `lh_story_sources_staff` active staff SELECT; `lh_story_sources_editable` editor/admin with editable parent/story |
| figure_media_evidence / `lh_media_public` | accepted evidence and parent published/enrolled | `lh_media_staff` active staff SELECT; `lh_media_editable` editor/admin editable parent |

For `lh_stories_editable`, USING restricts OLD story to draft/needs_revision with editable parent; WITH CHECK permits the matching draft/needs_revision/pending_review target during submission. New stories must start draft. `lh_stories_review` permits only the review transitions in section 5, plus system_admin restoration to draft; the parent/child final-state constraint still applies. There is no reviewer INSERT/DELETE policy. The guard rejects content-field changes even if a status UPDATE policy matches.

Use current_staff_role(), not user_metadata/JWT role assertions, for staff authorization. Locked staff and ordinary learners have public SELECT only. New catalog media SELECT requires accepted evidence; add the equivalent guard to existing media_assets public policy for enrolled figures, preserving noncatalog/event/location branches. Rejected/held catalog images cannot leak through the old nested figure media query. Existing staff SELECT remains available for previews.

Extend existing `sources.public_read_published` as an OR of:

1. Existing published-event source reachability, unchanged.
2. Public figure_sources rows.
3. Public figure_story_sources rows.
4. An accepted/public figure_media_evidence identity_source_id or usage_source_id, and accepted public media_assets.source_id.

Do not expose unrelated/draft-only sources, source-lock inventories, held media evidence or staff review notes. Sources shared with a published event remain public through the original branch even when a figure draft references them; that is legitimate existing reachability. Source predicates must not query the sources table again.

| Actor | Read public graph | Read drafts/preview | Save/submit draft | Review status | Edit protected child/source |
| --- | --- | --- | --- | --- | --- |
| anon | yes | no | no | no | no |
| ordinary learner/auth without active staff profile | yes | no | no | no | no |
| active editor | yes | yes | yes | no | no |
| locked editor/reviewer/admin | yes | no | no | no | no |
| active reviewer | yes | yes | no | permitted transitions only | no |
| active system_admin | yes | yes | yes; explicit restore supported | yes | only after withdrawal/restoration of all affected catalog parents |

Public page/profile RPCs are SECURITY INVOKER STABLE, EXECUTE granted only to anon/authenticated after REVOKE from PUBLIC. Mutation RPCs are SECURITY INVOKER VOLATILE, EXECUTE granted only to authenticated after REVOKE from PUBLIC/anon. No broad EXECUTE grant over a schema; no service-role client is added.

`public.local_hero_fold(text)` is a pure IMMUTABLE SECURITY INVOKER normalizer with EXECUTE explicitly granted to anon/authenticated after REVOKE from PUBLIC, since the read-only page RPC calls it. It reads no private data. The alias validator above is the only additional application-executable write helper; all privileged trigger helpers remain unexposed and noncallable by application roles.

## 7. Frozen public types and server interfaces

Create `lib/local-heroes/types.ts` in Phase 02. Everything crossing a server/client boundary is JSON serializable; no Date, Set, bigint, Supabase row or internal error object crosses it. UUIDs/slugs/code strings are validated at runtime, not branded into safety by a TS cast.

~~~ts
type Certainty = "verified" | "approximate" | "disputed" | "editorial";
type Workflow = "draft" | "pending_review" | "needs_revision" | "published" | "hidden";
type RelationshipKind = "birthplace" | "home_origin" | "activity" | "commemoration";
type LocalityCode = "01" | "04" | "08" | "11" | "12" | "14" | "15" | "19" |
  "20" | "22" | "24" | "25" | "31" | "33" | "37" | "38" | "40" | "42" |
  "44" | "46" | "48" | "51" | "52" | "56" | "66" | "68" | "75" | "79" |
  "80" | "82" | "86" | "91" | "92" | "96";
type LocalityRef = {
  code: LocalityCode; slug: string; officialName: string;
  referenceFramework: "VN-34-2025";
};
type LocalHeroFilters = { localityCode: LocalityCode | null; query: string; page: number };
type SourceCitation = {
  sourceId: string; title: string; authorOrg: string | null; publisher: string | null;
  sourceType: "book" | "article" | "official" | "web" | "archive" | "other";
  url: string | null; citation: string; publishedYear: number | null;
  accessedAt: string; locator: string; scopeNote: string;
};
type PublicClaim = {
  key: string; text: string; certainty: Certainty;
  uncertaintyNote: string | null; sources: SourceCitation[];
};
type LocalHeroAssociation = {
  id: string; locality: LocalityRef; kind: RelationshipKind;
  historicalPlaceLabel: string; explanation: string; claim: PublicClaim;
  qualifiesForCoverage: boolean;
};
type LocalHeroImage = {
  id: string; url: string; width: number; height: number; altText: string;
  caption: string; depictionKind: "portrait" | "historical_context";
  era: "historical" | "illustration"; labels: string[];
  photographer: string | null; sourcePageUrl: string;
  license: string | null; licenseUrl: string | null;
  usageBasis: "open_license" | "public_domain" | "permission" | "coursework_reference";
  usageNote: string | null; focalPoint: string | null;
};
type LocalHeroSummary = {
  id: string; slug: string; name: string; aliases: string[];
  birthYear: number | null; deathYear: number | null;
  birthYearCertainty: Certainty | null; deathYearCertainty: Certainty | null;
  contributionSummary: string; image: LocalHeroImage;
  associations: LocalHeroAssociation[];
};
type LocalHeroStory = {
  id: string; slug: string; title: string; summary: string; body: string;
  isPrimary: boolean; sortOrder: number; claims: PublicClaim[];
};
type LocalHeroRelatedEvent = {
  slug: string; title: string; dateText: string; startYear: number;
  relationship: string | null;
};
type LocalHeroProfile = LocalHeroSummary & {
  biography: string | null; claims: PublicClaim[]; stories: LocalHeroStory[];
  gallery: LocalHeroImage[]; events: LocalHeroRelatedEvent[];
};
type LocalHeroPage = {
  filters: LocalHeroFilters; pageSize: 12; totalPeople: number; totalPages: number;
  items: LocalHeroSummary[];
  coverage: {
    framework: "VN-34-2025"; totalLocalities: 34; representedLocalities: number;
    byLocality: { code: LocalityCode; eligiblePeople: number }[];
  };
};
type LocalHeroQueryFailure = {
  code: "DATA_UNAVAILABLE"; message: "Chưa tải được danh sách nhân vật. Vui lòng thử lại.";
  retryable: true;
};
type LocalHeroPageResponse =
  | { ok: true; data: LocalHeroPage }
  | { ok: false; error: LocalHeroQueryFailure };
type LocalHeroLoadState =
  | { status: "idle" }
  | { status: "loading"; filters: LocalHeroFilters }
  | { status: "ready"; data: LocalHeroPage }
  | { status: "error"; filters: LocalHeroFilters; error: LocalHeroQueryFailure };
~~~

`associations` includes all supported relationships on detail; list membership/counts use qualifying relationships only. `gallery` contains accepted catalog images only. Public claims include independently sourced honors when present. No workflow/review note, internal hold reason, staff identifier or unpublished child appears in these types.

`lib/queries/local-heroes.ts` is server-only and always uses createPublicClient(), including for a signed-in reviewer:

~~~ts
getLocalHeroPage(input: LocalHeroFilters): Promise<LocalHeroPage>;
getLocalHeroProfile(slug: string): Promise<LocalHeroProfile | null>;
~~~

Null means invalid slug, absent person or publicly ineligible person; database failure throws a server-only `LocalHeroQueryError` with `code: "DATA_UNAVAILABLE"` and the fixed public message above. Never turn outages into empty/null results or serialize raw DB errors. The GET boundary returns HTTP 503 plus LocalHeroPageResponse error; success is HTTP 200, including an empty list. The detail route catches failure for its error boundary; only genuine null is 404.

RPC signatures: `public.local_hero_page(p_locality_code text, p_query text, p_page integer) RETURNS jsonb` and `public.local_hero_profile(p_slug text) RETURNS jsonb`. Output matches LocalHeroPage or LocalHeroProfile/null respectively, with camelCase keys. Use read-only Supabase RPC GET calls. Page/count/coverage come from one statement snapshot/one RPC, using EXISTS for locality matching so multi-locality people are not duplicated. Profile uses one bounded RPC, no one-query-per-child loop.

The RPC itself revalidates/clamps the raw input with the same code/query/page rules; public callers can bypass the Next GET adapter. Unknown locality codes normalize to all, null/invalid pages to 1, and search is limited before token evaluation. Profile suppresses honor claim groups unless verified; staff previews remain separate.

### Search and pagination normalization

`normalizeLocalHeroQuery(value: unknown): string`: a nonstring becomes ""; replace Unicode White_Space runs with ASCII space, strip C0/C1 control and U+200B/U+FEFF characters, trim, NFC-normalize, then keep at most 120 Unicode code points. Do not slice UTF-16 surrogates. The stored human query retains accents.

`foldLocalHeroQuery(value: string): string`: normalize as above, NFD-decompose, remove U+0300–U+036F marks, replace đ/Đ with d/D, lowercase with Vietnamese locale, collapse spaces. SQL `public.local_hero_fold(text) RETURNS text` uses the same explicit transformations and ICU Vietnamese lowercase. Unit/DB parity cases pin composed/decomposed Vietnamese, đ, aliases, emoji and whitespace. Fold full search documents without the 120-code-point query truncation.

Split the folded query on ASCII spaces; each nonempty token must be a literal substring of local_hero_search_text. Use bound parameters/strpos, not raw .or() interpolation or LIKE wildcard semantics. %, _, apostrophes and backslashes are literal. Search covers names, verified catalog_aliases and contribution summary; it does not search private notes, unreviewed other_names prose or use event-year filters. Research may explicitly reconcile a legacy alias into catalog_aliases with evidence; migration does not bulk certify it.

Order by name COLLATE public.local_heroes_vi ASC, then slug COLLATE "C" ASC. Page size is always 12. Parse page with `^[1-9][0-9]{0,5}$`; invalid ->1. Count first in the same query snapshot, clamp requested page to max(1,ceil(total/12)), then fetch. Empty: page=1, totalPages=0, items=[]. Report only distinct people; no client resorting.

## 8. Frozen admin command and result types

Create `lib/local-heroes/admin-types.ts` and `lib/actions/local-heroes.ts` in Phase 02. Form adapters may return existing ActionState, but the underlying command result is exactly this serializable union. Server functions validate unknown payloads and return UNAUTHENTICATED/FORBIDDEN rather than leaking redirect exceptions as data.

~~~ts
type EvidenceInput = {
  claimKey: string; sourceId: string; claimText: string; locator: string;
  scopeNote: string; certainty: Certainty; uncertaintyNote: string | null;
};
type LocalityInput = {
  id: string; localityCode: LocalityCode; kind: RelationshipKind;
  historicalPlaceLabel: string; explanation: string; claimKey: string;
  primarySourceId: string; certainty: Certainty; uncertaintyNote: string | null;
};
type StoryInput = {
  id: string; slug: string; title: string; summary: string; body: string;
  sortOrder: number; isPrimary: boolean; sources: EvidenceInput[];
};
type MediaEvidenceInput = {
  mediaId: string; depictionKind: "portrait" | "historical_context";
  decision: "accepted" | "held"; identitySourceId: string; identityLocator: string;
  identityCertainty: Certainty;
  usageBasis: "open_license" | "public_domain" | "permission" | "coursework_reference" | "unknown";
  usageSourceId: string | null; usageLocator: string | null; usageNote: string | null;
  checkedAt: string | null;
};
type LocalHeroGraphInput = {
  figureId: string | null; expectedRevision: string | null;
  figure: {
    name: string; slug: string; otherNames: string | null; birthYear: number | null;
    deathYear: number | null; biography: string | null; isLocalHero: true;
    contributionSummary: string | null; contributionStartYear: number | null;
    contributionEndYear: number | null; catalogAliases: string[];
  };
  sources: EvidenceInput[]; localities: LocalityInput[];
  stories: StoryInput[]; mediaEvidence: MediaEvidenceInput[];
};
type SubmitLocalHeroGraphInput = {
  figureId: string; expectedRevision: string; storyIds: string[];
};
type ReviewLocalHeroGraphInput =
  | { figureId: string; expectedRevision: string; action: "publish" | "hide" }
  | { figureId: string; expectedRevision: string; action: "request_revision"; reason: string }
  | { figureId: string; expectedRevision: string; action: "republish"; storyIds: string[] };
type RestoreLocalHeroDraftInput = { figureId: string; expectedRevision: string };
type ReadinessCode =
  | "IDENTITY_SOURCE_REQUIRED" | "CONTRIBUTION_SOURCE_REQUIRED" | "PERIOD_SOURCE_REQUIRED"
  | "PERIOD_OUT_OF_SCOPE" | "DISPLAYED_CLAIM_SOURCE_REQUIRED" | "LOCALITY_REQUIRED"
  | "LOCALITY_MAPPING_REQUIRED" | "PRIMARY_STORY_REQUIRED" | "STORY_SOURCE_REQUIRED"
  | "STORY_LENGTH" | "IMAGE_REQUIRED" | "IMAGE_IDENTITY" | "IMAGE_USAGE"
  | "SOURCE_METADATA" | "UNCERTAINTY_NOTE_REQUIRED" | "INDEPENDENT_SOURCES_REQUIRED"
  | "INTERNAL_NOTE" | "CITATION_MARKER_INVALID";
type ReadinessIssue = { code: ReadinessCode; path: string; message: string };
type LocalHeroReadiness = { blocking: ReadinessIssue[]; warnings: ReadinessIssue[] };
type LocalHeroAdminGraph = Omit<LocalHeroGraphInput, "figureId" | "expectedRevision" | "stories"> & {
  figureId: string; revision: string; workflow: Workflow; reviewNote: string | null;
  stories: (StoryInput & { workflow: Workflow; reviewNote: string | null })[];
  readiness: LocalHeroReadiness;
};
type LocalHeroMutationResult =
  | { ok: true; data: { figureId: string; slug: string; revision: string;
      workflow: Workflow; readiness: LocalHeroReadiness } }
  | { ok: false; error: {
      code: "INVALID_INPUT" | "UNAUTHENTICATED" | "FORBIDDEN" | "NOT_FOUND" |
        "STALE" | "INVALID_TRANSITION" | "READINESS_FAILED" | "CONFLICT" | "DB_UNAVAILABLE";
      message: string; fieldErrors: Record<string, string[]>;
      readiness: LocalHeroReadiness | null; currentRevision: string | null;
    } };
saveLocalHeroGraph(input: unknown): Promise<LocalHeroMutationResult>;
submitLocalHeroGraph(input: unknown): Promise<LocalHeroMutationResult>;
reviewLocalHeroGraph(input: unknown): Promise<LocalHeroMutationResult>;
restoreLocalHeroDraft(input: unknown): Promise<LocalHeroMutationResult>;
getLocalHeroAdminGraph(figureId: string): Promise<LocalHeroAdminGraph | null>;
~~~

On creation figureId/expectedRevision are both null; all proposed child UUIDs are validated unique. On update both are required, revision matches `^(0|[1-9][0-9]*)$`, is at most 9223372036854775807 (19-digit lexical bound before casting), and is compared as PostgreSQL bigint, never JS number. Unknown properties are rejected. A story/source/media belonging to another person gives FORBIDDEN without exposing its owner. Unselected locked stories may only be carried through unchanged; attempting to edit them fails the entire save. Source/media creation/upload remains in existing authorized flows.

`getLocalHeroAdminGraph` belongs to server-only `lib/queries/local-heroes-admin.ts`, requires an active editor/reviewer/system_admin session and never uses the public cache. It returns null for an invalid/missing accessible ID, throws on a database outage, and uses the existing requireRole behavior for page authorization. It exposes only the graph fields above; existing MediaManager loads base media separately. The new command actions return the explicit auth error union. Once enrolled, the runtime cannot clear is_local_hero; withdrawal uses workflow state. Guard both OLD and NEW enrollment so changing the flag cannot bypass protected-content rules.

Mutation RPCs: `public.local_hero_save_graph(p_command jsonb)`, `local_hero_submit_graph(p_command jsonb)`, `local_hero_review_graph(p_command jsonb)` and `local_hero_restore_draft(p_command jsonb)`, each RETURNS jsonb matching LocalHeroMutationResult. Functions are not overloaded. Nested exception handling rolls back all graph writes before a false result; infrastructure/commit errors are sanitized by the server adapter. Error mapping: invalid shape -> INVALID_INPUT; actor/session -> UNAUTHENTICATED/FORBIDDEN; missing accessible parent -> NOT_FOUND; CAS/40001/40P01 -> STALE; 23505/23503 -> CONFLICT; LH readiness failure -> READINESS_FAILED; connection errors -> DB_UNAVAILABLE. No SQL text or source inventory appears in messages.

Every failure includes fieldErrors={} when there are no field errors and readiness=null unless readiness was safely evaluated for this accessible graph. currentRevision is nonnull only for an accessible stale graph; authorization/missing-owner failures return null. Public messages are Vietnamese, bounded to 500 characters and chosen from server constants, never copied from SQL errors.

Success invalidates homepage, figure detail, figure edit/list and review queue paths after transaction commit. New requests use the public client again. No global cross-user cache contains staff preview data.

## 9. URL, SSR and lifecycle ownership

Create pure functions in `lib/local-heroes/state.ts`:

~~~ts
type LocalHeroUrlState = { mode: "events" | "people"; filters: LocalHeroFilters };
type LocalHeroRuntimeState = {
  discovery: LocalHeroUrlState;
  suspended: { state: MapExplorerState; exploration: MapExplorerState | null } | null;
};
type LocalHeroRuntimeAction =
  | { type: "people-enter" }
  | { type: "people-change"; filters: LocalHeroFilters }
  | { type: "people-exit" };
parseLocalHeroState(params: URLSearchParams): LocalHeroUrlState;
buildLocalHeroHomeHref(map: MapExplorerState, people: LocalHeroUrlState): string;
buildLocalHeroDetailHref(slug: string, homeHref: string): string;
getLocalHeroReturnHref(value: unknown): string;
~~~

Keys are exactly `noi-dung=nhan-vat`, `dia-phuong=<registry slug>`, `q-nhan-vat=<normalized accented query>`, `trang-nhan-vat=<page>`. Absent/unknown mode is events; unknown locality normalizes to all. First duplicate GET value wins, matching current page parsing. Canonical builders omit empty search, all-locality and page=1; changing locality/query resets only people page. Event keys remain `tu, den, su-kien, goc, ban-do, hanh-trinh, moc`. Valid event/journey/camera values survive people transitions. Selecting locality never derives a coordinate or triggers a flight.

Parse filters even when mode=events, retaining nondefault people preferences in the canonical URL without fetching them. Leaving people removes only noi-dung=nhan-vat; reentry reuses retained filters. Unknown mode values are omitted. Extend ExplorerRuntime with `people: LocalHeroRuntimeState` and ExplorerAction with LocalHeroRuntimeAction; the restore action gains `people?: LocalHeroUrlState` and restores both state domains together. The homepage's popstate handler always supplies it; existing callers that omit it use default events/all/empty/page=1. Pure transitions copy the existing nested exploration snapshot rather than sharing mutable references.

Return parameter is existing `kham-pha` on `/nhan-vat/[slug]`. Build it once with encodeURIComponent. The parser accepts only relative pathname "/", no hash, no credentials, backslash, control, duplicate key or nonallowlisted key, maximum **2048 decoded characters**. It rejects malformed percent encoding before URL parsing, protocol-relative/absolute/external/admin paths and encoded path bypasses. It decodes the transport value once; it never recursively decodes into a new URL. Reject invalid return values wholesale to `/?noi-dung=nhan-vat`. Validate existing keys through their current strict parsers, both year endpoints/order, known journey/stop pair, slug syntax, map and camera bounds; validate feature keys against section 3 and normalization. Rebuild from typed values, never echo the input. Extend the existing event return allowlist so crossing into an event from this context preserves feature keys safely; keep its legacy fallback behavior.

The event-return adapter uses the same strict allowlist/parser and the 2048-character feature bound when feature keys are present, while retaining its own fallback slug. Existing legacy-only return parsing keeps its current bound/fallback. This prevents the old 240-character limit from dropping a valid percent-encoded Vietnamese people search.

SSR GET paths:

- `GET /?noi-dung=nhan-vat&dia-phuong=<slug>&q-nhan-vat=<query>&trang-nhan-vat=<page>`: homepage server loads one LocalHeroPage. HTML form action="/" method="get"; validated event/journey/camera values are hidden inputs. Ordinary pagination/detail anchors work without JS.
- `GET /nhan-vat/[slug]?kham-pha=<encoded-home-href>`: extend existing server detail. Eligible catalog profile uses new query; noncatalog published legacy figure uses existing getFigureDetail. Invalid/hidden catalog records cannot fall through to a legacy rendering of held content.
- `GET /api/local-heroes?<same feature filter keys>`: create `app/api/local-heroes/route.ts` in Phase 04; normalized request -> LocalHeroPageResponse, Cache-Control:no-store. No mutation, debug/test route or production fixture fallback. Shared SSR/GET validation and query, no second data implementation.

Default event mode makes **zero people RPCs and zero hero-image requests**. A people-query error is isolated from event/globe loading. Initial ready/error state renders in HTML; client hydration does not refetch identical initial data.

For the existing detail/metadata boundary, add `isLocalHero: boolean` to `FigureDetail` and select is_local_hero in loadFigureDetail. A published canonical row chooses its renderer: false keeps the legacy view; true requires getLocalHeroProfile and cannot fall back if that returns null. This is at most one existing canonical-detail query plus one profile RPC, request-cached across metadata/page. Catalog metadata also uses the eligible profile's accepted image/text, not an unreviewed legacy portrait.

### One runtime, history and camera owner

HistoryExplorer remains the sole owner. Extend its existing reducer in `lib/explorer/journeys/playback.ts` with `people-enter`, `people-change`, `people-exit` and typed mode/filter state. Keep the existing journey exploration snapshot separate from the suspended reading-mode snapshot; nesting must not overwrite either.

Entering people mode snapshots current map/event/journey state, invalidates camera/dwell/arrival nonces, cancels intro and wheel/drag work, sets playing=false, and suppresses event/journey readers. Add optional `readingMode?: "events" | "people"` to EventMapProps and handle it in CinematicEventMap; cancellation must occur if the scene becomes ready after mode entry too. No remount, extra canvas or independent camera controller. Stale arrivals and view callbacks cannot modify the suspended snapshot. Ordinary manual globe exploration may update the visible camera but never invent a person location.

Leaving people restores the exact suspended selection/view instantly, without intro or autoplay. Keep journey paused until explicit play. Restore focus to the opener if connected, otherwise the mode button. Nonmodal people panel has no focus trap; Escape closes only that active reader. Direct people deep links synthesize their suspended state from validated map keys. Copied URLs/reload/Back restore the selected filters and paused journey; transient open-reader state is intentionally not serialized.

The current debounced replaceState effect becomes the **single history writer** for both states. Explicit mode/filter/page commits push one entry; transient camera settles/canonical page clamps replace the current entry. No panel calls history/router separately. Preserve Next's existing history.state object rather than writing null, and keep the departure freeze. Popstate restores both typed states without writing a new entry. For a bfcache detail return, cancel departure on pageshow and keep the history/URL snapshot; otherwise SSR reconstructs it.

Search input commits after 250 ms debounce or immediately on submit; locality/page changes commit immediately. Abort the previous request on each commit/exit/unmount, tag requests with increasing sequence + canonical filter key, and accept a response only if both still match the active selection. Ignored AbortError is not an empty/error result. Old results are not rendered under new filter labels; show loading, then the matching ready/error state. Retry keeps filters/page. Count-based clamping is written once with replace, never a fetch loop.

Stories reuse existing safe rich text rendering. Citation markers use `[[cite:<claim-key>]]` within body text, resolve only against that story's claims and render accessible source links. Unknown markers block readiness; no raw HTML/eval/unsanitized URL. Main-story word count removes citation markers and Markdown heading/bold syntax, collapses Unicode White_Space, then counts nonempty whitespace-delimited tokens; quotes still need exact-source evidence.

## 10. Research package, schema and hashing

The companion JSON Schema freezes **all fields, nullability, enums, lengths, document discriminators and the locality tuple list**. Phase 01 creates the following nine UTF-8/NFC JSON documents under `supabase/content/local-heroes/national-v1/`:

`localities.json`, `sources.json`, `claims.json`, `media.json`, `people.json`, `stories.json`, `relations.json`, `roster.json`, `coverage.json`; plus `manifest.json`. Each document has schemaVersion=1 and its matching kind. No source/person/media example is fabricated by this contract.

Use `personKey = figure:<existing UUID>` when reconciled, otherwise `new:<stable slug>`. The same identity cannot have two keys; later reconciliation records a versioned key map, not silent duplicate imports. Claim/source/media/story/relation IDs are stable package identifiers, not production UUID guesses. Keep the data package out of production fallback imports.

The schema has nullable `existingSourceId` and `existingMediaId` for deliberately reconciled legacy records. New DB IDs are UUIDv5 using the technical namespace `bfcdd5b2-7473-4ea9-9a21-a633400a3ca0` and UTF-8 name `national-v1/<kind>/<package-key>`, with kind exactly person/source/story/media/relation. This constant is a technical identifier, not historical data. Existing figure/source/media IDs take precedence only after explicit identity/ownership checks. Repeated imports use the same IDs and must fail on conflicting existing identity/content, never overwrite unrelated legacy records.

Importer mapping: source records map authorOrg/publishedYear/accessedAt/sourceType to existing snake_case fields; preserve documentRef in citation and the full research record. Person/relationship/story fields map to section 4. Accepted claim sourceRefs become figure_sources or figure_story_sources; relation claim keys are locality:code:kind and primary_source_id is the first sorted sourceRef ID in that claim group. Media identity/usage claim groups supply the corresponding source/locator fields in figure_media_evidence; base media credit/honesty fields stay in media_assets. Manifest IDs remain in the research ledger even when existing DB IDs are reused. No claim group may mix a different person's evidence.

Source, claim and media records distinguish `accepted/held/excluded` from `verified/approximate/disputed/editorial` and from workflow. Every held/excluded decision has a reason; a lead/unreachable source cannot substantiate an accepted required claim. Authentic image inspection and license/usage conclusions require direct evidence; schema validation cannot verify history or rights.

Installed Zod 4.6.5 exposes fromJSONSchema but its conversion rejects conditional if/then/else schemas (checked in Phase 00). Phase 02 must implement explicit validators/refinements with installed tools and parity cases for this schema, rather than dropping conditional acceptance rules or adding a dependency without a demonstrated need. Phase 00 checks JSON syntax, internal references and every registry tuple; it does not claim that a feature validator or a complete Draft 2020-12 validation engine was run.

For accepted required claims, populate checked source metadata, locators, supported scope and certainty. A candidate can remain held with null/empty missing fields. Accepted release readiness requires a primary story/image, all required claim IDs, source-access dates and identity/locality mapping evidence. Main story paragraphs with factual assertions have scoped citation markers; source/claim semantic coverage is checked by the source reviewer, not certified by word counts.

### Deterministic serialization and hash

- Save JSON as two-space indentation, LF newline, final newline. Reject duplicate object keys, non-NFC strings, nonfinite/fractional numbers, duplicate IDs, unsafe paths and unknown fields.
- Sort record arrays by ID; people/roster by personKey; registry/coverage by two-digit code. Sort reference-ID arrays lexicographically and prohibit duplicates. Preserve narrative and alias presentation order where order has meaning.
- Manifest files list is the fixed nine filenames above in lexicographic order. Each `sha256` covers the **raw bytes** of that file. Paths are basenames only; no traversal, symlinks, remote reads or files outside the package.
- `manifestHash` is SHA-256 of UTF-8 `JSON.stringify(canonical(manifest excluding manifestHash and ownerApproval))`. Canonical recursively sorts object keys using JS UTF-16 lexical order, retains array order, and uses JSON primitive serialization; all values are already restricted as above. This is this contract's algorithm, not a claim to implement all RFC 8785 cases.
- `ownerApproval` is excluded from the content hash to attach the actual owner's decision to the reviewed hash without a circular dependency. It must name that hash, approvedAt and versioned evidence when approved. A typed "approved" field is not proof of a real owner message; Phase 07 traces the evidence. Never populate it speculatively.
- Contract/schema revisions, any content or decision change, and accepted-roster changes require a manifest version increment and new hash. Retain the prior manifest/hash in the versioned handoff. Changing accepted scope requires renewed owner approval.

Phase 02 creates `scripts/content/check-local-heroes.mjs` with these exact commands:

~~~powershell
node scripts/content/check-local-heroes.mjs --package supabase/content/local-heroes/national-v1 --mode research
node scripts/content/check-local-heroes.mjs --package supabase/content/local-heroes/national-v1 --mode release
~~~

Defaults are that package and research mode, so the existing prompt's no-argument command is compatible. Exit 0 means valid structure/references/hash in research mode; it does **not** mean release-ready. Release mode additionally requires all 34 prepared localities represented, all accepted people complete, every nomination decided, a frozen roster and matching actual owner approval evidence. Exit 1: schema/reference/hash/read failure; exit 2: release gate unmet; exit 64: invalid command usage.

Stdout is one deterministic JSON object:

~~~ts
type ContentValidationResult = {
  schemaVersion: 1; mode: "research" | "release"; valid: boolean; releaseReady: boolean;
  manifestVersion: number; manifestHash: string;
  acceptedPeople: number; completeAcceptedPeople: number;
  representedLocalities: number; totalLocalities: 34;
  issues: { code: "SCHEMA" | "REFERENCE" | "HASH" | "SOURCE" | "CLAIM" |
    "MEDIA" | "STORY" | "IDENTITY" | "COVERAGE" | "ROSTER" | "APPROVAL";
    path: string; message: string; personKey: string | null; localityCode: LocalityCode | null }[];
};
~~~

Sort issues by path/code/personKey/localityCode. No network/DB writes, timestamps from the clock, invented reviewer identities or machine-specific absolute paths enter stdout. On malformed manifest use version=0 and hash="" while reporting SCHEMA/HASH; normal successful packages use a real integer/hash. No runtime fixture is eligible as content.

### Coverage arithmetic

Denominator is always the exact code set in section 3 (34). Prepared numerator counts a locality once iff a complete accepted roster person has a verified noncommemorative relationship to it, a complete sourced primary story and an accepted usable representative image. A commemoration or approximate mapping cannot inflate it. Complete accepted people must equal accepted roster people, separately from the locality numerator. Coverage status is derived: not_started, researching, ready_for_review, represented, blocked; a missing required artifact makes the locality blocked if it has no alternative complete candidate.

`coverage.json` records prepared evidence only. `publicSnapshot = null` means not checked, never zero published people. A nonnull public snapshot must have an observedAt and exact separately verified code/person counts. Local rehearsal and remote-public counts are separate columns in the Phase 07 audit; offline fixtures cannot populate them.

## 11. Test ownership and executable interfaces

These are **future tests**, with file ownership and exact required cases. Phase 00 creates no product tests. No case below has passed merely because pnpm verify is green today.

| Review focus / test ID | Exact test destination and named case | Owner |
| --- | --- | --- |
| F1 — duplicate people / historical geography | `tests/unit/local-heroes-query.test.ts`: `deduplicates a person across localities and excludes commemoration from coverage`; `tests/unit/local-heroes-content.test.ts`: `requires a sourced historical-to-reference locality mapping` | 01 research; 02 implementation; 06 completeness |
| F2 — last evidence / races / legacy | `supabase/tests/local_heroes.sql` TAP labels `LH_LAST_SOURCE`, `LH_LAST_STORY`, `LH_LAST_MEDIA`, `LH_LAST_LOCALITY`, `LH_LEGACY_DEFAULTS`; `tests/rls/local-heroes-concurrency.mjs` cases `publish_vs_source_edit` and `two_last_links` | 02; 03 adapters; 07 proof |
| F3 — journey / people / detail / Back | `tests/unit/local-heroes-lifecycle.test.ts`: `restores nested journey snapshot paused and ignores old arrivals`; `tests/e2e/home-local-heroes.spec.ts`: `journey to people to detail and Back preserves filters and stays paused` | 04; 05 detail; 07 regression |
| F4 — image / rights / uncertainty | `tests/unit/local-heroes-content.test.ts`: `holds unknown identity and unknown usage without substituting a portrait`; `tests/unit/local-heroes-profile.test.ts`: `labels historical context and excludes held media and draft stories`; `tests/e2e/figure-stories.spec.ts`: `broken image keeps caption credit and readable story` | 01 evidence; 02 validation; 05 view; 06 completion |
| F5 — Unicode / hostile URLs / failure / fallbacks | `tests/unit/local-heroes-state.test.ts`: `normalizes composed and decomposed Vietnamese without splitting code points` and `rejects external duplicate malformed and overlong return URLs`; public E2E cases `SSR GET without JavaScript`, `HTML catalog without WebGL`, `stale search never replaces the latest locality` | 02 fold/query; 04 lifecycle/SSR; 05 return; 07 acceptance |

Additional DB TAP cases: `LH_ANON_PUBLIC_ONLY`, `LH_LEARNER_DENY_WRITE`, `LH_EDITOR_EDITABLE_ONLY`, `LH_LOCKED_STAFF_DENY`, `LH_REVIEWER_STATUS_ONLY` (forged parent and all relation/source/media paths), `LH_ADMIN_RESTORE`, `LH_SOURCE_FIGURE_ONLY`, `LH_SOURCE_STORY_ONLY`, `LH_SOURCE_MEDIA_ONLY`, `LH_DRAFT_SOURCE_HIDDEN`, `LH_SHARED_EVENT_SOURCE`, `LH_CROSS_OWNER_ID`, `LH_RAW_REST_EQUIVALENT`, `LH_PENDING_GRAPH_SUBMIT`, `LH_ATOMIC_PROMOTION`, `LH_FOLD_PARITY` and `LH_REVISION_FORGERY`. Include INSERT/UPDATE/DELETE and OLD/NEW FK attacks, active/locked variants, every last-link removal and failed rollback. Check pg_policies, table grants and function proacl, not just application button behavior.

Also pin `local-heroes-query.test.ts` case `matches accented unaccented and documented alias queries with literal wildcard characters` (Phase 02), `local-heroes-profile.test.ts` case `renders uncertain life dates without choosing an unsupported exact year` (Phase 05), and `local-heroes-actions.test.ts` case `saves incomplete drafts and accepts evidenced coursework use without a fabricated license` (Phases 02–03). Where sources conflict on a life year, keep the numeric year null unless a justified canonical value is established; show the disputed claim/note instead of silently choosing one.

The concurrency runner opens two real psql sessions using the existing local Supabase DB container (docker exec, no new application dependency). It accepts only `--target <descriptor.json>`. Descriptor exact shape: `{ "kind": "disposable-local-supabase", "container": "<local DB container>", "database": "postgres", "host": "127.0.0.1", "purpose": "local-heroes-tests" }`. Resolve and verify the container's local CLI/project identity before executing; never read the linked remote configuration or accept a remote URL. Missing Docker/local target is a blocked DB gate. Scripts log case/results, no credentials. Seed/rollback auth users and role claims only in this disposable target.

### Isolated public E2E contract

Phase 04 creates `playwright.local-heroes.config.ts`, `tests/e2e/local-heroes-catalog-server.mjs`, `scripts/agent/local-heroes-e2e.mjs` and `tests/e2e/fixtures/local-heroes/`. Commands become:

~~~powershell
node scripts/agent/local-heroes-e2e.mjs build
pnpm exec playwright test --config playwright.local-heroes.config.ts
~~~

The runner forces synthetic public Supabase URL `http://127.0.0.1:54329`, the existing explicitly fake smoke anon key, empty service-role configuration and `LOCAL_HEROES_E2E=1`. `next.config.ts` will use distDir=".next-local-heroes" only for that exact test flag; normal output stays .next. The fixture starts Next on `127.0.0.1:3114` using the same environment and output. Build and server/test run sequentially. Do not adopt E2E_BASE_URL overrides, attach to an existing server, read valid keys, seed a remote or run legacy mutation suites from this config.

Fixture accepts only GET/HEAD: /rest/v1/historical_events and /rest/v1/historical_figures for existing readers, /rest/v1/rpc/local_hero_page and /rest/v1/rpc/local_hero_profile for the new public queries. Every other method/path fails closed (405/404); no auth/admin/write route. Data contains 36 explicitly synthetic people, a multi-locality identity, >12 locality matches, private sentinels and a legacy profile. Media URLs use reserved example.invalid and browser route fulfillment from test-only image bytes; deliberate failure has a named case. Browser fixtures do not run migrations or demonstrate RLS.

Config collects only `home-local-heroes.spec.ts` and `figure-stories.spec.ts` and declares four desktop projects: 1280x720, 1366x768, 1440x900, 1920x1080, one worker. Required DOM assertions cover visible panel exclusivity, unique IDs/counts, clamping/empty/error/retry, reserved image dimensions/labels, exact return URLs, focus restoration, keyboard paths, no horizontal overflow, axe serious/critical violations, reduced motion, no-JS GET and forced WebGL failure. Attach console/pageerror/network diagnostics and screenshots; classify intentional abort/failure cases explicitly.

`tests/e2e/admin-local-heroes.spec.ts` uses a separate `playwright.local-heroes-admin.config.ts` created in Phase 03, with no mutation fixture. It requires an explicitly disposable local DB/role setup, rejects remote/shared targets and tests editor/reviewer/locked/admin permissions and stale saves. It is never collected by the public config.

### Commands once the owning files exist

~~~powershell
pnpm exec vitest run tests/unit/local-heroes-state.test.ts tests/unit/local-heroes-query.test.ts tests/unit/local-heroes-content.test.ts tests/unit/local-heroes-profile.test.ts tests/unit/local-heroes-lifecycle.test.ts tests/unit/local-heroes-actions.test.ts
supabase test db --local supabase/tests/local_heroes.sql
node tests/rls/local-heroes-concurrency.mjs --target .task-reports/local-heroes-disposable-db.json
pnpm exec playwright test --config playwright.local-heroes-admin.config.ts
node scripts/content/check-local-heroes.mjs --package supabase/content/local-heroes/national-v1 --mode release
~~~

Supabase CLI help was checked in Phase 00 and supports the shown --local/path interface. Docker is installed; a running disposable instance was not established. Do not run the existing tests/rls scripts or full pnpm test:e2e against the working remote.

## 12. Performance, verification and handoff gates

Owner-approved budgets are acceptance limits, not measured feature results:

| Budget | Measurement / gate |
| --- | --- |
| Event-mode people network | 0 catalog RPCs, 0 representative image requests during initial load/idle |
| People data | 1 page of <=12, one page/count/coverage RPC per committed selection; 0 N+1 requests |
| Images | thumbnail requested width <=480px, <=102400 transferred bytes each, reserved dimensions, offscreen lazy loading |
| Incremental client JS | <=35840 gzip bytes against the same clean production homepage measurement; no new renderer/dependency |
| Geometry/render loop | 0 new geometry requests; no new idle animation/draw loop |
| Desktop | document scrollWidth<=clientWidth; required controls unobscured at all four viewports |

Phase 04 records build IDs, unique initial homepage script URLs/gzip transfer bytes, hardware/browser/DPR, fixture hash, request counts and image sizes before/after. A build-directory byte inventory is not a browser transfer result. No fresh GPU/browser timing has been measured in Phase 00; old province timings remain dated evidence only. If an external original cannot supply a bounded thumbnail, hold it or propose a separately authorized asset-preparation step; never claim CSS resizing saves bytes.

Phase 00 verification is fresh agent status, full pnpm verify, internal Markdown/schema references, exact 34 tuple comparison, whitespace/newline/JSON checks and complete self-review of changed documents. No new UI/DB behavior is claimed from that gate. Test results and any measured build inventory are recorded in the versioned handoff, without rewriting a pending approval into an approval.

Later completion requires separate evidence columns for source checks, offline manifests, unit tests, real disposable DB permissions/concurrency, fixture browser journeys, actual public data and measured performance. pnpm verify covers agent/history/lint/types/unit/script/build, **not** browser E2E or DB RLS. Missing source/approval/environment evidence remains an explicit blocker.

### Approval and next-phase checkpoint

| Gate | State at this contract revision |
| --- | --- |
| Owner national-first-release requirement | confirmed |
| Owner one-agent constraint | confirmed |
| Canonical reference identities | freshly checked against audited source |
| Contract/category/period/fallback/selection policy approval | **approved 2026-10-26; Phase 01 deferred by owner** |
| Actual national roster/name/hash approval | not researched; Phase 01 checkpoint |
| Live DB readiness / new feature RLS | unverified; Phase 02 disposable evidence required |
| Historical person/story/image readiness | not researched |
| New feature/browser/performance gates | not implemented / not run |

The owner approved this exact revision and instructed this invocation to leave Phase 01 for a different model. Stop after recording approval; do not start Phase 01, implementation or another model/chat. The owner will invoke Phase 01 separately. Actual roster/name/hash approval remains its later checkpoint. See [Phase 00 versioned handoff](2026-10-26-local-heroes-phase-00-handoff.md) for fresh command outcomes and remaining gaps.

## 13. Technical documentation consulted

Accessed 2026-10-26, read-only:

- [Supabase database functions](https://supabase.com/docs/guides/database/functions) and [views](https://supabase.com/docs/guides/database/views): invoker semantics, explicit function grants and view/RLS behavior.
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security): grant/policy boundaries. Applied here as a design, not proof of installed policy state.
- [PostgreSQL advisory locks](https://www.postgresql.org/docs/17/explicit-locking.html#ADVISORY-LOCKS) and [deferred constraints](https://www.postgresql.org/docs/17/sql-set-constraints.html): transaction lifetime and commit checks.
- [Supabase changelog](https://supabase.com/changelog): fetched as Markdown after the browser could not render that content type. Reviewed [TLS notice](https://supabase.com/changelog/cbc-tls-ciphers-deprecated) and [Postgres minor-version notice](https://supabase.com/changelog/postgres-15-19-17-11-breaking-changes); no platform/extension change was made or inferred about this project's server.
- Installed Next.js guide `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`: server query boundary and serializable client props. Re-read relevant route/GET guides before implementation.

No teacher, historian or independent-review certification is claimed. This contract was investigated and self-reviewed by the single main agent.

## 14. Phase 04 implementation checkpoint — 2026-10-27

This is an implementation/evidence addendum to LH-1.0.0-draft.1, not a revision of its roster, historical acceptance, locality registry, eligibility, query semantics or release scope. Earlier pending/future statements above describe their original checkpoints. The owner explicitly authorized repairing and verifying Phase 03 prerequisites in the same invocation before continuing Phase 04; see [the remediation record](2026-10-27-local-heroes-phase-03-remediation.md) and [Phase 04 handoff](2026-10-27-local-heroes-phase-04-handoff.md).

### Implemented boundaries

- `lib/local-heroes/state.ts` owns the four exact keys: `noi-dung=nhan-vat`, `dia-phuong=<canonical slug>`, `q-nhan-vat=<NFC display query>`, `trang-nhan-vat=<positive page>`. Codes remain two-digit strings. Inactive preferences survive event mode. The strict return parser accepts only local homepage/map/people keys, at most 2048 decoded Unicode code points; it rejects duplicates, malformed encoding, external/admin paths, controls, fragments and unknown keys. The legacy event return helper keeps its existing 240-character default. `goc` is retained as legacy camera state, separately from cinematic `ban-do`.
- `HistoryExplorer` and its existing playback reducer remain the only history/lifecycle owner. People entry freezes a separate deep-copied snapshot, cancels intro/flight/dwell/arrival/input work and pauses playback. Exit restores the snapshot instantly and paused, including the nested journey exploration state. Explicit commits push; camera/clamps replace; popstate restores both domains and preserves Next's `history.state`. The cinematic adapter remains the only camera controller/canvas.
- Homepage SSR requests only the active bounded page, alongside events. `GET /api/local-heroes` returns the frozen page DTO under `{ok:true,data}` or fixed sanitized `{ok:false,error}` with HTTP 503, `Cache-Control: no-store`. The SDK uses one GET RPC, disables its automatic retries and enforces a five-second timeout; client abort/sequence/filter-key guards reject stale responses. SSR hydration makes no second API request. Public readers remain anonymous even with staff cookies. No research JSON is a production fallback.
- Native GET locality/search forms, pagination/detail/close links work without JavaScript or WebGL. All 34 options plus “all” are present; page size is 12. Reserved lazy images use 120×80 intrinsic dimensions (96×64 CSS); normal DPR 1/2 request widths are 128/256, bounded by the 480-pixel contract. Broken accepted-image transport has its own fallback; it never makes held media eligible. The production image allowlist covers the accepted sample origins only; new origins require evidence and a thumbnail-budget check.
- Existing `/nhan-vat/[slug]` gets only the eligibility/media boundary and safe homepage return bridge needed for Phase 04. A null eligible profile cannot fall through to a legacy portrait. Staff preview remains separate. Phase 05 narrative/citation/gallery/profile acceptance remains a later checkpoint; `figure-stories.spec.ts` and `local-heroes-profile.test.ts` are not created or claimed as passing in Phase 04.

### Reproducible isolated commands

On this Windows checkout, set `$env:NoDefaultCurrentDirectoryInExePath = '1'` for Node/pnpm child commands: the owner's pre-existing empty `node.cmd` shadows Node. Do not remove that file or read environment files.

```powershell
node scripts/agent/local-heroes-e2e.mjs build
pnpm exec playwright test --config playwright.local-heroes.config.ts
node scripts/agent/local-heroes-performance.mjs final
pnpm exec playwright test --config playwright.local-heroes-regression.config.ts
```

The public config collects the current `home-local-heroes.spec.ts` (13 cases × four desktop projects). The optional Phase 05 filename in its allowlist currently matches no file. The fixed loopback API 54329/app 3114, `.next-local-heroes`, fake smoke public key and empty service role are mandatory. `E2E_BASE_URL` overrides and existing servers fail closed. The fixture accepts only GET/HEAD on its four exact readers; unknown paths/methods return 404/405. It includes synthetic detail null/error/legacy paths and browser-only thumbnail success/failure routes. `LOCAL_HEROES_LEGACY_FIXTURE=1` adds synthetic interval/overlap events only for the separately selected read-only regressions; the performance/default fixture is unchanged. No fixture result is DB/RLS or historical-content evidence.

The performance command reads browser-fetched script response bodies/transfer timing, not a build-directory inventory. A baseline must be captured before implementation with `node scripts/agent/local-heroes-performance.mjs baseline`; do not overwrite the saved baseline after implementing the feature. The versioned handoff records the baseline/final build IDs, same fixture hash, hardware/browser/DPR, network/image/idle measurements and limitations. Synthetic 401-byte thumbnails do not prove nationwide original-image delivery readiness.

Admin verification is deliberately separate:

```powershell
node scripts/agent/local-heroes-admin-e2e.mjs build
pnpm exec playwright test --config playwright.local-heroes-admin.config.ts
```

These commands require the descriptor-confirmed disposable Docker project `local-heroes-phase02-disposable` (API 55341, DB 55342), both project labels, local Docker transport and matching CLI config/API. They refuse overrides, absent/wrong targets and a nonempty Auth baseline before synthetic seeding. App 3115 uses `.next-local-heroes-admin`, real disposable Auth/PostgREST/RLS, no service-role client, no persisted Auth trace. Reset only that confirmed disposable migration snapshot between admin runs and clean synthetic data afterward. Never substitute a linked/shared/remote target or the full legacy mutation suite.

The final gate additionally requires the exact state/query command, offline research validator, full `pnpm verify`, whitespace check, smoke build then public smoke browser in sequence, and restoration of the normal configured `.next` build. Review the linked handoff/verification record for actual outcomes; this command list alone is not proof of a pass. National readiness still requires all 34 localities and every accepted person complete, with Phase 06/07 evidence and separately authorized rollout/publication.
