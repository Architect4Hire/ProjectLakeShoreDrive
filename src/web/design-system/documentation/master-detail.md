# Master/detail pattern

`MasterDetailComponent` presents caller-owned list/context content beside caller-owned detail content at workbench widths, then becomes a focused list-or-detail navigation flow below the tablet breakpoint. It composes design-system Surface and Button primitives and contains no record types or data services.

## API and composition

- Required inputs: stable `id`, `masterLabel`, and `detailLabel`.
- Optional inputs: `backLabel` and `detailAvailable`.
- `view` is a two-way model with typed values `master | detail`.
- Project list/context with `lsdMasterDetailMaster`, selected content with `lsdMasterDetailDetail`, and an unselected placeholder with `lsdMasterDetailPlaceholder`.
- `MasterDetailTriggerDirective` emits the activating element. Pass it to `openDetail` so focus can move to detail and return to the exact trigger.

```html
<lsd-master-detail
  #browser
  id="adr-browser"
  masterLabel="Decision records"
  detailLabel="Selected decision"
  [(view)]="view">
  <nav lsdMasterDetailMaster>
    @for (record of records(); track record.id) {
      <button lsdMasterDetailTrigger (detailRequested)="select(record); browser.openDetail($event)">
        {{ record.title }}
      </button>
    }
  </nav>
  <article lsdMasterDetailDetail><!-- public design-system composition --></article>
</lsd-master-detail>
```

The caller owns selection identity and state; the pattern owns only presentation and focus navigation.

## Accessibility and interaction

Master and detail are separate, programmatically named regions in stable DOM order. Activating a trigger changes the focused view and moves keyboard focus to the detail region. The narrow-layout Back control is a composed `ButtonComponent`; it restores the master view and returns focus to the originating connected trigger, falling back to the master region when needed. Projected lists should use native navigation/list semantics and expose selection with the appropriate native state or `aria-current`.

## Responsive behavior

Desktop uses a two-column 2:3 split with minimum readable pane widths. Below 48rem, only `view`'s pane is visible and the Back action appears. Below 30rem, panel padding tightens without reducing projected controls' touch targets. Content must wrap or supply its own documented responsive escape hatch.

## Do / don't

Do use this for related context and detail that benefit from simultaneous desktop inspection. Keep the selected record and routing state in the feature. Provide an actionable no-selection placeholder. Do not import feature models into the pattern, duplicate Surface/Button styling, rely on color alone for selection, or force both panes into a narrow viewport.

## Appearance and visual coverage

All surfaces, borders, text, buttons, and focus treatment resolve through semantic design-system APIs in light and dark appearances. `master-detail.visual.spec.ts` defines desktop split, tablet/mobile focused navigation, and unavailable-detail states for the workspace visual runner.
