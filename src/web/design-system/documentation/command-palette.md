# Command palette

`CommandPaletteComponent<T>` is the business-neutral UX-001 shell command interface. Applications provide typed, grouped commands; the pattern owns search, modal focus, keyboard navigation, and typed selection without knowing what a command does.

## API

- Required: stable `id` and typed `groups`; every group and command has a stable DOM-safe string ID, while command `identity` remains generic.
- Optional: title, search label, placeholder, two-way `open` and `query`, and configurable `shortcut` (`primary`, `control`, or `meta`).
- Commands support label, description, search keywords, display shortcut, and disabled state.
- `commandSelected` emits only the typed identity. Execution, authorization, navigation, and telemetry remain application responsibilities.

## Keyboard and focus behavior

The default invocation is Control+K or Command+K. Opening uses the public modal-dialog contract, moves focus to search, contains modal focus, supports Escape, and restores the prior trigger. Search uses the ARIA combobox/listbox pattern with active descendant. Up/Down Arrow wraps through enabled filtered commands, Home/End move to boundaries, Enter selects, and disabled commands are skipped. Pointer selection uses the same typed output.

## Responsive behavior

The dialog contracts to available mobile width. Results scroll within viewport height, mobile rows retain touch sizing, and optional keyboard-hint text is hidden when space is constrained. Group labels and command descriptions remain available.

## Do / don't

Do register concise commands from the application shell, include useful search synonyms, validate authorization before registration and execution, and maintain stable IDs. Do not embed feature models or callbacks in this pattern, register destructive commands without a confirmation flow, or override browser shortcuts without documenting the configured binding.

## Appearance and visual coverage

The palette uses semantic surfaces, borders, accent selection, text, focus, dialog elevation, and both appearances. `command-palette.visual.spec.ts` defines grouped, selected, filtered, empty, disabled, desktop, and mobile critical states for the workspace visual runner. Component tests cover invocation, initial focus, filtering, grouped results, active-descendant navigation, disabled skipping, typed selection, and empty announcements.
