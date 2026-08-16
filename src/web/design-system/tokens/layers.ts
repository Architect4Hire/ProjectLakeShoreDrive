/**
 * Global stacking contexts. Components must not invent values between layers.
 * Drawer and dialog hosts share `overlay`; their internal parts use localOverlayLayers.
 */
export const globalLayers = {
  base: 0,
  raised: 10,
  sticky: 100,
  popover: 200,
  overlay: 300,
  tooltip: 400,
  notification: 500,
} as const;

/** Values inside an isolated overlay host stacking context. */
export const localOverlayLayers = {
  backdrop: 0,
  content: 1,
} as const;

export type GlobalLayer = keyof typeof globalLayers;
export type LocalOverlayLayer = keyof typeof localOverlayLayers;

