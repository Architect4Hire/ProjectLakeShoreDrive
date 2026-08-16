# ADR-0006 — Use Angular 22 with a Local Semantic Design System

**Status:** Proposed

## Context

Lake Shore Drive is a dense workbench with repeated matrices, editors, AI states, citations and review patterns. Page-level Tailwind composition would drift quickly.

## Decision

Use Angular 22 and an authoritative local design system under `src/web/design-system/`; Tailwind primarily implements semantic design-system primitives and recipes.

## Consequences

- accessibility and visual behavior are centralized;
- feature pages compose semantic components;
- repeated feature class recipes are treated as defects;
- the team must maintain component documentation and regression coverage.
