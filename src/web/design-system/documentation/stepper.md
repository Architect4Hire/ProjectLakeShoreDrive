# Stepper

## Purpose

Use the stepper for an ordered sequence with a controlled active identity and optional activation.

`StepperComponent<T>` communicates progress through an ordered multi-stage flow and optionally provides navigation. It owns presentation and accessibility only; the caller owns stage eligibility and workflow rules.

## API

- Required: accessible `label`, typed `steps`, and typed `active` identity.
- A `StepperStep<T>` provides `identity`, `label`, optional `description`, optional visual `state` (`incomplete`, `complete`, `error`), and caller-controlled `disabled` navigation.
- Optional: `interactive` and `compareWith` for object identities.
- Output: typed `stepActivated`. Emission does not imply that a domain transition succeeded.

```html
<lsd-stepper label="Setup progress" [steps]="stages" [active]="activeStage()"
  (stepActivated)="requestStage($event)" />
```

## Accessibility

The component uses labeled navigation containing an ordered list. The active item has `aria-current="step"`; current, completed, incomplete, and error meanings include screen-reader text and never depend on color alone. Interactive steps are native buttons with normal keyboard operation and visible global focus treatment. Disabled behavior comes only from the caller. Bind `[interactive]="false"` for read-only progress.

## Responsive behavior and appearance

The ordered sequence scrolls horizontally rather than compressing or wrapping into an ambiguous order. Mobile controls meet touch-target sizing, descriptions collapse visually while labels and screen-reader state remain available, and connectors become compact. Semantic surface, accent, success, danger, and text tokens resolve in both appearances.

## Do / don't

Do use the component for a finite ordered flow and keep labels concise. Do validate transitions in feature/application logic before updating `active`. Do not encode domain phases inside the component, use completion color without textual status, or treat the emitted selection as proof that work completed.

## Visual coverage

`stepper.visual.spec.ts` defines light/dark, desktop/mobile overflow, mixed progress, error, and disabled critical states for the workspace visual runner. Component tests cover navigation semantics, typed identity, current/completed announcements, disabled steps, and semantic state styling.

## Standalone Angular import

```ts
import { Component } from '@angular/core';
import { StepperComponent } from 'src/web/design-system/public-api';

@Component({ standalone: true, imports: [StepperComponent], templateUrl: './example.html' })
export class StepperExampleComponent {}
```
