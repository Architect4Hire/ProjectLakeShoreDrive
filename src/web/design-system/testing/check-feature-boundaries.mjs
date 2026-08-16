import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const extensions = new Set(['.html', '.ts']);
const defaultRoots = ['src/web/features', 'src/web/app'];
const minimumBundleLength = 8;
const commonUtilities = new Set([
  'absolute', 'block', 'border', 'contents', 'fixed', 'flex', 'grid', 'hidden',
  'inline', 'relative', 'sticky', 'table',
]);

function walk(root) {
  if (!fs.existsSync(root)) return [];
  const entries = fs.readdirSync(root, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const target = path.join(root, entry.name);
    if (target.split(path.sep).includes('design-system')) return [];
    return entry.isDirectory() ? walk(target) : extensions.has(path.extname(target)) ? [target] : [];
  });
}

function lineAt(source, offset) {
  return source.slice(0, offset).split(/\r?\n/).length;
}

function isUtility(token) {
  return commonUtilities.has(token) || /[-:[\]/]/.test(token);
}

function normalizedBundles(source) {
  const bundles = [];
  const quoted = /(["'`])([^\r\n]*?)\1/g;
  for (const match of source.matchAll(quoted)) {
    const tokens = match[2].trim().split(/\s+/).filter(Boolean);
    if (tokens.length < minimumBundleLength || !tokens.every(isUtility)) continue;
    bundles.push({ bundle: tokens.join(' '), offset: match.index ?? 0 });
  }
  return bundles;
}

function isPrivateDesignSystemImport(specifier) {
  const normalized = specifier.replaceAll('\\', '/').replace(/\.(?:ts|js)$/, '');
  if (normalized === '@lsd/design-system' || normalized.endsWith('/design-system/public-api')) return false;
  return normalized.includes('/design-system/') || normalized.startsWith('design-system/');
}

export function checkFeatureBoundaries(roots) {
  const files = roots.flatMap((root) => walk(path.resolve(root)));
  const violations = [];
  const occurrences = new Map();

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    const imports = /(?:from\s*|import\s*\(\s*|require\(\s*)["']([^"']+)["']/g;
    for (const match of source.matchAll(imports)) {
      if (isPrivateDesignSystemImport(match[1])) {
        violations.push({
          file,
          line: lineAt(source, match.index ?? 0),
          rule: 'design-system-public-import',
          message: `Import from the public entry point instead of "${match[1]}".`,
        });
      }
    }

    for (const item of normalizedBundles(source)) {
      const locations = occurrences.get(item.bundle) ?? [];
      locations.push({ file, line: lineAt(source, item.offset) });
      occurrences.set(item.bundle, locations);
    }
  }

  for (const [bundle, locations] of occurrences) {
    if (locations.length < 2) continue;
    for (const location of locations) {
      violations.push({
        ...location,
        rule: 'repeated-tailwind-bundle',
        message: `Repeated ${bundle.split(' ').length}-utility bundle; promote the shared pattern to the design system.`,
      });
    }
  }

  return violations;
}

function runSelfTest() {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'lsd-boundary-check-'));
  try {
    const bundle = 'flex items-center justify-between gap-4 rounded-lg border border-border-default bg-surface-panel';
    fs.writeFileSync(path.join(fixtureRoot, 'one.html'), `<div class="${bundle}"></div>\n`);
    fs.writeFileSync(path.join(fixtureRoot, 'two.html'), `<section class="${bundle}"></section>\n`);
    fs.writeFileSync(
      path.join(fixtureRoot, 'one-off.html'),
      '<main class="grid min-h-dvh grid-cols-1 gap-6 overflow-hidden rounded-lg bg-surface-page"></main>\n',
    );
    fs.writeFileSync(
      path.join(fixtureRoot, 'private.ts'),
      "import { ButtonComponent } from 'src/web/design-system/primitives/button/button.component';\n",
    );
    const violations = checkFeatureBoundaries([fixtureRoot]);
    const importCount = violations.filter((item) => item.rule === 'design-system-public-import').length;
    const bundleCount = violations.filter((item) => item.rule === 'repeated-tailwind-bundle').length;
    if (importCount !== 1 || bundleCount !== 2) {
      throw new Error(`Expected 1 private import and 2 repeated-bundle locations; received ${importCount} and ${bundleCount}.`);
    }
    console.log('Self-test passed: synthetic private import and repeated Tailwind bundle were detected.');
  } finally {
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.includes('--self-test')) {
    runSelfTest();
  } else {
    const roots = args.length ? args : defaultRoots;
    const violations = checkFeatureBoundaries(roots);
    for (const violation of violations) {
      console.error(`${path.relative(process.cwd(), violation.file)}:${violation.line} [${violation.rule}] ${violation.message}`);
    }
    if (violations.length) process.exitCode = 1;
    else console.log(`Feature boundary check passed (${roots.join(', ')}).`);
  }
}
