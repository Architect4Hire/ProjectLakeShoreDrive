import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

export type InputAutocomplete =
  | 'off'
  | 'on'
  | 'email'
  | 'name'
  | 'new-password'
  | 'current-password'
  | 'organization'
  | 'tel'
  | 'url'
  | 'username';
export type InputMode = 'decimal' | 'email' | 'none' | 'numeric' | 'search' | 'tel' | 'text' | 'url';
export type InputType = 'email' | 'password' | 'search' | 'tel' | 'text' | 'url';

@Component({
  selector: 'lsd-input',
  standalone: true,
  host: { '[attr.id]': 'null' },
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly value = model('');
  readonly type = input<InputType>('text');
  readonly inputMode = input<InputMode>('text');
  readonly autocomplete = input<InputAutocomplete>('off');
  readonly name = input<string | undefined>(undefined);
  readonly placeholder = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly error = input<string | undefined>(undefined);
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readOnly = input(false, { alias: 'readonly', transform: booleanAttribute });

  protected readonly descriptionId = computed(() => `${this.id()}-description`);
  protected readonly errorId = computed(() => `${this.id()}-error`);
  protected readonly describedBy = computed(() =>
    [this.description() ? this.descriptionId() : null, this.error() ? this.errorId() : null]
      .filter(Boolean)
      .join(' ') || null,
  );

  protected updateValue(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }
}
