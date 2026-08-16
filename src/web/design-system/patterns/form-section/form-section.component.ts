import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

import { AlertAnnouncement, AlertBannerComponent } from '../../components/alert-banner/alert-banner.component';
import { SurfaceComponent, SurfacePadding } from '../../primitives/surface/surface.component';

export type FormSectionDensity = 'compact' | 'default';

@Component({
  selector: 'lsd-form-section',
  standalone: true,
  imports: [AlertBannerComponent, SurfaceComponent],
  templateUrl: './form-section.component.html',
  styleUrl: './form-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSectionComponent {
  readonly id = input.required<string>();
  readonly title = input.required<string>();
  readonly guidance = input<string | undefined>(undefined);
  readonly density = input<FormSectionDensity>('default');
  readonly disabled = input(false);
  readonly errorTitle = input<string | undefined>(undefined);
  readonly errorAnnouncement = input<AlertAnnouncement>('assertive');
  readonly disclosureLabel = input('Additional details');
  readonly hasDisclosure = input(false);
  readonly disclosureExpanded = model(false);

  protected readonly surfacePadding = computed<SurfacePadding>(() =>
    this.density() === 'compact' ? 'compact' : 'default',
  );
  protected readonly describedBy = computed(() => {
    const ids = [
      this.guidance() ? `${this.id()}-guidance` : null,
      this.errorTitle() ? `${this.id()}-error-body` : null,
    ].filter(Boolean);
    return ids.length ? ids.join(' ') : null;
  });

  protected disclosureToggled(event: Event): void {
    this.disclosureExpanded.set((event.currentTarget as HTMLDetailsElement).open);
  }
}
