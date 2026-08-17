import type { AccentColor } from '../semantic-colors';
import type { Appearance } from '../semantic-colors';
import { primitiveColors } from './primitive-colors';

/**
 * Private palette resolution for the accent-color axis. Only accent-primary
 * varies by accent color; every other semantic token (including
 * text-on-accent) stays shared across accents. All seven pairs were
 * contrast-checked at these exact steps against text-on-accent
 * (neutral-50 light / neutral-950 dark) and clear WCAG AA 4.5:1 for both:
 * light-mode step 700 ranges 4.79-6.79:1, dark-mode step 400 ranges
 * 7.02-11.63:1. 'yellow' intentionally maps to the amber ramp, matching
 * the reference template's #f59e0b (== amber-500) accent option.
 */
export const accentPrimaryThemes = {
  rose: { light: primitiveColors.rose[700], dark: primitiveColors.rose[400] },
  yellow: { light: primitiveColors.amber[700], dark: primitiveColors.amber[400] },
  green: { light: primitiveColors.green[700], dark: primitiveColors.green[400] },
  blue: { light: primitiveColors.blue[700], dark: primitiveColors.blue[400] },
  orange: { light: primitiveColors.orange[700], dark: primitiveColors.orange[400] },
  red: { light: primitiveColors.red[700], dark: primitiveColors.red[400] },
  violet: { light: primitiveColors.violet[700], dark: primitiveColors.violet[400] },
} as const satisfies Record<AccentColor, Record<Appearance, `#${string}`>>;
