# Design System Third-Party Notices

This document records third-party source incorporated into or adapted for the
Project Lake Shore Drive design system. It does not transfer ownership of
Project Lake Shore Drive code to the upstream project. New Lake Shore Drive
code and original transformations remain subject to this repository's own
licensing and ownership terms.

## Angular Tailwind starter

- Source: https://github.com/lannodev/angular-tailwind
- Inspected revision: `5b8af483628e60df7e5e3f6ad4d17e08a9a482fb`
- Upstream package version: `0.11.0`
- License: MIT License
- Upstream copyright: Copyright (c) 2024 Luciano Oliveira

The following upstream files have been copied into the private comparison
snapshot at
`src/web/design-system/documentation/migration/angular-tailwind/source/`. If
any substantial portion is incorporated or distributed, this notice and the
unmodified MIT text below must be retained:

- `src/styles.css`
- `src/app/core/models/theme.model.ts`
- `src/app/core/services/theme.service.ts`
- `src/app/shared/components/button/`
- `src/app/shared/directives/click-outside.directive.ts`
- `src/app/modules/layout/`
- `src/app/modules/uikit/pages/table/`
- `tests-e2e/navbar.e2e.spec.ts`
- `tests-e2e/sidebar.e2e.spec.ts`
- `tests-e2e/table.e2e.spec.ts`

The snapshot preserves each upstream-relative path below that directory. This
list identifies provenance, not an instruction to preserve or adopt the
source. The transformation inventory must record actual design-system
destinations when source is adapted. Purely original implementations informed
only by general ideas should not be represented as copied source.

### Upstream MIT License

MIT License

Copyright (c) 2024 Luciano Oliveira

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Asset provenance boundary

The starter README separately attributes icons, patterns, or illustrations to
Heroicons, Hero Patterns, and Popsy. The repository also contains files under
`src/assets/icons/tablericons/`. The starter's root MIT license is not, by
itself, sufficient evidence that every externally sourced asset may be
redistributed solely under that license.

Do not copy those assets into the Lake Shore Drive design system until their
original source, version, license, and required notice have been verified and
recorded here. Starter branding, preview media, stock imagery, avatars, and
demo illustrations are not approved design-system assets.
