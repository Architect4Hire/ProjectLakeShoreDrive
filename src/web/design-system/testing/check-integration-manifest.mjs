import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const root = process.cwd();
const manifestPath = 'src/web/design-system/integration-manifest.json';
const manifest = JSON.parse(readFileSync(join(root, manifestPath), 'utf8'));
const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const angularJson = JSON.parse(readFileSync(join(root, 'angular.json'), 'utf8'));
const publicApi = readFileSync(join(root, 'src/web/design-system/public-api.ts'), 'utf8');
const tailwind = readFileSync(join(root, manifest.globalStyles.entry), 'utf8');
const failures = [];

const requireValue = (condition, message) => {
  if (!condition) failures.push(message);
};
const exists = (path) => existsSync(join(root, path));
const hasHiddenSegment = (path) => path.split('/').some((part) => part.startsWith('.') && part !== '..');

requireValue(manifest.schemaVersion === 1, 'schemaVersion must be 1');
requireValue(manifest.targetRoot === 'src/web/design-system', 'targetRoot must be src/web/design-system');

const requiredCopyFiles = [
  manifestPath,
  'src/web/design-system/integration-manifest.schema.json',
  'src/web/design-system/public-api.ts'
];
for (const path of requiredCopyFiles) {
  requireValue(manifest.copy.files.includes(path), `copy.files omits ${path}`);
}

const productionLayers = ['tokens', 'foundations', 'primitives', 'components', 'patterns', 'recipes', 'layouts', 'icons', 'utilities', 'documentation'];
for (const layer of productionLayers) {
  const path = `${manifest.targetRoot}/${layer}`;
  requireValue(manifest.copy.directories.includes(path), `copy.directories omits ${path}`);
}

const allCopyPaths = [...manifest.copy.files, ...manifest.copy.directories, ...manifest.copy.legalFiles];
for (const path of allCopyPaths) {
  requireValue(!hasHiddenSegment(path), `copy payload depends on hidden path ${path}`);
  requireValue(exists(path), `copy payload path does not exist: ${path}`);
}
requireValue(manifest.copy.exclude.includes('src/web/design-system/documentation/migration'), 'private migration snapshot must be excluded');

for (const group of ['runtimePeers', 'buildDev', 'testDev']) {
  for (const [name, version] of Object.entries(manifest.dependencies[group])) {
    const installed = packageJson.dependencies?.[name] ?? packageJson.devDependencies?.[name];
    requireValue(installed === version, `${group} dependency ${name} must match package.json (${version})`);
  }
}
for (const name of manifest.dependencies.notRequired) {
  requireValue(!packageJson.dependencies?.[name] && !packageJson.devDependencies?.[name], `${name} is marked not required but is installed`);
}

const projects = Object.values(angularJson.projects ?? {});
const styleLists = projects.map((project) => project.architect?.build?.options?.styles).filter(Array.isArray);
requireValue(styleLists.some((styles) => styles[0] === manifest.globalStyles.entry), 'global design-system CSS must be first in an Angular styles array');
for (const foundation of manifest.globalStyles.includedFoundations) {
  requireValue(tailwind.includes(`@import './${foundation}'`), `tailwind.css does not import ${foundation}`);
}
for (const layer of ['components', 'icons', 'layouts', 'patterns', 'primitives', 'recipes', 'utilities']) {
  requireValue(tailwind.includes(`@source '../${layer}'`), `tailwind.css does not scan ${layer}`);
}

for (const file of manifest.configuration.createFiles) {
  requireValue(!hasHiddenSegment(file.path), `generated configuration must be visible: ${file.path}`);
  requireValue(typeof file.content === 'string' && file.content.length > 0, `generated configuration has no content: ${file.path}`);
}
requireValue(manifest.configuration.createFiles.some((file) => file.path === 'postcss.config.mjs' && file.content.includes("'@tailwindcss/postcss'")), 'visible PostCSS configuration is incomplete');

for (const layer of manifest.publicApi.layers) {
  requireValue(publicApi.includes(`export * from './${layer}'`), `public-api.ts does not export ${layer}`);
}
requireValue(manifest.publicApi.forbidDeepImports === true, 'deep imports must be forbidden');

for (const path of manifest.assets.required) requireValue(exists(path), `required asset does not exist: ${path}`);
for (const path of [...manifest.testSupport.copyDirectories, ...manifest.testSupport.copyFiles, ...manifest.testSupport.boundaryScripts]) {
  requireValue(exists(path), `test support path does not exist: ${path}`);
}
for (const path of manifest.testSupport.exclude) {
  requireValue(!hasHiddenSegment(path), `test exclusion must not depend on a hidden path: ${path}`);
}
for (const required of ['visual-regression/results', 'visual-regression/test-results', 'visual-regression/playwright-report']) {
  requireValue(manifest.testSupport.exclude.includes(required), `test support exclusions omit transient path ${required}`);
}
requireValue(manifest.testSupport.boundaryScripts.includes('src/web/design-system/testing/check-integration-manifest.mjs'), 'manifest validator must be copied with test support');
for (const [name, command] of Object.entries(manifest.testSupport.scripts)) {
  requireValue(packageJson.scripts?.[name] === command, `package script ${name} is absent or differs from manifest`);
}

const baselineRoot = join(root, 'visual-regression/baselines/design-system.visual.spec.ts-snapshots');
const baselines = existsSync(baselineRoot) ? readdirSync(baselineRoot).filter((name) => name.endsWith('.png')) : [];
requireValue(baselines.length > 0, 'no approved visual baselines found');

const requiredCommands = ['npm ci', 'npm run build', 'npm run lint', 'npm test', 'node src/web/design-system/testing/check-integration-manifest.mjs'];
for (const command of requiredCommands) requireValue(manifest.verification.includes(command), `verification omits ${command}`);

const allowedRoots = new Set([...manifest.copy.files, ...manifest.copy.directories]);
const ignored = (path) => manifest.copy.exclude.some((pattern) => {
  if (pattern.endsWith('/**/*.spec.ts')) return path.endsWith('.spec.ts');
  if (pattern.endsWith('/**/*.visual.spec.ts')) return path.endsWith('.visual.spec.ts');
  return path === pattern || path.startsWith(`${pattern}/`);
});
const walk = (directory) => readdirSync(join(root, directory), { withFileTypes: true }).flatMap((entry) => {
  const path = join(directory, entry.name).split(sep).join('/');
  if (ignored(path) || path.startsWith('src/web/design-system/testing/')) return [];
  return entry.isDirectory() ? walk(path) : [path];
});
for (const path of walk(manifest.targetRoot)) {
  const covered = [...allowedRoots].some((source) => path === source || path.startsWith(`${source}/`));
  requireValue(covered, `production file is outside the copy payload: ${relative(root, join(root, path))}`);
}

if (failures.length) {
  console.error(`Integration manifest check failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Integration manifest complete: ${allCopyPaths.length} payload paths, ${Object.keys(manifest.dependencies.runtimePeers).length + Object.keys(manifest.dependencies.buildDev).length + Object.keys(manifest.dependencies.testDev).length} dependencies, ${baselines.length} visual baselines.`);
