import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  numberAttribute,
} from '@angular/core';

export type TextareaDensity = 'compact' | 'default' | 'comfortable';
export type TextareaResize = 'none' | 'vertical' | 'both';
export type TextareaWrap = 'hard' | 'soft';

@Component({
  selector: 'lsd-textarea',
  standalone: true,
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaComponent {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly value = model('');
  readonly density = input<TextareaDensity>('default');
  readonly resize = input<TextareaResize>('vertical');
  readonly rows = input(5, { transform: numberAttribute });
  readonly wrap = input<TextareaWrap>('soft');
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
  protected readonly classes = computed(() =>
    [
      'block w-full rounded-md border border-border-default bg-surface-panel text-text-primary placeholder:text-text-muted',
      this.densityClasses[this.density()],
      this.resizeClasses[this.resize()],
    ].join(' '),
  );

  protected updateValue(event: Event): void {
    this.value.set((event.target as HTMLTextAreaElement).value);
  }

  private readonly densityClasses: Record<TextareaDensity, string> = {
    compact: 'min-h-24 px-3 py-2 text-sm',
    default: 'min-h-36 px-4 py-3 text-sm',
    comfortable: 'min-h-56 px-4 py-4 text-base',
  };

  private readonly resizeClasses: Record<TextareaResize, string> = {
    none: 'resize-none',
    vertical: 'resize-y',
    both: 'resize',
  };
}
