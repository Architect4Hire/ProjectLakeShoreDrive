import { Component, computed } from '@angular/core';
import { VisualFixturesComponent } from './visual-fixtures.component';
import { GalleryComponent } from '../../src/web/app/gallery/gallery.component';

@Component({
  selector: 'lsd-visual-regression-shell',
  standalone: true,
  imports: [VisualFixturesComponent, GalleryComponent],
  template: `
    @if (isGallery()) {
      <lsd-gallery />
    } @else {
      <lsd-visual-fixtures />
    }
  `,
})
export class VisualRegressionShellComponent {
  protected readonly isGallery = computed(() => location.pathname === '/gallery');
}
