import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';

import { elevationTokens } from '../tokens/elevation';
import { radiusTokens } from '../tokens/radius';
import { accentPrimaryThemes } from '../tokens/internal/accent-primary-themes';
import { semanticColorThemes } from '../tokens/internal/semantic-color-themes';
import {
  type AccentColor,
  type Appearance,
  type Direction,
  accentColorNames,
  semanticColorTokenNames,
} from '../tokens/semantic-colors';

const APPEARANCE_STORAGE_KEY = 'lsd.design-system.appearance';
const ACCENT_COLOR_STORAGE_KEY = 'lsd.design-system.accent-color';
const DIRECTION_STORAGE_KEY = 'lsd.design-system.direction';
const DEFAULT_ACCENT_COLOR: AccentColor = 'rose';

@Injectable({ providedIn: 'root' })
export class AppearanceService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly selectedAppearance = signal<Appearance>(this.readPreference());
  private readonly selectedAccentColor = signal<AccentColor>(this.readAccentColorPreference());
  private readonly selectedDirection = signal<Direction>(this.readDirectionPreference());

  readonly appearance = this.selectedAppearance.asReadonly();
  readonly accentColor = this.selectedAccentColor.asReadonly();
  readonly direction = this.selectedDirection.asReadonly();

  constructor() {
    this.applyStaticTokens();
    effect(() => this.applyAppearance(this.selectedAppearance(), this.selectedAccentColor()));
    effect(() => this.applyDirection(this.selectedDirection()));
  }

  /**
   * Radius/elevation are appearance-invariant, so they're applied once here
   * rather than in the appearance effect below. Values are read directly
   * from tokens/radius.ts and tokens/elevation.ts (never re-typed as a
   * literal in a foundations CSS file) so check-design-system-boundaries.mjs's
   * raw-color-literal scan has nothing to flag outside tokens/.
   */
  private applyStaticTokens(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const root = this.document.documentElement;
    for (const [token, value] of Object.entries(radiusTokens)) {
      root.style.setProperty(`--lsd-radius-${token}`, value);
    }
    for (const [token, value] of Object.entries(elevationTokens)) {
      root.style.setProperty(`--lsd-elevation-${token}`, value);
    }
  }

  setAppearance(appearance: Appearance): void {
    this.selectedAppearance.set(appearance);
  }

  toggleAppearance(): void {
    this.selectedAppearance.update((current) => (current === 'light' ? 'dark' : 'light'));
  }

  /** Resolves an accent option to a paintable hex value for the current appearance, e.g. for swatch previews. Keeps tokens/internal/'s raw-value table encapsulated here rather than importing it into pattern/recipe components. */
  previewColorFor(accentColor: AccentColor): string {
    return accentPrimaryThemes[accentColor][this.selectedAppearance()];
  }

  setAccentColor(accentColor: AccentColor): void {
    this.selectedAccentColor.set(accentColor);
  }

  setDirection(direction: Direction): void {
    this.selectedDirection.set(direction);
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

  private readAccentColorPreference(): AccentColor {
    if (!isPlatformBrowser(this.platformId)) {
      return DEFAULT_ACCENT_COLOR;
    }

    try {
      const stored = localStorage.getItem(ACCENT_COLOR_STORAGE_KEY);
      return (accentColorNames as readonly string[]).includes(stored ?? '')
        ? (stored as AccentColor)
        : DEFAULT_ACCENT_COLOR;
    } catch {
      return DEFAULT_ACCENT_COLOR;
    }
  }

  private readDirectionPreference(): Direction {
    if (!isPlatformBrowser(this.platformId)) {
      return 'ltr';
    }

    try {
      const stored = localStorage.getItem(DIRECTION_STORAGE_KEY);
      return stored === 'rtl' || stored === 'ltr' ? stored : 'ltr';
    } catch {
      return 'ltr';
    }
  }

  /**
   * Applies both appearance and accent color together: the base semantic
   * theme is appearance-only, then accent-primary (and the focus ring
   * derived from it) is overridden per the selected accent color. Combining
   * both signals into one effect keeps application order deterministic —
   * two separate effects reacting to shared state would not guarantee the
   * accent override runs after the base theme on every appearance change.
   */
  private applyAppearance(appearance: Appearance, accentColor: AccentColor): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const root = this.document.documentElement;
    const colors = semanticColorThemes[appearance];
    const accentPrimary = accentPrimaryThemes[accentColor][appearance];

    root.dataset['appearance'] = appearance;
    root.style.colorScheme = appearance;
    for (const token of semanticColorTokenNames) {
      root.style.setProperty(`--lsd-color-${token}`, token === 'accent-primary' ? accentPrimary : colors[token]);
    }
    root.style.setProperty('--lsd-color-focus-ring', accentPrimary);

    try {
      localStorage.setItem(APPEARANCE_STORAGE_KEY, appearance);
      localStorage.setItem(ACCENT_COLOR_STORAGE_KEY, accentColor);
    } catch {
      // Storage may be unavailable; the in-memory appearance remains deterministic.
    }
  }

  private applyDirection(direction: Direction): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.document.documentElement.setAttribute('dir', direction);

    try {
      localStorage.setItem(DIRECTION_STORAGE_KEY, direction);
    } catch {
      // Storage may be unavailable; the in-memory direction remains deterministic.
    }
  }
}
