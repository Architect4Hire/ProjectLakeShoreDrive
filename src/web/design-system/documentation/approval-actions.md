# Approval actions recipe

## Purpose, API, states, and accessibility

Use this recipe for an explicit caller-controlled review decision. Inputs are `id`, `label`, `status`, `provenance`, `warnings`, `mode`, processing state, and per-action disabled flags; outputs are `approved`, `rejected`, and `changeRequested`. Visible status, provenance, warnings, disabled state, and native buttons prevent color-only or inaccessible decisions.

Traceability: DS-003, UX-004, GOV-002.

`ApprovalActionsComponent` provides a contained or sticky review bar with caller-owned review status, GOV-002 provenance, validation warnings, and approve, reject, and request-change intents. It composes public surface, badge, alert, and button APIs and performs no transition, persistence, or authorization.

```html
<lsd-approval-actions id="adr-review" mode="sticky" [status]="status" [provenance]="provenance"
  [warnings]="warnings" [approveDisabled]="!canApprove" (approved)="approve()"
  (rejected)="reject()" (changeRequested)="requestChanges()" />
```

Statuses are pending, approved, rejected, and changes-requested. Processing identifies one pending intent and disables competing actions. Warnings are announced politely but do not automatically block approval; the authorized caller supplies disablement. AI-generated content explicitly says “Not approved,” while only human-approved provenance uses approved styling.

## Responsive behavior

Sticky mode uses the published sticky layer at the viewport/container bottom; contained mode remains in flow. Below `48rem` state and actions stack, and below `30rem` action buttons become a full vertical group.

The outer surface is a named region, warnings use status semantics, actions form a labeled native-button group, processing exposes loading text, and all states use visible text rather than color. Project supporting metadata into `lsdApprovalContext` and public controls into `lsdApprovalSecondaryActions`.

Do pass already-authorized actions and explicit validation results. Don't calculate permissions, approve records, persist decisions, infer workflow transitions, or silently insert AI suggestions.

Visual regression covers light/dark, sticky/contained, desktop/mobile, every review status, all provenance variants, warnings present/absent, disabled and processing actions, long warnings, and keyboard focus.

## Standalone Angular import

```ts
import { Component } from '@angular/core';
import { ApprovalActionsComponent } from 'src/web/design-system/public-api';

@Component({ standalone: true, imports: [ApprovalActionsComponent], templateUrl: './example.html' })
export class ApprovalExampleComponent {}
```
