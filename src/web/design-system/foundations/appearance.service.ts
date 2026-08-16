import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';

import { semanticColorThemes } from '../tokens/internal/semantic-color-themes';
import { type Appearance, semanticColorTokenNames } from '../tokens/semantic-colors';

const APPEARANCE_STORAGE_KEY = 'lsd.design-system.appearance';

@Injectable({ providedIn: 'root' })
export class AppearanceService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly selectedAppearance = signal<Appearance>(this.readPreference());

  readonly appearance = this.selectedAppearance.asReadonly();

  constructor() {
    effect(() => this.applyAppearance(this.selectedAppearance()));
  }

  setAppearance(appearance: Appearance): void {
    this.selectedAppearance.set(appearance);
  }

  toggleAppearance(): void {
    this.selectedAppearance.update((current) => (current === 'light' ? 'dark' : 'light'));
  }

  private readPreference(): Appearance {
    if (!isPlatformBrowser(this.platformId)) {
      return 'light';
    }

    try {
      const stored = localStorage.getItem(APPEARANCE_STORAGE_KEY);
      return stored === 'dark' || stored === 'light' ? stored : 'light';
    } catch {
      return 'light';
    }
  }

  private applyAppearance(appearance: Appearance): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const root = this.document.documentElement;
    const colors = semanticColorThemes[appearance];

    root.dataset['appearance'] = appearance;
    root.style.colorScheme = appearance;
    for (const token of semanticColorTokenNames) {
      root.style.setProperty(`--lsd-color-${token}`, colors[token]);
    }
    root.style.setProperty('--lsd-color-focus-ring', colors['accent-primary']);

    try {
      localStorage.setItem(APPEARANCE_STORAGE_KEY, appearance);
    } catch {
      // Storage may be unavailable; the in-memory appearance remains deterministic.
    }
  }
}
