/** Raw shadows. Prefer elevationTokens outside the token layer. Tint is brand-violet (82 63 105), not neutral slate. */
export const shadowScale = {
  none: 'none',
  xs: '0 1px 2px rgb(82 63 105 / 0.08)',
  sm: '0 1px 3px rgb(82 63 105 / 0.12), 0 1px 2px rgb(82 63 105 / 0.08)',
  md: '0 4px 8px -2px rgb(82 63 105 / 0.14), 0 2px 4px -2px rgb(82 63 105 / 0.08)',
  lg: '0 12px 20px -6px rgb(82 63 105 / 0.18), 0 4px 8px -4px rgb(82 63 105 / 0.10)',
  xl: '0 20px 32px -8px rgb(82 63 105 / 0.22), 0 8px 12px -6px rgb(82 63 105 / 0.12)',
} as const;

export const elevationTokens = {
  flat: shadowScale.none,
  raised: shadowScale.xs,
  sticky: shadowScale.sm,
  popover: shadowScale.md,
  overlay: shadowScale.lg,
  'overlay-prominent': shadowScale.xl,
} as const;

export type ElevationToken = keyof typeof elevationTokens;

