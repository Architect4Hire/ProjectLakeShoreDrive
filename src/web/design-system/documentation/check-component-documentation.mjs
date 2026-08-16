import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(readFileSync(join(directory, 'catalog.json'), 'utf8'));
const entries = catalog.filter(({ category, publicModule }) =>
  (category === 'Components' && publicModule !== 'icons/internal/icon-paths') || category === 'Recipes',
);
const documents = new Map();
for (const entry of entries) {
  const grouped = documents.get(entry.doc) ?? [];
  grouped.push(entry);
  documents.set(entry.doc, grouped);
}

const checks = {
  purpose: /(^|\n)## .*purpose|\bpurpose\b/i,
  variants: /(^|\n)## .*(variant|state)|\bvariants?\b|\bstates?\b/i,
  api: /(^|\n)## .*(api|contract|input|output)|\binputs?\b|\boutputs?\b/i,
  accessibility: /(^|\n)## .*accessibility|\baccessible\b|\baria-/i,
  publicImport: /```ts[\s\S]*from ['"]src\/web\/design-system\/public-api['"][\s\S]*```/i,
  templateExample: /```html[\s\S]*```/i,
  guidance: /(^|\n)## .*do \/ don't|\bdo\b[\s\S]*\bdon't\b/i,
  responsive: /(^|\n)## .*responsive|\b(narrow|mobile|viewport|responsive)\b/i,
};

const gaps = [];
for (const [doc, docEntries] of documents) {
  const source = readFileSync(join(directory, doc), 'utf8');
  for (const [facet, pattern] of Object.entries(checks)) {
    if (!pattern.test(source)) gaps.push(`${doc}: missing ${facet}`);
  }
  for (const { publicModule } of docEntries) {
    if (!source.includes(publicModule.split('/').at(-1).replace(/\.(component|service)$/, '')) && facetNeedsModuleName(publicModule)) {
      gaps.push(`${doc}: does not identify ${publicModule}`);
    }
  }
}

function facetNeedsModuleName(publicModule) {
  return publicModule.endsWith('.service');
}

if (gaps.length) {
  console.error(`DS-011 documentation gaps (${gaps.length}):\n- ${gaps.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(`DS-011 documentation is complete for ${entries.length} public component/recipe modules in ${documents.size} guides.`);
}
