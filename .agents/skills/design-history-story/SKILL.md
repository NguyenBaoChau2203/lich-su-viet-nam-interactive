---
name: design-history-story
description: Design accessible visual storytelling for a Vietnamese historical event or period. Use when creating a story route, scroll narrative, editorial composition, motion direction, or a small educational interaction.
---

# Design a History Story

## Start with the lesson

1. State what the learner should understand, compare, or remember.
2. Select only sourced facts and assets that serve that outcome.
3. Write the reading order as a plain, useful page before adding motion.
4. Choose one visual thesis grounded in the period, material, place, or archival medium.

## Compose

- Prefer editorial hierarchy, maps, primary-source details, captions, and restrained color over generic card grids.
- Keep Vietnamese copy realistic and scannable. Use one `h1`, sequential headings, useful alt text, and visible source labels.
- Make mobile the narrative baseline; enhance wide screens without changing meaning.
- Provide a static equivalent for every animated or spatial explanation.

## Choose motion deliberately

- Use CSS for simple state transitions and Motion for component microinteractions.
- Add GSAP ScrollTrigger only when scroll position must control a multi-step historical sequence.
- Let one engine own each animated property.
- Respect `prefers-reduced-motion` and preserve content order with motion disabled.
- Defer Three.js unless spatial depth teaches something a 2D map or diagram cannot.

## Interactive game check

Use a small interaction only if its rules rehearse the learning objective. Prefer ordering events, matching evidence, or placing an event on a map. Define success, feedback, keyboard controls, and a non-game alternative before implementation.

## Validate

Test 320, 768, 1024, and 1440 px; keyboard order; reduced motion; asset loading; and the complete story route in a real browser. Remove decoration that delays or obscures learning.
