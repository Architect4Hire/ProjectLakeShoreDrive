import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { borderStyles, borderTokens } from '../../tokens/borders';
import { elevationTokens } from '../../tokens/elevation';
import { radiusScale, radiusTokens } from '../../tokens/radius';
import { spacingScale, spacingTokens } from '../../tokens/spacing';

export type SurfaceAccessibility =
  | Readonly<{ role: 'none' }>
  | Readonly<{ role: 'group' | 'region'; label: string }>;
export type SurfaceBorder = 'none' | 'default' | 'strong';
export type SurfaceElevation = 'flat' | 'raised' | 'sticky';
export type SurfacePadding = 'none' | 'compact' | 'default' | 'comfortable';
export type SurfaceRadius = 'none' | 'panel' | 'prominent';
export type SurfaceTone = 'page' | 'panel' | 'raised';

const noSurfaceRole: SurfaceAccessibility = { role: 'none' };

@Component({
  selector: 'lsd-surface',
  standalone: true,
  templateUrl: './surface.component.html',
  styleUrl: './surface.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurfaceComponent {
  readonly tone = input<SurfaceTone>('panel');
  readonly padding = input<SurfacePadding>('default');
  readonly radius = input<SurfaceRadius>('panel');
  readonly border = input<SurfaceBorder>('default');
  readonly elevation = input<SurfaceElevation>('flat');
  readonly accessibility = input<SurfaceAccessibility>(noSurfaceRole);

  protected readonly classes = computed(() =>
    ['lsd-surface text-text-primary', this.toneClasses[this.tone()]].join(' '),
  );
  protected readonly role = computed(() => {
    const accessibility = this.accessibility();
    return accessibility.role === 'none' ? null : accessibility.role;
  });
  protected readonly label = computed(() => {
    const accessibility = this.accessibility();
    return accessibility.role === 'none' ? null : accessibility.label;
  });
  protected readonly borderStyle = computed(() =>
    `${this.borderStyleValues[this.border()]}${this.border() === 'none' ? '' : ' var(--lsd-color-border-default)'}`,
  );
  protected readonly boxShadow = computed(() => elevationTokens[this.elevation()]);
  protected readonly borderRadius = computed(() => this.radiusValues[this.radius()]);
  protected readonly inset = computed(() => this.paddingValues[this.padding()]);

  private readonly toneClasses: Record<SurfaceTone, string> = {
    page: 'bg-surface-page',
    panel: 'bg-surface-panel',
    raised: 'bg-surface-raised',
  };

  private readonly borderStyleValues: Record<SurfaceBorder, string> = {
    none: borderStyles.none,
    default: borderTokens.default,
    strong: borderTokens.strong,
  };

  private readonly radiusValues: Record<SurfaceRadius, string> = {
    none: radiusScale.none,
    panel: radiusTokens.panel,
    prominent: radiusTokens['panel-prominent'],
  };

  private readonly paddingValues: Record<SurfacePadding, string> = {
    none: spacingScale[0],
    compact: spacingTokens['panel-inset-compact'],
    default: spacingTokens['panel-inset-default'],
    comfortable: spacingTokens['panel-inset-comfortable'],
  };
}
