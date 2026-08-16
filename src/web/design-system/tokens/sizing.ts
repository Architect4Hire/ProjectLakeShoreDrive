export const controlSizes = {
  compact: '2rem',
  default: '2.5rem',
  /** Minimum target on narrow or touch-first layouts (44 CSS px at 16px root). */
  touch: '2.75rem',
  spacious: '3rem',
} as const;

export const rowSizes = {
  dense: '2.25rem',
  default: '2.75rem',
  comfortable: '3rem',
} as const;

export const contentGutters = {
  narrow: '1rem',
  tablet: '1.5rem',
  desktop: '2rem',
  wide: '2.5rem',
} as const;

export const panelSizes = {
  'inline-compact': '10rem',
  'inline-default': '12rem',
  'inline-wide': '18rem',
  'navigation-collapsed': '4.5rem',
  'navigation-default': '13rem',
  'navigation-wide': '17.5rem',
  'content-reading': '48rem',
  'content-workbench': '90rem',
  'drawer-compact': '20rem',
  'drawer-default': '30rem',
  'drawer-wide': '42rem',
} as const;

export const responsiveBreakpoints = {
  compact: '30rem',
  tablet: '48rem',
  desktop: '64rem',
  wide: '80rem',
} as const;

export type ControlSize = keyof typeof controlSizes;
export type RowSize = keyof typeof rowSizes;
export type ContentGutter = keyof typeof contentGutters;
export type PanelSize = keyof typeof panelSizes;
export type ResponsiveBreakpoint = keyof typeof responsiveBreakpoints;
