import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

export interface SelectOption<T> {
  readonly value: T;
  readonly label: string;
  readonly disabled?: boolean;
}

export type SelectCompareWith<T> = (left: T, right: T) => boolean;

@Component({
  selector: 'lsd-select',
  standalone: true,
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent<T = string> {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly options = input.required<readonly SelectOption<T>[]>();
  readonly value = model<T | null>(null);
  readonly compareWith = input<SelectCompareWith<T>>((left, right) => Object.is(left, right));
  readonly placeholder = input<string | undefined>('Select an option');
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
  protected readonly selectedKey = computed(() => {
    const selected = this.value();
    if (selected === null) {
      return '';
    }

    const index = this.options().findIndex((option) => this.compareWith()(option.value, selected));
    return index < 0 ? '' : String(index);
  });

  protected updateValue(event: Event): void {
    const key = (event.target as HTMLSelectElement).value;
    if (key === '') {
      this.value.set(null);
      return;
    }

    const option = this.options()[Number(key)];
    if (option && !option.disabled) {
      this.value.set(option.value);
    }
  }
}
