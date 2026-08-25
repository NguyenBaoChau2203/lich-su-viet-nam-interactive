# Project Agent Law

This file is the canonical operating policy for coding agents working in this repository.

## Instruction priority

Follow instructions in this order: current human instruction → approved specs/ADRs → this `AGENTS.md` → project-local roles and skills → pinned upstream skills → harness defaults. When lower layers conflict, obey the higher layer and record the decision instead of blending incompatible rules.

## Mandatory operating rules

1. Read the nearest approved specification and implementation plan before changing behavior.
2. Use Superpowers when it is installed. Project instructions and approved specs override upstream skills when they conflict.
3. Do not implement final visual design, final brand styling, or broad production UI before **Gate 4 — Visual direction approved**.
4. Do not import substantial production historical data before **Gate 5 — Historical content/data model approved**.
5. Do not create or use production credentials, production Supabase resources, or production deployments before **Gate 6 — Production integrations/deployment approved**.
6. Treat historical uncertainty explicitly. Never invent exact dates, quotations, borders, coordinates, attribution, or scholarly consensus when the source material does not support that precision.
7. Give animation ownership to one system. GSAP owns cinematic/story timelines and Three.js/R3F scene choreography; Motion owns component/UI interaction. Never make both libraries drive the same property on the same element.
8. Provide a meaningful reduced-motion and non-WebGL fallback for every 3D interaction that carries historical meaning or required navigation.
9. Never commit secrets. Never expose Supabase service-role credentials, private keys, access tokens, or server-only credentials to browser code.
10. Do not run commands classified as destructive by `scripts/guards/policies.mjs`. Destructive, irreversible, production, or security-sensitive actions require explicit human approval.
11. Before claiming implementation completion, produce fresh verification evidence appropriate to the change. For normal code changes run `pnpm verify`; run additional targeted/E2E checks when the changed behavior requires them.
12. Keep files focused. Prefer typed boundaries between features and explicit handoffs over large files that mix unrelated responsibilities.

## Product constraints

- Product/UI language is Vietnamese.
- Technical documentation is Vietnamese by default; English identifiers and upstream API terminology are acceptable.
- 3D and motion are progressive enhancement, not the foundation of correctness.
- Admin surfaces prioritize clarity, accessibility, validation, and data integrity over cinematic treatment.
- Historical content intended for production must carry provenance and must distinguish fact, dispute, inference, and approximation.

## Agent coordination

Canonical roles live in `.agents/roles/`. Harness-specific agent files are generated adapters and must remain thin. Do not edit generated adapters to change role behavior; change the canonical role and regenerate instead.

Reviewer agents are read-only. Other roles may create scoped artifacts only within the task they were delegated.
