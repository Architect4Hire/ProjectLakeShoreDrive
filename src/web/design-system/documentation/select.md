# Select primitive

Traceability: DS-003, DS-007, DS-008, DS-009.

`SelectComponent<T>` provides a native single-choice control without reducing application values to untyped DOM strings. Import it and `SelectOption<T>` from the public design-system API.

```ts
readonly options: readonly SelectOption<number>[] = [
  { value: 10, label: 'Ten' },
  { value: 20, label: 'Twenty' },
];
```

```html
<lsd-select
  id="page-size"
  label="Page size"
  description="Choose the number of rows."
  [options]="options"
  [(value)]="pageSize" />
```

## Contract

- `id`, `label`, and `options` are required typed inputs. Each `SelectOption<T>` has a typed `value`, display `label`, and optional disabled state.
- `value` is a `T | null` model signal. DOM option indices are private transport keys; feature code receives the original typed value rather than a serialized string.
- `compareWith` defaults to `Object.is` and can identify controlled object values by stable domain identity.
- `placeholder` defaults to `Select an option`; set it to `undefined` only when `value` is initialized to an available option.
- `required` and `disabled` forward to native properties.
- `description` uses `aria-describedby`. `error` sets `aria-invalid` and `aria-errormessage`, extends the help association, and renders an alert.

The native `<select>` retains browser keyboard navigation, focus, option disabling, and narrow-screen picker behavior. Its 44px minimum height supports touch layouts. Shared foundations supply visible focus, disabled, invalid, and forced-color behavior. Semantic surface, text, border, and danger tokens resolve in both appearances.

The starter's status and page-size selects were not adapted because they serialized dashboard-specific values and lacked reusable label, help, error, and typed-value APIs.
