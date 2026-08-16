export const borderWidths = {
  none: '0',
  hairline: '0.0625rem',
  strong: '0.125rem',
} as const;

export const borderStyles = {
  none: 'none',
  solid: 'solid',
  dashed: 'dashed',
} as const;

export const borderTokens = {
  default: `${borderWidths.hairline} ${borderStyles.solid}`,
  strong: `${borderWidths.strong} ${borderStyles.solid}`,
  separator: `${borderWidths.hairline} ${borderStyles.solid}`,
  'drop-target': `${borderWidths.strong} ${borderStyles.dashed}`,
} as const;

export type BorderToken = keyof typeof borderTokens;

