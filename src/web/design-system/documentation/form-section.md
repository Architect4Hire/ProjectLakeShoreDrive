# Form section pattern

`FormSectionComponent` groups related workbench editor controls with a title, concise guidance, caller-owned actions, section-level errors, and optional deeper evidence or metadata. It composes Surface and Alert Banner APIs around native fieldset, legend, and details semantics.

## Variants and API

- Required: stable `id` and `title`.
- Optional: `guidance`, `disabled`, and `density` (`default | compact`).
- Set `errorTitle` to expose the standard danger Alert Banner; project its details through `lsdFormSectionErrors`. `errorAnnouncement` defaults to assertive and accepts the Alert Banner announcement contract.
- Project high-frequency section actions through `lsdFormSectionActions` and ordinary form controls through the default slot.
- Set `hasDisclosure` and provide `disclosureLabel` to expose `lsdFormSectionDisclosure` content. `disclosureExpanded` is a two-way model synchronized with the native disclosure.

```html
<lsd-form-section
  id="operational-constraints"
  title="Operational constraints"
  guidance="Capture the facts needed for the current architecture decision."
  density="compact"
  [errorTitle]="sectionErrorTitle()"
  [hasDisclosure]="true"
  [(disclosureExpanded)]="showEvidence">
  <lsd-button lsdFormSectionActions impact="minimal">Use defaults</lsd-button>
  <p lsdFormSectionErrors>{{ sectionError() }}</p>
  <!-- public form-control composition -->
  <div lsdFormSectionDisclosure><!-- evidence/provenance controls --></div>
</lsd-form-section>
```

## Accessibility and interaction

Native fieldset and legend semantics name the complete control group. Guidance and visible error content are associated through `aria-describedby`. Disabling the section uses native fieldset behavior, so descendant form controls become unavailable consistently. Errors compose an announced Alert Banner. Advanced content uses keyboard-operable native `<details>`/`<summary>` and starts collapsed unless the caller controls otherwise. Decision-critical fields and recovery actions must remain outside that disclosure.

## Responsive behavior

Desktop keeps concise guidance and actions on one row where space permits. Below 48rem they stack, and below 30rem action groups become a single column. Default and compact density change internal rhythm but never reduce the touch targets supplied by projected design-system controls. Long field content must wrap or use its own documented escape hatch.

## Do / don't

Do group controls that share one meaningful legend, keep current-decision guidance visible, associate section errors, and reserve disclosure for evidence, provenance, or advanced metadata. Do not use placeholder text as guidance, hide required fields or error recovery inside disclosure, recreate Alert/Surface styling, import feature models/services, or use one section for an entire unrelated form.

## Appearance and visual coverage

Surface, alert, border, text, focus, disabled, and disclosure styling use semantic design-system foundations in both appearances. `form-section.visual.spec.ts` defines default/compact density, errors, collapsed/expanded details, disabled state, and desktop/mobile layouts for the workspace visual runner.
