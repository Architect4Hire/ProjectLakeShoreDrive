import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { borderTokens } from '../../tokens/borders';
import { spacingScale, spacingTokens } from '../../tokens/spacing';

export type SeparatorOrientation = 'horizontal' | 'vertical';
export type SeparatorSpacing = 'none' | 'compact' | 'default' | 'section';
export type SeparatorStyle = 'solid' | 'dashed';

@Component({
  selector: 'lsd-separator',
  standalone: true,
  templateUrl: './separator.component.html',
  styleUrl: './separator.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeparatorComponent {
  readonly orientation = input<SeparatorOrientation>('horizontal');
  readonly spacing = input<SeparatorSpacing>('default');
  readonly lineStyle = input<SeparatorStyle>('solid');
  /** Decorative separators are removed from the accessibility tree. */
  readonly decorative = input(false);

  protected readonly rule = computed(() => {
    const token = borderTokens.separator;
    return `${token.replace('solid', this.lineStyle())} var(--lsd-color-border-default)`;
  });
  protected readonly inset = computed(() => this.spacingValues[this.spacing()]);

  private readonly spacingValues: Record<SeparatorSpacing, string> = {
    none: spacingScale[0],
    compact: spacingTokens['stack-related'],
    default: spacingTokens['stack-default'],
    section: spacingTokens['stack-section'],
  };
}
