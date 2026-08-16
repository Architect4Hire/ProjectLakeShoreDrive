export const motionDurations = {
  none: '0ms',
  fast: '100ms',
  default: '200ms',
  slow: '300ms',
  deliberate: '500ms',
} as const;

export const motionEasings = {
  linear: 'linear',
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  enter: 'cubic-bezier(0, 0, 0, 1)',
  exit: 'cubic-bezier(0.3, 0, 1, 1)',
} as const;

export const motionTokens = {
  'duration-state-change': motionDurations.fast,
  'duration-transition': motionDurations.default,
  'duration-overlay': motionDurations.slow,
  'duration-deliberate': motionDurations.deliberate,
  'easing-standard': motionEasings.standard,
  'easing-enter': motionEasings.enter,
  'easing-exit': motionEasings.exit,
} as const;

export type MotionDuration = keyof typeof motionDurations;
export type MotionEasing = keyof typeof motionEasings;
export type MotionToken = keyof typeof motionTokens;

