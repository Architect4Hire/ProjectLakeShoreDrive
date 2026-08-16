/** Private rendering data. Features consume IconName and IconComponent only. */
export const iconPaths = {
  check: 'M5 12.5 9.25 17 19 7',
  'chevron-down': 'm6 9 6 6 6-6',
  'chevron-left': 'm15 6-6 6 6 6',
  'chevron-right': 'm9 6 6 6-6 6',
  'chevron-up': 'm6 15 6-6 6 6',
  close: 'M6 6l12 12M18 6 6 18',
  error: 'M12 8v5m0 3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  info: 'M12 11v5m0-8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  menu: 'M4 7h16M4 12h16M4 17h16',
  minus: 'M5 12h14',
  'more-vertical': 'M12 7h.01M12 12h.01M12 17h.01',
  plus: 'M12 5v14M5 12h14',
  search: 'm20 20-4.5-4.5m2.5-4A7 7 0 1 1 4 11a7 7 0 0 1 14 0Z',
  warning: 'M12 9v4m0 3h.01M10.3 4.9 2.1 18a2 2 0 0 0 1.8 1h16.2a2 2 0 0 0 1.8-1L13.7 4.9a2 2 0 0 0-3.4 0Z',
} as const;

export type IconName = keyof typeof iconPaths;
