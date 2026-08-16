export const fontFamilies = {
  interface: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  document: "Charter, 'Bitstream Charter', 'Sitka Text', Cambria, serif",
  code: "'Cascadia Code', 'SFMono-Regular', Consolas, 'Liberation Mono', monospace",
} as const;

export const fontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
} as const satisfies Record<string, `${number}rem`>;

export const lineHeights = {
  xs: '1rem',
  sm: '1.25rem',
  md: '1.5rem',
  lg: '1.75rem',
  xl: '1.875rem',
  '2xl': '2rem',
  '3xl': '2.25rem',
  prose: '1.75rem',
} as const satisfies Record<string, `${number}rem`>;

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const letterSpacings = {
  tight: '-0.02em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
} as const satisfies Record<string, `${number}em`>;

export interface TypographyRole {
  readonly family: (typeof fontFamilies)[keyof typeof fontFamilies];
  readonly size: (typeof fontSizes)[keyof typeof fontSizes];
  readonly lineHeight: (typeof lineHeights)[keyof typeof lineHeights];
  readonly weight: (typeof fontWeights)[keyof typeof fontWeights];
  readonly letterSpacing: (typeof letterSpacings)[keyof typeof letterSpacings];
}

export const typographyRoles = {
  'heading-page': {
    family: fontFamilies.interface,
    size: fontSizes['3xl'],
    lineHeight: lineHeights['3xl'],
    weight: fontWeights.bold,
    letterSpacing: letterSpacings.tight,
  },
  'heading-section': {
    family: fontFamilies.interface,
    size: fontSizes['2xl'],
    lineHeight: lineHeights['2xl'],
    weight: fontWeights.semibold,
    letterSpacing: letterSpacings.tight,
  },
  'heading-subsection': {
    family: fontFamilies.interface,
    size: fontSizes.xl,
    lineHeight: lineHeights.xl,
    weight: fontWeights.semibold,
    letterSpacing: letterSpacings.normal,
  },
  body: {
    family: fontFamilies.interface,
    size: fontSizes.md,
    lineHeight: lineHeights.md,
    weight: fontWeights.regular,
    letterSpacing: letterSpacings.normal,
  },
  label: {
    family: fontFamilies.interface,
    size: fontSizes.sm,
    lineHeight: lineHeights.sm,
    weight: fontWeights.medium,
    letterSpacing: letterSpacings.normal,
  },
  metadata: {
    family: fontFamilies.interface,
    size: fontSizes.xs,
    lineHeight: lineHeights.xs,
    weight: fontWeights.regular,
    letterSpacing: letterSpacings.wide,
  },
  code: {
    family: fontFamilies.code,
    size: fontSizes.sm,
    lineHeight: lineHeights.sm,
    weight: fontWeights.regular,
    letterSpacing: letterSpacings.normal,
  },
  'document-prose': {
    family: fontFamilies.document,
    size: fontSizes.md,
    lineHeight: lineHeights.prose,
    weight: fontWeights.regular,
    letterSpacing: letterSpacings.normal,
  },
} as const satisfies Record<string, TypographyRole>;

export type TypographyRoleName = keyof typeof typographyRoles;

