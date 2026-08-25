# ADR-0001: Use OpenCode V2 configuration shapes

## Status

Accepted for Plan A foundation.

## Context

The implementation plan was written while OpenCode configuration examples existed in both V1 and V2 forms. The approved spec explicitly targets the V2 plugin API and requires the adapter to remain minimal. Current OpenCode V2 documentation uses `plugins` and ordered `permissions` rules; the `edit` action covers edit/write/patch operations.

## Decision

Use the current V2 `plugins` and `permissions` fields in project configuration and use a single reviewer deny rule for the `edit` action. Do not add legacy `write` permission syntax or hard-code a model.

## Consequences

OpenCode adapter files align with the V2 schema. Because the V2 plugin API is beta, changes remain isolated under `opencode.json` and `.opencode/` so future migrations do not affect product architecture.
