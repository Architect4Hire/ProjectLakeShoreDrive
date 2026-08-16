# Notifications

`NotificationService` and `NotificationViewportComponent` provide a typed, application-wide transient-message API without exposing starter implementation details. The starter snapshot contained no reusable notification mechanism, so this implementation replaces that missing capability.

Place one `<lsd-notification-viewport />` near the application shell root. Inject `NotificationService` and call `notify()` with plain title/message strings, semantic severity, announcement urgency, and an optional action.

```ts
notifications.notify({
  title: 'Draft ready',
  message: 'The generated draft is ready for review.',
  severity: 'success',
  action: { label: 'Review', invoke: () => openReview() },
});
```

## Accessibility

Notifications default to persistent, dismissible, polite `status` announcements. Urgent events may explicitly use `assertive`, which renders an `alert`; `off` renders a labeled group without a live announcement. Each item is atomic and associates its title and message. Severity includes text and a decorative symbol and never depends on color alone. Named native buttons provide actions and dismissal.

No automatic timeout is applied. This avoids removing content before users with cognitive, motor, or screen-reader needs can perceive or operate it. Call `dismiss(id)` or `clear()` when application state makes a message obsolete.

## Responsive behavior and appearance

The viewport uses the documented notification stacking layer and a tokenized desktop width. On mobile it occupies the available inline viewport with safe insets. Items stack without blocking pointer interaction outside their own surfaces. Semantic status, surface, border, and text tokens support both appearances.

## Do / don't

Do reserve assertive announcements for events requiring immediate attention and keep messages concise. Do provide an action when recovery is simple. Do not use notifications for required decisions, long content, or durable status that belongs inline; use a dialog or alert banner instead.

## Visual coverage

`notification.visual.spec.ts` defines all severities across light/dark and mobile/desktop, including stacked and action states, for the workspace visual runner. Service and component tests cover queue behavior, defaults, live-region semantics, atomic associations, typed actions, semantic styling, and dismissal.
