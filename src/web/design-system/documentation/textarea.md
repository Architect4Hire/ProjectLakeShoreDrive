# Textarea primitive

Traceability: DS-003, DS-007, DS-008, DS-009.

`TextareaComponent` supports multiline discovery responses, architecture notes, rationale, and other long-form workbench input without encoding a feature workflow. Import it from the public design-system API.

```html
<lsd-textarea
  id="architecture-notes"
  label="Architecture notes"
  description="Record decisions, constraints, and open questions."
  density="comfortable"
  resize="vertical"
  [error]="notesError()"
  [(value)]="notes" />
```

## Contract

- `id` and `label` are required. The stable ID associates the native textarea, label, description, and error.
- `value` is model-signal state and supports `[(value)]` binding.
- `density`: `compact | default | comfortable`. Compact supports dense workbench panels, default supports common discovery responses, and comfortable provides a larger long-form editing area. Every density remains full-width on narrow layouts.
- `resize`: `none | vertical | both`, defaulting to `vertical` so users can expand long responses without destabilizing horizontal layouts.
- `rows` defaults to five; `wrap` supports native `soft` or `hard` wrapping.
- `required`, `disabled`, and `readonly` map to native properties.
- `description` uses `aria-describedby`. `error` sets `aria-invalid` and `aria-errormessage`, extends the description association, and renders an alert.

Native `<textarea>` behavior owns cursor movement, selection, newlines, clipboard operations, scrolling, and keyboard focus. The shared interaction foundation supplies visible focus, disabled, readonly, invalid, and forced-color behavior. Semantic surface, text, border, and danger tokens resolve in both appearances.

No starter implementation was adapted because the retained starter snapshot contains no reusable textarea primitive.
