# Tabs

`TabsComponent<T>` switches between peer views while preserving strongly typed identity. It is business-neutral and uses typed `TabItem<T>` definitions with typed `lsdTabPanel` templates.

## API and usage

- Required: stable `id`, accessible tab-list `label`, typed `tabs`, and typed `selected` identity.
- Optional: `compareWith` for object identities.
- Output: typed `selectionChange`.
- Each panel is an `<ng-template>` whose `lsdTabPanel` identity matches one tab.

```html
<lsd-tabs id="artifact" label="Artifact views" [tabs]="tabs"
  [selected]="selected()" (selectionChange)="selected.set($event)">
  <ng-template lsdTabPanel="content">Content</ng-template>
  <ng-template lsdTabPanel="sources">Sources</ng-template>
</lsd-tabs>
```

## Accessibility

The component implements the WAI-ARIA horizontal tabs pattern with `tablist`, `tab`, and `tabpanel` relationships. Exactly the selected enabled tab participates in sequential focus. Left/Right Arrow wraps through enabled tabs, Home selects the first enabled tab, End selects the last enabled tab, and activation follows focus. Disabled tabs are skipped. The panel remains keyboard-focusable for efficient movement into its content.

## Responsive behavior and appearance

The tab strip scrolls horizontally without wrapping or shrinking labels. Compact widths gain touch-sized controls and scroll snapping; the panel remains within its parent width. Semantic border, surface, accent, and text tokens support both appearances.

## Do / don't

Do use tabs for a small set of peer views and use stable identities. Do preserve the active tab when data refreshes. Do not use tabs as sequential workflow steps, hide essential status only in an inactive panel, or create feature-specific tab variants.

## Visual coverage

`tabs.visual.spec.ts` defines light/dark, desktop/mobile overflow, selected, and disabled critical states for the workspace visual runner. Component tests cover ARIA relationships, typed selection, roving focus, wrapping, disabled-tab skipping, Home, and End.
