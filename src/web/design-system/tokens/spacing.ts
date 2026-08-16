/** Raw spacing increments. Consume semantic roles in feature and component code. */
export const spacingScale = {
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
} as const;

export const spacingTokens = {
  'inline-tight': spacingScale[1],
  'inline-related': spacingScale[2],
  'inline-default': spacingScale[3],
  'inline-separated': spacingScale[4],
  'stack-tight': spacingScale[1],
  'stack-related': spacingScale[2],
  'stack-default': spacingScale[4],
  'stack-section': spacingScale[6],
  'control-inset-block-compact': spacingScale[1],
  'control-inset-block-default': spacingScale[2],
  'control-inset-inline-compact': spacingScale[3],
  'control-inset-inline-default': spacingScale[5],
  'panel-inset-compact': spacingScale[3],
  'panel-inset-default': spacingScale[4],
  'panel-inset-comfortable': spacingScale[6],
} as const;

export type SpacingToken = keyof typeof spacingTokens;

