export const semanticColorTokenNames = [
  'surface-page',
  'surface-panel',
  'surface-raised',
  'text-primary',
  'text-muted',
  'text-on-accent',
  'text-on-success',
  'text-on-warning',
  'text-on-danger',
  'text-on-info',
  'border-default',
  'status-success',
  'status-warning',
  'status-danger',
  'status-info',
  'accent-primary',
  'ai-draft-surface',
  'ai-draft-text',
  'ai-draft-border',
  'ai-draft-accent',
  'ai-approved-surface',
  'ai-approved-text',
  'ai-approved-border',
  'ai-approved-accent',
] as const;

export type SemanticColorToken = (typeof semanticColorTokenNames)[number];
export type Appearance = 'light' | 'dark';
export type SemanticColorTheme = Readonly<Record<SemanticColorToken, `#${string}`>>;
