import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

/**
 * tokens/motion.ts and tokens/typography.ts are hand-duplicated (not generated)
 * into foundations/motion.css and foundations/typography.css because Tailwind's
 * @theme block only wires color tokens today. This script fails the moment the
 * two copies disagree, so drift is caught instead of silently shipping.
 */

function extractTsObject(source, exportName) {
  const match = source.match(new RegExp(`export const ${exportName} = \\{([\\s\\S]*?)\\n\\} as const`));
  if (!match) throw new Error(`Could not find "export const ${exportName}" in tokens source.`);
  const entries = new Map();
  const entryPattern = /(?:'([^']+)'|([A-Za-z][\w-]*)):\s*(?:'([^']*)'|"([^"]*)")/g;
  for (const entryMatch of match[1].matchAll(entryPattern)) {
    const key = entryMatch[1] ?? entryMatch[2];
    const value = entryMatch[3] ?? entryMatch[4];
    entries.set(key, value);
  }
  return entries;
}

function extractCssRootBlock(source) {
  const rootStart = source.indexOf(':root');
  if (rootStart === -1) throw new Error('Could not find a :root block in foundations CSS.');
  const braceStart = source.indexOf('{', rootStart);
  const braceEnd = source.indexOf('\n}', braceStart);
  return source.slice(braceStart + 1, braceEnd === -1 ? undefined : braceEnd);
}

function extractCssCustomProperties(cssBlock, prefix) {
  const entries = new Map();
  const declPattern = new RegExp(`--${prefix}-([\\w-]+):\\s*([^;]+);`, 'g');
  for (const match of cssBlock.matchAll(declPattern)) {
    entries.set(match[1], match[2].trim());
  }
  return entries;
}

function compare(label, tsEntries, cssEntries, failures) {
  for (const [key, tsValue] of tsEntries) {
    if (!cssEntries.has(key)) {
      failures.push(`${label}: token "${key}" (${tsValue}) has no matching CSS custom property.`);
      continue;
    }
    const cssValue = cssEntries.get(key);
    if (cssValue !== tsValue) {
      failures.push(`${label}: token "${key}" is "${tsValue}" in tokens/ but "${cssValue}" in foundations/ CSS.`);
    }
  }
  for (const key of cssEntries.keys()) {
    if (!tsEntries.has(key)) {
      failures.push(`${label}: CSS custom property "${key}" has no matching token in tokens/.`);
    }
  }
}

export function checkFoundationTokenSync(root = process.cwd()) {
  const failures = [];

  const motionTs = fs.readFileSync(path.join(root, 'src/web/design-system/tokens/motion.ts'), 'utf8');
  const motionCss = fs.readFileSync(path.join(root, 'src/web/design-system/foundations/motion.css'), 'utf8');
  const motionCssRoot = extractCssRootBlock(motionCss);
  compare(
    'motion durations',
    extractTsObject(motionTs, 'motionDurations'),
    extractCssCustomProperties(motionCssRoot, 'motion-duration'),
    failures,
  );
  compare(
    'motion easings',
    extractTsObject(motionTs, 'motionEasings'),
    extractCssCustomProperties(motionCssRoot, 'motion-easing'),
    failures,
  );

  const typographyTs = fs.readFileSync(path.join(root, 'src/web/design-system/tokens/typography.ts'), 'utf8');
  const typographyCss = fs.readFileSync(path.join(root, 'src/web/design-system/foundations/typography.css'), 'utf8');
  const typographyCssRoot = extractCssRootBlock(typographyCss);
  compare(
    'font families',
    extractTsObject(typographyTs, 'fontFamilies'),
    extractCssCustomProperties(typographyCssRoot, 'font-family'),
    failures,
  );
  compare(
    'font sizes',
    extractTsObject(typographyTs, 'fontSizes'),
    extractCssCustomProperties(typographyCssRoot, 'font-size'),
    failures,
  );
  compare(
    'line heights',
    extractTsObject(typographyTs, 'lineHeights'),
    extractCssCustomProperties(typographyCssRoot, 'line-height'),
    failures,
  );
  compare(
    'letter spacings',
    extractTsObject(typographyTs, 'letterSpacings'),
    extractCssCustomProperties(typographyCssRoot, 'letter-spacing'),
    failures,
  );
  // fontWeights values are unquoted numbers in TS (400, 500, ...), handled separately from the quoted-string extractor.
  const fontWeightsMatch = typographyTs.match(/export const fontWeights = \{([\s\S]*?)\n\} as const/);
  if (!fontWeightsMatch) failures.push('font weights: could not find "export const fontWeights" in tokens/typography.ts.');
  else {
    const tsWeights = new Map();
    for (const entryMatch of fontWeightsMatch[1].matchAll(/([A-Za-z][\w-]*):\s*(\d+)/g)) {
      tsWeights.set(entryMatch[1], entryMatch[2]);
    }
    compare('font weights', tsWeights, extractCssCustomProperties(typographyCssRoot, 'font-weight'), failures);
  }

  return failures;
}

function runSelfTest() {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'lsd-foundation-sync-'));
  try {
    const tokensDir = path.join(fixtureRoot, 'src/web/design-system/tokens');
    const foundationsDir = path.join(fixtureRoot, 'src/web/design-system/foundations');
    fs.mkdirSync(tokensDir, { recursive: true });
    fs.mkdirSync(foundationsDir, { recursive: true });

    fs.writeFileSync(
      path.join(tokensDir, 'motion.ts'),
      "export const motionDurations = {\n  fast: '100ms',\n} as const;\n\nexport const motionEasings = {\n  linear: 'linear',\n} as const;\n",
    );
    fs.writeFileSync(
      path.join(foundationsDir, 'motion.css'),
      ':root {\n  --motion-duration-fast: 150ms;\n  --motion-easing-linear: linear;\n}\n',
    );
    fs.writeFileSync(
      path.join(tokensDir, 'typography.ts'),
      "export const fontFamilies = {\n  interface: 'Poppins',\n} as const;\n\nexport const fontSizes = {\n  md: '1rem',\n} as const;\n\nexport const lineHeights = {\n  md: '1.5rem',\n} as const;\n\nexport const fontWeights = {\n  regular: 400,\n} as const;\n\nexport const letterSpacings = {\n  normal: '0em',\n} as const;\n",
    );
    fs.writeFileSync(
      path.join(foundationsDir, 'typography.css'),
      ':root {\n  --font-family-interface: Poppins;\n  --font-size-md: 1rem;\n  --line-height-md: 1.5rem;\n  --font-weight-regular: 400;\n  --letter-spacing-normal: 0em;\n}\n',
    );
    const failures = checkFoundationTokenSync(fixtureRoot);
    const mismatch = failures.some((message) => message.includes('motion durations') && message.includes('fast'));
    if (!mismatch || failures.length !== 1) {
      throw new Error(`Expected exactly 1 deliberate motion-duration mismatch; received ${failures.length}: ${JSON.stringify(failures)}`);
    }
    console.log('Self-test passed: synthetic tokens/foundations drift was detected.');
  } finally {
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--self-test')) {
    runSelfTest();
  } else {
    const failures = checkFoundationTokenSync();
    if (failures.length) {
      console.error(`Foundation token sync check failed (${failures.length}):`);
      for (const failure of failures) console.error(`- ${failure}`);
      process.exitCode = 1;
    } else {
      console.log('Foundation token sync check passed: motion and typography CSS match their token sources.');
    }
  }
}
