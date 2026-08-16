import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

@Component({
  selector: 'lsd-checkbox',
  standalone: true,
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly checked = model(false);
  readonly indeterminate = model(false);
  readonly name = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly error = input<string | undefined>(undefined);
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly descriptionId = computed(() => `${this.id()}-description`);
  protected readonly errorId = computed(() => `${this.id()}-error`);
  protected readonly describedBy = computed(() =>
    [this.description() ? this.descriptionId() : null, this.error() ? this.errorId() : null]
      .filter(Boolean)
      .join(' ') || null,
  );

  protected updateChecked(event: Event): void {
    const control = event.target as HTMLInputElement;
    this.checked.set(control.checked);
    this.indeterminate.set(false);
  }
}
