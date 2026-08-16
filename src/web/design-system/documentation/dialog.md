# Dialog

`DialogComponent` presents blocking, business-neutral decisions or focused tasks. It uses the native modal dialog contract for top-layer rendering and focus containment.

## API and composition

- Required: `id`, `title`.
- Optional: `description`, `open`, `size` (`small`, `medium`, `large`), `dismissible`, `closeLabel`.
- Output: `closeRequested` with `escape`, `backdrop`, or `close-button`. The owner responds by setting `open` to `false`.
- Project body content normally and mark the action container with `lsdDialogActions`.
- Add `lsdDialogInitialFocus` to the safest initial control. Otherwise the first enabled focusable control is used.

```html
<lsd-dialog
  id="confirmation"
  title="Confirm changes"
  description="Review before continuing."
  [open]="dialogOpen()"
  (closeRequested)="dialogOpen.set(false)">
  <p>The proposed changes remain editable until approval.</p>
  <div lsdDialogActions>
    <lsd-button impact="minimal">Cancel</lsd-button>
    <lsd-button lsdDialogInitialFocus>Continue</lsd-button>
  </div>
</lsd-dialog>
```

## Accessibility

The title and optional description label the native `<dialog>`. `showModal()` supplies modal semantics and browser focus containment. Escape, backdrop, and the named close control are supported when dismissible. Initial focus is deterministic and focus returns to the previously active trigger after dismissal. Do not use a dialog for passive status messages.

## Responsive and appearance behavior

The dialog is constrained to the viewport, its body scrolls independently, and action controls wrap on narrow screens. All sizes collapse to the available mobile width and preserve a 44px close target. Surface, text, and border styling use semantic tokens, so the same component resolves in light and dark appearances.

## Do / don't

Do keep the title concise, select a safe initial control, and make destructive actions explicit. Do not nest modal dialogs, encode feature models in the primitive, or rely on backdrop dismissal as the only way to close it.

## Visual coverage

`dialog.visual.spec.ts` defines the required light/dark and mobile/desktop critical-state matrix for the workspace visual runner. The focused component tests also assert semantic appearance classes, responsive size selection, labeling, focus movement, Escape dismissal, and focus restoration.
