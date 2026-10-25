---
name: design-history-story
description: Use when creating or changing a historical story route, editorial composition, motion direction or small educational interaction.
---

# Design a History Story

## Start with the lesson

1. Read `docs/agent/CURRENT-STATE.md` and the applicable approved design; state what the learner should understand, compare, or remember.
2. Select only sourced facts and assets that serve that outcome.
3. Write the reading order as a plain, useful page before adding motion.
4. Choose one visual thesis grounded in the period, material, place, or archival medium.

## Compose

- Prefer editorial hierarchy, maps, primary-source details, captions, and restrained color over generic card grids.
- Keep Vietnamese copy realistic and scannable. Use one `h1`, sequential headings, useful alt text, and visible source labels.
- Compose for laptop/PC using `docs/product/DESKTOP-UI-SCOPE.md`. Optimize mouse, trackpad, and keyboard interaction; defer mobile/tablet layouts and touch-specific work until requested.
- Provide a static equivalent for every animated or spatial explanation.

## Choose motion deliberately

- Use CSS for simple state transitions and Motion for component microinteractions.
- Add GSAP ScrollTrigger only when scroll position must control a multi-step historical sequence.
- Let one engine own each animated property.
- Respect `prefers-reduced-motion` and preserve content order with motion disabled.
- Preserve the approved homepage globe (`docs/superpowers/specs/2026-10-23-curated-history-globe-design.md`) and separately scoped event-detail reconstructions. Do not restore the earlier tabletop. Defer unrelated 3D unless its learning value and scope are approved.

## Interactive game check

Use a small interaction only if its rules rehearse the learning objective. Prefer ordering events, matching evidence, or placing an event on a map. Define success, feedback, keyboard controls, and a non-game alternative before implementation.

## Validate

Test desktop CSS viewports 1280×720, 1366×768, 1440×900, and 1920×1080; mouse/trackpad interaction; keyboard order; reduced motion; asset loading; and the complete story route in a real browser. Preserve existing responsive support; mobile/tablet verification is deferred. Remove decoration that delays or obscures learning.
