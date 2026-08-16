# Angular Tailwind migration snapshot

This directory is a private, read-only comparison snapshot for transforming
approved candidates from the Angular Tailwind starter into the Lake Shore
Drive design system. It is documentation material, not a public design-system
entry point and not application source.

## Provenance

- Repository: https://github.com/lannodev/angular-tailwind
- Revision: `5b8af483628e60df7e5e3f6ad4d17e08a9a482fb`
- Upstream package version: `0.11.0`
- License: MIT; see `docs/design/third-party-notices.md`
- Snapshot created: 2026-08-16

Files below `source/` retain their upstream-relative paths. Their contents
have not been redesigned. Line endings may be normalized by repository tools.

## Migration boundary

Only candidates approved by the transformation plan were copied: theme and
style foundations, button, click-outside behavior, layout mechanics, table
composition, and related E2E references. Empty CSS placeholders and
`.gitkeep` files were omitted because they contain no reusable source.

Icons, illustrations, images, fonts, branding, NFT/dashboard code, auth demo
pages, and other starter business assumptions were not copied. Third-party
media remains blocked pending independent provenance and license review.

Do not import from this snapshot. Transformation work must copy an approved
candidate into its DS-003 layer, record the source and destination in the
inventory, and expose only reviewed APIs through the design-system public
entry point.

