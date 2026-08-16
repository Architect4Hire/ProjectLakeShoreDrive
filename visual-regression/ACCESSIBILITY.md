# Automated accessibility checks

Traceability: DS-008, TEST-007.

Run `npm run test:accessibility`. The suite scans representative component, recipe, error, dialog, and drawer states with axe's WCAG 2 A/AA, WCAG 2.1 AA, and WCAG 2.2 AA tags in light and dark appearances. Critical and serious violations fail with the complete axe rule summary. No rules, nodes, or impacts are excluded.

Behavioral assertions separately cover keyboard focus visibility, accessible control names, native modal roles, dialog/drawer labels and descriptions, initial focus, error association, assertive live regions, and reduced-motion media. Tool-supported color contrast is included in the axe ruleset.

Automation supplements manual verification. Before release, keyboard-review every interactive state and focus-return path; inspect reading order and announcements with a screen reader; verify reflow and zoom to 400%; and evaluate meaning, error recovery, and motion that automated rules cannot judge.
