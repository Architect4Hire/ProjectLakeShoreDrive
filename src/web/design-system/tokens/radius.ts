export const radiusScale = {
  none: '0',
  xs: '0.125rem',
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  full: '9999px',
} as const;

export const radiusTokens = {
  control: radiusScale.md,
  panel: radiusScale.lg,
  'panel-prominent': radiusScale.xl,
  overlay: radiusScale.lg,
  pill: radiusScale.full,
} as const;

export type RadiusToken = keyof typeof radiusTokens;

