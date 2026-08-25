# Foundation & Agent OS Design Spec

**Project:** `lich-su-viet-nam-interactive`  
**Date:** 2026-08-26  
**Status:** Gate 1 architecture approved; pending human review of this written spec before implementation planning.  
**Product language:** Vietnamese.  
**Technical documentation:** Vietnamese by default; English is acceptable for code identifiers, API names, and upstream documentation references.

---

## 1. Product intent

Build a web-based learning and exploration system for Vietnamese history centered on two tightly connected interaction models:

1. an interactive historical map; and
2. an interactive chronological timeline.

The experience should feel more like a guided historical journey than a static encyclopedia. Selected high-value sections may use 3D, cinematic scroll storytelling, camera motion, particles, depth, and spatial transitions, while the core site remains usable, accessible, searchable, responsive, and maintainable without requiring WebGL for every interaction.

### 1.1 Primary outcomes

The first complete product should let a user:

- browse Vietnamese historical periods;
- navigate events by time and geography;
- open a historical event and see related people, places, images, and context;
- move between timeline and map views without losing context;
- search and filter events, people, periods, and locations;
- explore selected historical stories through cinematic/3D presentations;
- complete history quizzes;
- create an account and save selected content/progress where useful;
- let an administrator manage historical content.

### 1.2 Product principle

3D and motion are a differentiator, not the foundation of correctness. The product must remain functional if:

- the device is low-powered;
- WebGL is unavailable;
- the user enables reduced-motion preferences;
- a heavy asset fails to load;
- a selected scene has no 3D model yet.

Every cinematic experience therefore requires a meaningful 2D/static fallback.

---

## 2. Scope boundaries

### 2.1 In scope for the foundation

The first foundation implementation establishes:

- repository structure;
- Next.js + React + TypeScript application shell;
- strict TypeScript, linting, formatting, testing, and CI;
- Supabase integration boundaries without production secrets;
- domain model/types for periods, events, people, locations, relationships, quiz content, and users;
- map, timeline, 3D, motion, and design-system module boundaries;
- AI-agent operating protocol;
- project-local roles, skills, hooks, and harness adapters;
- pinned upstream skill/tooling manifest;
- baseline accessibility, security, and performance policies;
- neutral placeholder routes/components only where required to verify architecture.

### 2.2 Explicitly out of scope for foundation setup

The foundation phase must not prematurely create:

- final visual design;
- final brand identity;
- final homepage composition;
- finished historical 3D scenes;
- production historical dataset;
- production Supabase project credentials;
- production migrations that cannot be safely revised;
- final motion choreography;
- paid external services;
- an AI chatbot;
- a native mobile application;
- microservices;
- a custom CMS beyond the admin functionality required by the project.

---

## 3. Approved technology architecture

### 3.1 Runtime and application framework

- **Language:** TypeScript
- **Framework:** Next.js with React
- **Routing:** Next.js App Router
- **Styling:** Tailwind CSS
- **Package manager:** pnpm
- **Deployment target:** Vercel

The application should prefer Server Components for static/data-driven composition and isolate interactive/animated/WebGL functionality into focused client leaves.

### 3.2 Data platform

Use Supabase for:

- PostgreSQL;
- Authentication;
- Storage;
- Row Level Security;
- server-side data access where appropriate.

The browser must never receive a Supabase service-role secret. Public anonymous keys may be used only in the normal supported client configuration with RLS providing the actual authorization boundary.

### 3.3 Historical map

Preferred stack:

- Leaflet;
- React-Leaflet;
- OpenStreetMap-compatible map data/tiles where licensing and usage policies permit.

Historical boundaries must not be invented. If an exact historical border dataset is unavailable, the UI must clearly label approximate or schematic overlays.

### 3.4 3D and spatial interaction

Preferred stack:

- Three.js;
- React Three Fiber;
- optional Drei utilities when they materially simplify a scene.

Three.js should not be used as the default for ordinary interface elements. WebGL is reserved for experiences where spatial depth, object manipulation, historical reconstruction, or cinematic storytelling materially improves understanding.

### 3.5 Motion

Responsibilities are deliberately separated:

- **GSAP / ScrollTrigger:** cinematic scroll storytelling, long-form sequencing, pinned narrative sections, and Three.js/R3F camera or scene timelines;
- **Motion (`motion/react`):** component-level interaction, layout transitions, menus, cards, dialogs, gestures, and micro-interactions.

A single DOM property should not be driven simultaneously by both GSAP and Motion. Ownership must be explicit at component level.

### 3.6 Design workflow

Design tooling is a development-process layer, not application runtime:

- Design DNA: analyze references and persist a reusable design profile;
- Taste Skill: anti-template/anti-AI-slop frontend review and direction;
- LottieFiles Motion Design Skill: motion direction, timing, easing, choreography, emotional intent;
- Superpowers: software-engineering process and approval gates.

---

## 4. Agent Operating System

The repository will contain one canonical operating layer consumed by Codex, Antigravity, OpenCode, and future compatible coding agents.

The design principle is:

> one project law, one set of canonical roles and skills, thin harness-specific adapters.

Agent-specific configuration must not fork the product architecture or duplicate large prompts unnecessarily.

### 4.1 Source-of-truth hierarchy

From highest to lowest priority:

1. explicit current instruction from the human owner;
2. approved project specs and architecture decision records;
3. root `AGENTS.md` project law;
4. project-local role/skill instructions;
5. pinned upstream skills;
6. harness defaults.

When two lower layers conflict, the higher layer wins and the agent records the decision rather than silently blending contradictory rules.

### 4.2 Canonical roles

The first release defines seven roles.

#### Orchestrator

Responsibilities:

- classify work;
- identify required skills;
- decompose tasks;
- coordinate other roles;
- maintain scope and approval gates;
- stop destructive or irreversible work when approval is missing.

#### Architect

Responsibilities:

- application boundaries;
- route and feature structure;
- dependency direction;
- ADRs;
- shared interfaces;
- scalability without premature abstraction;
- integration design across map, timeline, 3D, Supabase, and content layers.

#### Historian Researcher

Responsibilities:

- research workflow and source quality;
- historical chronology consistency;
- event/person/place relationships;
- distinguish historical fact, scholarly disagreement, inference, and approximate reconstruction;
- enforce citations/provenance for production historical content.

This role may propose content but does not silently invent disputed dates, borders, quotations, or historical details.

#### Experience Designer

Responsibilities:

- information architecture;
- Design DNA;
- anti-slop design review;
- typography, rhythm, hierarchy, composition;
- accessibility;
- responsive behavior;
- reusable design tokens;
- visual consistency.

#### Motion & 3D Engineer

Responsibilities:

- React Three Fiber/Three.js scene architecture;
- GSAP scene and camera choreography;
- Motion-based UI interactions;
- asset lifecycle;
- reduced-motion/static fallback;
- frame-time, memory, loading, and mobile performance budgets.

#### Data Engineer

Responsibilities:

- Supabase schema;
- migrations;
- RLS;
- auth boundaries;
- storage policy;
- indexes;
- typed data access;
- seed/import tooling.

#### Reviewer

Responsibilities:

- spec compliance;
- code review;
- test quality;
- accessibility checks;
- security checks;
- performance regression checks;
- verification before completion.

### 4.3 Role constraints

- A reviewer does not redesign requirements during review.
- A historical researcher does not decide infrastructure architecture.
- A motion engineer does not replace accessibility fallbacks with visual spectacle.
- An orchestrator does not bypass tests or approvals to increase throughput.
- Agents must prefer focused files/modules over large multifunction files.

---

## 5. Skill architecture

### 5.1 Upstream process skills

Superpowers is the primary engineering-process layer.

Pinned baseline for initial bootstrap:

- repository: `obra/superpowers`
- commit: `b36e0829c6d0140e93cfef2ca599b1b07d4a7797`
- observed release at this commit: v6.3.0

The expected workflow is:

1. brainstorming/design;
2. explicit approval;
3. implementation planning;
4. isolated work when appropriate;
5. TDD for behavior-bearing code;
6. implementation;
7. review;
8. verification;
9. branch completion.

### 5.2 Upstream visual-quality skills

#### Taste Skill

- repository: `Leonxlnx/taste-skill`
- initial pinned commit: `ccbc15639c97057cbfcf32ecebc38ef716e4bb37`

Default project use:

- `design-taste-frontend` as general anti-slop frontend guidance;
- `gpt-taste` only for intentionally experimental/cinematic work, never as an always-on rule for admin/auth/data-heavy screens.

Taste guidance is subordinate to accessibility, product requirements, human design references, and project design tokens.

#### Design DNA

- repository: `zanwei/design-dna`
- initial pinned commit: `9d9d79568df31cd846681f89fd3be1c3ce0c2aff`

Its key artifact for this repository will be version-controlled design DNA under `design/dna/`.

#### Motion Design Skill

- repository: `LottieFiles/motion-design-skill`
- initial pinned commit: `f9a8a041b85185ee4881b3471d3415e939aac772`

It defines motion intent and choreography; implementation remains in GSAP, Motion, CSS, or Three.js depending on context.

### 5.3 Project-local skills

The first project-local skill set will include:

- `project-discovery`;
- `architecture-decision`;
- `history-source-research`;
- `history-content-modeling`;
- `design-dna-workflow`;
- `anti-slop-frontend`;
- `motion-direction`;
- `threejs-experience`;
- `map-timeline-integration`;
- `supabase-schema-rls`;
- `accessibility-audit`;
- `performance-budget`;
- `release-verification`.

Project-local skills should compose upstream guidance rather than copy large upstream documents verbatim.

---

## 6. Hook and guard architecture

Hooks should enforce machine-checkable policies. Subjective design decisions remain in skills/review checklists.

Canonical implementations live under `.agents/hooks/`; harness adapters call the same underlying scripts where the harness supports equivalent lifecycle events.

### 6.1 Destructive-operation guard

Block or require explicit human approval for operations such as:

- `rm -rf` over project or parent paths;
- `git reset --hard`;
- `git clean -fdx`;
- force-pushing protected/default branches;
- destructive database resets;
- destructive production migrations;
- irreversible storage deletion;
- production deployment when the current gate does not authorize it.

### 6.2 Secrets guard

Prevent accidental commit or browser exposure of:

- `.env` / `.env.local` secrets;
- Supabase service-role keys;
- private API tokens;
- private keys;
- deployment secrets.

`.env.example` must contain names/placeholders only.

### 6.3 Changed-file quality hook

For relevant changed files, run focused formatting/linting where practical without turning every edit into a full project build.

### 6.4 Completion verification

Before an agent claims a behavior-bearing implementation is complete, it must produce fresh evidence appropriate to the change, usually including:

- formatting/lint checks;
- TypeScript typecheck;
- relevant unit/integration tests;
- production build for changes that can affect bundling/runtime;
- E2E tests for critical user flows when those flows exist.

A documentation-only change does not require ceremonial application tests unless it changes executable behavior, configuration, prompts/skills, or a process contract that has its own validation method.

---

## 7. Harness adapters

### 7.1 Codex

Codex receives:

- root `AGENTS.md`;
- `.codex/config.toml`;
- `.codex/agents/*.toml` adapters generated from canonical role definitions where practical;
- project skills available through the common skills layout supported by the selected Codex setup.

Codex-specific configuration must remain thin and must not redefine the application architecture independently.

### 7.2 Antigravity

Antigravity receives:

- project skills under `.agents/skills/`;
- project agents/role adapters under the supported `.agents/` conventions;
- hook configuration mapped to canonical guard scripts.

Superpowers is installed through its Antigravity-supported plugin mechanism, pinned or otherwise reproducibly locked by the project bootstrap policy.

### 7.3 OpenCode

OpenCode receives:

- project-local `opencode.json` where required;
- `.opencode/agents/` adapters;
- `.opencode/plugins/` hook/bridge logic where the native plugin surface is needed;
- project skills discovered from the shared skills structure.

Superpowers uses OpenCode's plugin installation mechanism. The initial compatible package reference should be pinned to a known version/commit rather than permanently following an unpinned moving `main`.

---

## 8. Repository layout

Target structure after foundation implementation:

```text
lich-su-viet-nam-interactive/
├── AGENTS.md
├── README.md
├── package.json
├── pnpm-lock.yaml
├── agent-toolchain.lock.json
├── .agents/
│   ├── roles/
│   ├── agents/
│   ├── rules/
│   ├── skills/
│   ├── hooks/
│   └── upstream/
├── .codex/
│   ├── config.toml
│   └── agents/
├── .opencode/
│   ├── agents/
│   └── plugins/
├── docs/
│   ├── superpowers/specs/
│   ├── superpowers/plans/
│   ├── architecture/
│   ├── product/
│   ├── history-research/
│   └── database/
├── design/
│   ├── references/
│   ├── dna/
│   ├── tokens/
│   └── motion/
├── src/
│   ├── app/
│   ├── features/
│   │   ├── timeline/
│   │   ├── historical-map/
│   │   ├── historical-events/
│   │   ├── historical-figures/
│   │   ├── periods/
│   │   ├── quiz/
│   │   └── admin/
│   ├── components/
│   │   ├── ui/
│   │   ├── map/
│   │   ├── three/
│   │   └── motion/
│   ├── lib/
│   │   ├── supabase/
│   │   ├── map/
│   │   ├── three/
│   │   └── validation/
│   └── types/
├── supabase/
│   ├── migrations/
│   ├── seed.sql
│   └── config.toml
├── public/
│   ├── images/
│   ├── models/
│   ├── textures/
│   └── documents/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── scripts/
│   ├── agents/
│   ├── data/
│   └── verify/
└── .github/
    └── workflows/
        └── ci.yml
```

Empty directories are not committed merely to match this diagram. Directories appear when they contain a real artifact.

---

## 9. Application module boundaries

### 9.1 Timeline feature

Owns:

- chronological navigation;
- period/event grouping;
- filtering by period/category;
- focus state shared with map navigation through a typed interaction contract;
- timeline-specific presentation.

It must not directly own map implementation details.

### 9.2 Historical map feature

Owns:

- map view;
- event/location markers;
- selected location state;
- optional historical overlays;
- map-specific controls and layers.

It consumes typed event/location data and emits selection/navigation events.

### 9.3 Historical events and figures

Own domain-level content rendering and relationships independent of whether the user arrived from search, timeline, map, or a 3D story.

### 9.4 3D experience layer

3D experiences are scene modules loaded only where required. A scene must define:

- loading state;
- error/fallback state;
- reduced-motion behavior;
- asset ownership;
- cleanup/disposal behavior;
- performance class;
- input behavior for mouse, touch, and keyboard where interaction is required.

### 9.5 Admin

Admin functionality is separated from public cinematic UX. Admin should prioritize clarity, validation, accessibility, and content integrity over experimental motion.

---

## 10. Data model direction

The initial logical model should support at least:

- `historical_periods`;
- `historical_events`;
- `historical_figures`;
- `historical_locations`;
- event-person relationships;
- event-location relationships;
- event-period relationships;
- media/source references;
- quiz questions and answers;
- user profiles;
- bookmarks/progress if retained in the approved feature scope;
- audit metadata for administrator edits.

### 10.1 Provenance fields

Production historical content should support provenance instead of storing anonymous prose only. Relevant entities should be capable of linking to source records with fields such as:

- title;
- author/organization;
- publication;
- URL or bibliographic reference;
- access date where appropriate;
- source type;
- verification notes;
- confidence/dispute note when the fact is contested or approximate.

### 10.2 Historical uncertainty

The schema and UI should be able to represent:

- exact date;
- year-only or period-only date;
- approximate date;
- disputed date;
- approximate historical location;
- disputed attribution.

Do not force false precision merely because the database prefers a single timestamp.

---

## 11. Design system strategy

The project will not commit to a final visual identity during foundation setup.

When references are chosen, the design workflow is:

1. collect and curate references;
2. extract Design DNA;
3. review it against product/audience/accessibility needs;
4. save accepted DNA as version-controlled JSON;
5. derive design tokens;
6. define motion identity;
7. implement a small representative slice;
8. perform anti-slop/design review;
9. approve the visual direction before broad implementation.

### 11.1 Anti-slop constraints

AI agents must not automatically default to:

- purple/blue glow gradients;
- generic glass cards everywhere;
- repetitive three-card feature grids;
- arbitrary pill labels;
- generic centered landing-page composition;
- gratuitous animations unrelated to history or navigation;
- inconsistent typography across routes.

These are not absolute bans. They may be used when the approved Design DNA and content justify them.

---

## 12. Motion and 3D quality policy

### 12.1 Motion ownership

- UI transitions: Motion or CSS.
- Storytelling sequences: GSAP.
- R3F camera/object sequences: GSAP coordinated with R3F lifecycle.
- Continuous real-time values should avoid React state re-render loops.

### 12.2 Reduced motion

`prefers-reduced-motion` is a first-class requirement.

A reduced-motion experience should preserve:

- content;
- navigation;
- chronology;
- selection state;
- map/timeline relationships;
- historical meaning.

It may remove decorative parallax, long camera travel, particles, and nonessential transitions.

### 12.3 Performance budgets

Initial engineering targets, subject to measurement during implementation:

- avoid loading large 3D dependencies/assets on routes that do not need them;
- lazy-load scene code and models;
- compress and optimize GLTF/GLB assets where appropriate;
- avoid unnecessary high-DPI rendering on mobile;
- cap device pixel ratio for expensive scenes where visual benefit is negligible;
- dispose geometries, materials, textures, listeners, timelines, and observers when scenes unmount;
- preserve usable interaction on common student laptops and mid-range mobile devices.

No agent may claim a scene is performant solely because it feels smooth on one development machine.

---

## 13. Accessibility

Foundation requirements include:

- semantic HTML for non-3D content;
- keyboard-accessible primary workflows;
- visible focus states;
- adequate contrast;
- meaningful text alternatives for informative imagery;
- no essential information available only by hover;
- touch-friendly controls;
- reduced-motion handling;
- accessible fallback for meaningful 3D interactions;
- maps/timelines with alternative textual navigation for essential content.

Accessibility regressions are treated as functional defects, not visual polish tasks.

---

## 14. Security and privacy

### 14.1 Supabase

- RLS enabled for user-owned/private tables before production use;
- service-role credentials restricted to trusted server contexts;
- typed validation at application boundaries;
- storage policies aligned to visibility requirements;
- no authorization decision based only on hidden UI controls.

### 14.2 Repository

- no real secrets committed;
- dependency additions require justification and package verification;
- third-party AI skills are treated as executable/process dependencies and reviewed before adoption;
- upstream skill/tooling revisions are pinned in `agent-toolchain.lock.json`.

### 14.3 Third-party skill intake

Before adding a new skill repository:

1. inspect its main skill instructions;
2. inspect executable scripts/install behavior;
3. inspect network/file-system behavior;
4. check license;
5. identify conflicting instructions;
6. pin a known revision;
7. document why it is needed.

Popularity is not sufficient trust evidence.

---

## 15. Testing strategy

### 15.1 Unit tests

Use for:

- pure domain logic;
- validation;
- date/period normalization;
- quiz scoring;
- adapters and utilities;
- hooks/guards with deterministic behavior.

### 15.2 Integration tests

Use for:

- Supabase repository/service boundaries;
- RLS-sensitive flows when a local/test Supabase environment is available;
- timeline-map selection contracts;
- route-level data behaviors.

### 15.3 E2E tests

Playwright should eventually cover critical workflows such as:

- landing/explore navigation;
- selecting an event from timeline;
- locating/opening it on the map;
- search/filter;
- authentication where enabled;
- quiz completion;
- admin content editing;
- fallback behavior for unavailable heavy experiences where practical.

### 15.4 Visual/interaction verification

Cinematic and 3D experiences require explicit manual/automated evidence beyond unit tests, including viewport coverage, reduced motion, touch interaction, and performance profiling where appropriate.

---

## 16. CI policy

The first CI workflow should run on pull requests and relevant pushes.

Baseline checks:

1. install with frozen lockfile;
2. format/check formatting;
3. lint;
4. TypeScript typecheck;
5. unit/integration tests that do not require production secrets;
6. production build.

E2E may run in a separate job when the application shell is ready and its runtime cost is justified.

CI configuration must not contain real Supabase or deployment secrets for tests that can run locally without them.

---

## 17. Development workflow and gates

### Gate 1 — Foundation architecture approved

**Status: approved by the human owner on 2026-08-26.**

Allows writing this design spec and preparing the implementation plan after the written spec is reviewed.

### Gate 2 — Written design spec approved

Required before creating the implementation plan or scaffolding the full foundation.

### Gate 3 — Foundation implementation approved via plan

Implementation follows the approved plan with review and verification.

### Gate 4 — Visual direction approved

Required before large-scale final UI implementation.

Inputs may include design references, Design DNA, tokens, and representative prototypes.

### Gate 5 — Historical content/data model approved

Required before importing a substantial production dataset.

### Gate 6 — Production integrations/deployment approved

Required before creating production Supabase resources, adding sensitive provider credentials, or publishing a production deployment.

---

## 18. Foundation implementation sequence

After this spec is approved, the implementation plan should decompose work approximately in this order:

1. initialize repository/application/toolchain;
2. establish quality scripts and CI;
3. add `AGENTS.md` and canonical agent operating rules;
4. add toolchain lock/installer/doctor workflow;
5. add canonical roles and harness adapters;
6. add project-local skills;
7. add hooks/guards and their tests;
8. establish domain modules/types and neutral routes;
9. establish Supabase client/server boundaries and local-safe configuration;
10. establish map/timeline/3D/motion module contracts without final design;
11. add baseline tests and verification;
12. document clone/bootstrap workflow for Codex, Antigravity, and OpenCode.

No step may silently cross into production secrets, irreversible database operations, or final visual design.

---

## 19. Bootstrap experience target

A new development machine should ultimately be able to clone the repository and follow a small, deterministic sequence similar to:

```bash
pnpm install --frozen-lockfile
pnpm agents:bootstrap
pnpm agents:doctor
pnpm verify
pnpm dev
```

`agents:bootstrap` installs/configures project-supported upstream agent skills where automation is safe.  
`agents:doctor` reports missing/incorrect harness prerequisites without destructively changing them.  
`verify` runs the appropriate local quality baseline.

Exact commands and harness behavior are defined by the implementation plan and verified against current upstream instructions before coding them.

---

## 20. Decisions intentionally deferred

These are not placeholders blocking the foundation; they are later-gate decisions:

- final project brand/name shown to users;
- final visual references;
- exact Design DNA values;
- exact motion personality and easing palette;
- which historical stories receive full 3D scenes first;
- production Supabase project;
- final production historical data sources and import volume;
- whether AI-assisted historical Q&A is added after the core experience is stable.

The foundation must keep these decisions changeable without requiring a rewrite of the application architecture.

---

## 21. Acceptance criteria for the foundation

Foundation work is considered complete only when:

- a clean clone installs reproducibly;
- the Next.js TypeScript application builds;
- lint/typecheck/tests pass;
- CI runs the baseline checks;
- no real secrets are committed;
- root `AGENTS.md` defines the canonical operating protocol;
- Codex, Antigravity, and OpenCode have documented adapter/bootstrap paths;
- upstream skills are pinned in a machine-readable lock file;
- project-local roles and skills exist with non-overlapping responsibilities;
- destructive/secrets/completion guards have tests where technically enforceable;
- domain boundaries for timeline, map, 3D, historical content, admin, and data are represented in the code structure;
- neutral placeholders do not masquerade as final visual design;
- README explains setup, verification, agent bootstrap, and development commands;
- the repository remains ready for a later approved Design DNA + visual implementation phase.

---

## 22. Reference repositories reviewed for this design

- `obra/superpowers` — engineering workflow and multi-harness skill methodology.
- `Leonxlnx/taste-skill` — anti-slop frontend design skills.
- `zanwei/design-dna` — structured design-system/style/effects extraction and generation workflow.
- `LottieFiles/motion-design-skill` — implementation-agnostic motion direction and choreography.

These upstream projects are inspiration/process dependencies, not product source code. Their instructions remain subordinate to this project's approved requirements and human decisions.
