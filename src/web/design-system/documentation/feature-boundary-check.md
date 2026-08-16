# Feature boundary static check

Traceability: DS-004, DS-005, BR-144.

Run from the repository root:

```text
node src/web/design-system/testing/check-feature-boundaries.mjs
```

The zero-dependency check scans `src/web/features` and `src/web/app` when they
exist. Explicit roots may be passed as positional arguments. It excludes every
`design-system` directory from feature scanning.

Rules:

- `design-system-public-import` rejects imports containing a private
  `design-system/` path. `src/web/design-system/public-api` and the future
  `@lsd/design-system` alias are allowed.
- `repeated-tailwind-bundle` reports an exact normalized class bundle only when
  it contains at least eight utility-like tokens and occurs at least twice.
  One-off layout utilities and unique long compositions are not reported.

Exit status is non-zero when violations exist, making the check suitable for
CI. Frontend implementation prompts should cite the same rules: reuse the
public design-system APIs and do not recreate repeated feature-local styles.

When ESLint becomes available, retain this script as a dependency-free CI
guard or migrate the import rule to `no-restricted-imports` and the repeated
bundle rule to a focused Angular-template custom rule. Preserve the thresholds
and public-entry exceptions to avoid broad utility-class policing.

The built-in synthetic verification creates temporary feature files, checks a
private import and a repeated nine-utility bundle, then removes the fixture:

```text
node src/web/design-system/testing/check-feature-boundaries.mjs --self-test
```

