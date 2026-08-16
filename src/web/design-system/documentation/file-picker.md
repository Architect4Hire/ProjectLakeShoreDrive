# File picker and dropzone

## Purpose

Use the file picker to validate a caller-selected batch and emit accepted and rejected files without uploading them.

`FilePickerComponent` provides a native, keyboard-accessible file chooser with drag/drop enhancement. The starter contains no reusable upload component, so this capability is Lake Shore Drive-owned and business-neutral.

## API

- Required: stable `id` and `label`; optional description, browse/drop labels, native `accept`, `multiple`, `disabled`, `maxFiles`, and `maxFileSizeBytes`.
- `validateFile` adds a caller-owned synchronous validation rule without coupling the component to upload transport or feature records.
- `filesSelected` emits typed accepted files and rejected files with human-readable reasons.
- Project transport status with `lsdFilePickerProgress` and server/upload errors with `lsdFilePickerError`.

## Accessibility and interaction

Browse is a named native button that invokes the hidden native file input and receives the global focus-visible treatment. Drag/drop is never the only selection path. Validation failures render as an atomic assertive alert. Caller-projected progress is a polite atomic status; projected transport errors are assertive alerts. Disabled state blocks browse and drop processing.

Native `accept` is only a chooser hint, so the same MIME, wildcard MIME, and extension rules are validated after browse or drop. File-size, count, and custom validation also run before emission. Server-side validation remains mandatory because browser files are untrusted input.

## Responsive behavior

Desktop layouts place browse and drag guidance inline. Mobile layouts stack them, reduce the dropzone height, and make the browse control full width while retaining a 44px target. Semantic surface, border, accent, status, text, disabled, and focus treatments support both appearances.

## Do / don't

Do state accepted formats and size limits in the description, validate again on the server, and keep progress visible until completion. Do not auto-upload before the caller handles `filesSelected`, rely only on file extensions for security, or make drag/drop the sole interaction.

## Visual coverage

`file-picker.visual.spec.ts` defines idle, dragging, validation-error, progress, transport-error, disabled, light/dark, and mobile/desktop critical states for the workspace visual runner. Component tests cover native browse, typed selection, type/size/count validation, drop enhancement, and announcement hooks.

## Standalone Angular import

```ts
import { Component } from '@angular/core';
import { FilePickerComponent } from 'src/web/design-system/public-api';

@Component({ standalone: true, imports: [FilePickerComponent], templateUrl: './example.html' })
export class FilePickerExampleComponent {}
```

```html
<lsd-file-picker
  id="evidence-files"
  label="Add evidence"
  accept=".pdf"
  [multiple]="true"
  (filesSelected)="selectFiles($event)"
/>
```
