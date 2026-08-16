# Checkboxes and radio groups

Traceability: DS-003, DS-007, DS-008.

`CheckboxComponent` represents an independent boolean or mixed selection. `RadioGroupComponent<T>` represents one choice from a typed set. Import both from the public design-system API.

```html
<lsd-checkbox
  id="include-evidence"
  label="Include supporting evidence"
  [(checked)]="includeEvidence"
  [(indeterminate)]="evidenceSelectionMixed" />

<lsd-radio-group
  id="review-depth"
  name="review-depth"
  label="Review depth"
  [options]="reviewDepthOptions"
  [(value)]="reviewDepth" />
```

## Checkbox contract

- `id` and `label` are required; `checked` and `indeterminate` are boolean model signals.
- Native user change clears `indeterminate` and updates `checked`. Mixed state is also exposed as `aria-checked="mixed"`.
- `description`, `error`, `required`, `disabled`, and `name` follow the shared form contract. Errors use `aria-invalid`, `aria-errormessage`, description association, and an alert.

## Radio-group contract

- `id`, `name`, `label`, and typed `RadioOption<T>[]` are required. The required shared name preserves native radio grouping and arrow-key navigation.
- `value` is a `T | null` model signal. DOM indices remain private; consumers receive the original typed value.
- `compareWith` defaults to `Object.is` and supports controlled object values.
- `orientation` is `vertical` or wrapping `horizontal`. It changes layout, not reading or keyboard order.
- Native `<fieldset>` and `<legend>` provide grouped labeling. Description and errors are associated with the fieldset; group and individual disabled states remain native.

Both controls use 44px label targets while retaining browser-native inputs and focus behavior. Semantic accent, text, muted, and danger tokens resolve in both appearances; forced-color and invalid behavior come from shared foundations. Neither primitive adds custom keyboard handlers.

The starter table checkboxes were not adapted because they encoded selection behavior in table features and exposed a starter utility class. The starter contains no reusable radio group.
