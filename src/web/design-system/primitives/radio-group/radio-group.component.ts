import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

export interface RadioOption<T> {
  readonly value: T;
  readonly label: string;
  readonly disabled?: boolean;
}

export type RadioCompareWith<T> = (left: T, right: T) => boolean;
export type RadioGroupOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'lsd-radio-group',
  standalone: true,
  templateUrl: './radio-group.component.html',
  styleUrl: './radio-group.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupComponent<T = string> {
  readonly id = input.required<string>();
  readonly name = input.required<string>();
  readonly label = input.required<string>();
  readonly options = input.required<readonly RadioOption<T>[]>();
  readonly value = model<T | null>(null);
  readonly compareWith = input<RadioCompareWith<T>>((left, right) => Object.is(left, right));
  readonly orientation = input<RadioGroupOrientation>('vertical');
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
  protected readonly optionsClass = computed(() =>
    this.orientation() === 'horizontal' ? 'flex flex-wrap gap-x-6 gap-y-1' : 'grid gap-1',
  );

  protected optionId(index: number): string {
    return `${this.id()}-${index}`;
  }

  protected isChecked(option: RadioOption<T>): boolean {
    const selected = this.value();
    return selected !== null && this.compareWith()(option.value, selected);
  }

  protected selectOption(index: number): void {
    const option = this.options()[index];
    if (option && !option.disabled && !this.disabled()) {
      this.value.set(option.value);
    }
  }
}
