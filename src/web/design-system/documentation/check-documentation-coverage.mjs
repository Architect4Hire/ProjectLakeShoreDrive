import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const documentationDirectory = dirname(fileURLToPath(import.meta.url));
const designSystemDirectory = resolve(documentationDirectory, '..');
const catalog = JSON.parse(readFileSync(join(documentationDirectory, 'catalog.json'), 'utf8'));
const navigation = readFileSync(join(documentationDirectory, 'README.md'), 'utf8');
const extensionPattern = /\.(?:ts|css)$/;

function moduleFile(fromFile, specifier) {
  const base = resolve(dirname(fromFile), specifier);
  for (const candidate of [`${base}.ts`, join(base, 'index.ts')]) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error(`Cannot resolve public export ${specifier} from ${fromFile}`);
}

function collectLeafModules(file, visited = new Set()) {
  if (visited.has(file)) return [];
  visited.add(file);
  const source = readFileSync(file, 'utf8');
  const modules = [];
  const exportPattern = /export\s+(?:type\s+)?(?:\*|\{[\s\S]*?\})\s+from\s+['"](\.[^'"]+)['"]/g;
  for (const match of source.matchAll(exportPattern)) {
    const target = moduleFile(file, match[1]);
    if (target.endsWith('/index.ts')) modules.push(...collectLeafModules(target, visited));
    else modules.push(relative(designSystemDirectory, target).replace(extensionPattern, ''));
  }
  return modules;
}

const publicModules = new Set(collectLeafModules(join(designSystemDirectory, 'public-api.ts')));
const documentedModules = new Set(catalog.flatMap((item) => item.publicModule ? [item.publicModule] : []));
const missing = [...publicModules].filter((module) => !documentedModules.has(module)).sort();
const stale = [...documentedModules].filter((module) => !publicModules.has(module)).sort();
const missingDocuments = [...new Set(catalog.map((item) => item.doc))]
  .filter((doc) => !existsSync(join(documentationDirectory, doc)))
  .sort();
const missingNavigationLinks = [...new Set(catalog.map((item) => item.doc))]
  .filter((doc) => !navigation.includes(`(${doc})`))
  .sort();
const duplicateModules = [...documentedModules].filter(
  (module) => catalog.filter((item) => item.publicModule === module).length > 1,
);

if (missing.length || stale.length || missingDocuments.length || missingNavigationLinks.length || duplicateModules.length) {
  if (missing.length) console.error(`Undocumented public modules:\n- ${missing.join('\n- ')}`);
  if (stale.length) console.error(`Catalog modules not exported publicly:\n- ${stale.join('\n- ')}`);
  if (missingDocuments.length) console.error(`Missing documentation files:\n- ${missingDocuments.join('\n- ')}`);
  if (missingNavigationLinks.length) console.error(`Guides missing from navigation:\n- ${missingNavigationLinks.join('\n- ')}`);
  if (duplicateModules.length) console.error(`Duplicate catalog modules:\n- ${duplicateModules.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(`Documentation covers all ${publicModules.size} public modules across ${catalog.length} catalog entries.`);
}
